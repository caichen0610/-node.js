const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'online'
})

// 管理员登录
app.post('/api/login', (req, res) => {
    const { password, phone } = req.body;

    const sql = `SELECT id, phone,name, password FROM admin WHERE is_deleted = 0 AND phone = ? AND password = ?`;

    db.query(sql, [phone, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '查询错误', error: err });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: '未查到该用户' });
        }

        res.json({
            status: 200,
            message: '登录成功',
            userId: results[0].id,
            name: results[0].name
        });
    });
});

// 获取职位列表接口，支持职位名和地址的查询
app.get('/api/jobList', (req, res) => {
    const { job_name, address } = req.query;
    let sql = 'SELECT * FROM job WHERE is_deleted = 0';
    let queryParams = [];
    if (job_name) {
        sql += ' AND job_name LIKE ?';
        queryParams.push(`%${job_name}%`);
    }
    if (address) {
        sql += ' AND address LIKE ?';
        queryParams.push(`%${address}%`);
    }
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ message: '错误', error: err });
        }

        if (results.length === 0) {
            return res.status(200).json({ message: '无结果', data: [] });
        }
        res.status(200).json({
            message: '成功',
            data: results
        });
    });
});

// 获取职位详情
app.get('/api/getJobDetail', (req, res) => {
    const { job_id } = req.query;
    const sql = `SELECT * FROM job WHERE job_id= ?`;
    db.query(sql, [job_id], (err, resulets) => {
        if (err) return res.send(err.message);
        res.json(resulets[0]);
    })
})


// 更新职位
app.post('/api/updateJob', (req, res) => {
    const { job_id, job_name, company_name, address, salary, job_description, requirements } = req.body;

    if (!job_id) {
        return res.status(400).json({ message: 'id为必须字段' });
    }

    let sql = 'UPDATE job SET ';
    let queryParams = [];

    if (job_name) {
        sql += 'job_name = ?, ';
        queryParams.push(job_name);
    }
    if (company_name) {
        sql += 'company_name = ?, ';
        queryParams.push(company_name);
    }
    if (address) {
        sql += 'address = ?, ';
        queryParams.push(address);
    }
    if (salary) {
        sql += 'salary = ?, ';
        queryParams.push(salary);
    }
    if (job_description) {
        sql += 'job_description = ?, ';
        queryParams.push(job_description);
    }
    if (requirements) {
        sql += 'requirements = ?, ';
        queryParams.push(requirements);
    }
    sql = sql.slice(0, -2);
    sql += ' WHERE job_id = ?';
    queryParams.push(job_id);
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ message: '错误', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: '错误' });
        }
        res.status(200).json({
            message: '更新成功',
            affectedRows: results.affectedRows
        });
    });
});


// 软删除职位
app.post('/api/softDeleteJob', (req, res) => {
    const { job_id } = req.body;
    if (!job_id) {
        return res.status(400).json({ message: 'Job ID is required' });
    }
    const sql = 'UPDATE job SET is_deleted = 1 WHERE job_id = ?';
    db.query(sql, [job_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '错误', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: '未找到' });
        }
        res.status(200).json({
            message: '删除成功！',
            affectedRows: results.affectedRows
        });
    });
});


// 新增岗位
app.post('/api/addJob', (req, res) => {
    const { job_name, company_name, address, salary, job_description, requirements } = req.body;
    if (!job_name || !company_name || !address || !salary) {
        return res.status(400).json({ message: '缺少必要字段！' });
    }
    const sql = 'INSERT INTO job (job_name, company_name, address, salary, job_description, requirements, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [job_name, company_name, address, salary, job_description || '', requirements || '', 0], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '查询错误', error: err });
        }
        res.status(201).json({
            message: '新增成功！',
            job_id: results.insertId
        });
    });
});



/**
 * 简历管理
 */

// 获取求职者简历列表（条件查询求职者学校，意向岗位）
app.get('/api/getUserList', (req, res) => {
    const { job_name, university } = req.query;

    let sql = `
        SELECT ua.application_id, ua.user_id, ua.job_id, u.username, u.phone_number, u.university, u.gender, u.bio,u.job_position ,
               j.job_name, j.company_name, j.salary, j.job_description
        FROM job_application ua
        JOIN user_info u ON ua.user_id = u.user_id
        JOIN job j ON ua.job_id = j.job_id
        WHERE ua.is_deleted = 0
    `;

    const conditions = [];
    const params = [];

    if (job_name) {
        conditions.push("j.job_name LIKE ?");
        params.push(`%${job_name}%`);
    }

    if (university) {
        conditions.push("u.university LIKE ?");
        params.push(`%${university}%`);
    }
    if (conditions.length > 0) {
        sql += ' AND ' + conditions.join(' AND ');
    }
    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ message: '错误', error: err });
        }
        res.status(200).json({
            message: '查询成功',
            data: results
        });
    });
});

// 面试管理 - 更新面试时间、地点和通知
app.post('/api/updateInterview', (req, res) => {
    const { user_id, interview_time, interview_location, notice } = req.body;
    if (!user_id || !interview_time || !interview_location || !notice) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const sql = `
        UPDATE user_info
        SET interview_time = ?, interview_location = ?, notice = ?
        WHERE user_id = ? AND is_deleted = 0
    `;
    db.query(sql, [interview_time, interview_location, notice, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database update error', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already deleted' });
        }
        res.status(200).json({
            message: 'Interview details updated successfully',
            data: { user_id, interview_time, interview_location, notice }
        });
    });
});

// 面试管理获取所有用户投递职位表
app.get('/api/getUserJob', (req, res) => {
    const jobApplicationQuery = `
        SELECT user_id, job_id
        FROM job_application
        WHERE is_deleted = 0
    `;
    db.query(jobApplicationQuery, (err, jobResults) => {
        if (err) {
            return res.status(500).json({ message: 'Database query error', error: err });
        }
        if (jobResults.length === 0) {
            return res.status(404).json({ message: 'No job applications found' });
        }
        const jobIds = [...new Set(jobResults.map(job => job.job_id))];  // 去重
        const userIds = [...new Set(jobResults.map(job => job.user_id))];  // 去重

        const jobQuery = `
            SELECT job_id, job_name, company_name, salary, job_description
            FROM job
            WHERE job_id IN (?) AND is_deleted = 0
        `;
        const userInfoQuery = `
            SELECT user_id, username, interview_time, interview_location, notice
            FROM user_info
            WHERE user_id IN (?) AND is_deleted = 0
        `;
        db.query(jobQuery, [jobIds], (err, jobInfo) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching job information', error: err });
            }

            db.query(userInfoQuery, [userIds], (err, userInfo) => {
                if (err) {
                    return res.status(500).json({ message: 'Error fetching user information', error: err });
                }
                const result = jobResults.map(application => {
                    const job = jobInfo.find(job => job.job_id === application.job_id);
                    const user = userInfo.find(user => user.user_id === application.user_id);

                    return {
                        user_id: application.user_id,
                        job_id: application.job_id,
                        username: user.username,
                        job_name: job ? job.job_name : null,
                        company_name: job ? job.company_name : null,
                        salary: job ? job.salary : null,
                        job_description: job ? job.job_description : null,
                        interview_time: user ? user.interview_time : null,
                        interview_location: user ? user.interview_location : null,
                        notice: user ? user.notice : null
                    };
                });
                res.status(200).json({
                    message: '成功',
                    applications: result
                });
            });
        });
    });
});


app.listen(8081, () => {
    console.log('后端项目已运行于：http://127.0.0.1:8081');
})
    //  ©Light 2024年12月