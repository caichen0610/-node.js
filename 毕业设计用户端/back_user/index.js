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

// 用户注册
app.post('/user/register', (req, res) => {
    const { username, phone_number, password } = req.body;

    if (!username || !phone_number || !password) {
        return res.status(400).json({ message: '缺少必要的参数（username, phone_number, password）' });
    }

    const checkUserQuery = 'SELECT * FROM user_info WHERE phone_number = ?';
    db.query(checkUserQuery, [phone_number], (err, result) => {
        if (err) {
            return res.status(500).json({ message: '数据库查询失败', error: err });
        }

        if (result.length > 0) {
            return res.status(400).json({ message: '该手机号码已经注册' });
        }

        const insertUserQuery = `
            INSERT INTO user_info (username, phone_number, password, is_deleted)
            VALUES (?, ?, ?, 0)
        `;

        db.query(insertUserQuery, [username, phone_number, password], (err, result) => {
            if (err) {
                return res.status(500).json({ message: '数据库插入失败', error: err });
            }

            res.json({
                message: '注册成功',
                status: 201,
                data: {
                    user_id: result.insertId,
                    username: username,
                    phone_number: phone_number
                }
            });
        });
    });
});


// 用户登录
app.post('/user/login', (req, res) => {
    const { phone_number, password } = req.body;
    if (!phone_number || !password) {
        return res.status(400).json({ message: '手机号和密码不能为空' });
    }

    const sql = `
        SELECT user_id, username, password
        FROM user_info
        WHERE phone_number = ? AND is_deleted = 0
    `;

    db.query(sql, [phone_number], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '数据库查询错误', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '用户不存在' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: '密码错误' });
        }

        // 登录成功，返回用户信息
        res.json({
            message: '登录成功',
            status: 200,
            data: {
                user_id: user.user_id,
                username: user.username
            }
        });
    });
});

// 获取简历信息渲染到输入框
app.get('/user/getUserResume', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: '缺少 user_id 参数' });
    }
    const sql = `
        SELECT username, phone_number, age, gender, university, job_position, bio
        FROM user_info
        WHERE is_deleted = 0 AND user_id = ?
    `;
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: '数据库查询失败', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: '找不到该用户的简历' });
        }
        res.status(200).json({
            message: '简历信息获取成功',
            data: results[0]
        });
    });
});

// 创建用户简历
app.post('/user/updateUserResume', (req, res) => {
    const { user_id, phone_number, age, gender, university, job_position, bio } = req.body;
    if (!user_id) {
        return res.status(400).json({ message: '缺少 user_id 参数' });
    }
    const sql = `
        UPDATE user_info
        SET phone_number = ?, age = ?, gender = ?, university = ?, job_position = ?, bio = ?
        WHERE user_id = ? AND is_deleted = 0
    `;
    db.query(sql, [phone_number, age, gender, university, job_position, bio, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: '数据库更新失败', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '用户不存在或已被删除' });
        }
        res.status(200).json({
            message: '简历信息更新成功',
            data: {
                user_id,
                phone_number,
                age,
                gender,
                university,
                job_position,
                bio
            }
        });
    });
});


// 根据用户id查询已经投递的求职岗位和面试相关信息
app.get('/user/getUserJob', (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: '缺少 user_id 参数' });
    }
    const jobApplicationQuery = `
        SELECT job_id
        FROM job_application
        WHERE user_id = ? AND is_deleted = 0
    `;
    db.query(jobApplicationQuery, [user_id], (err, jobResults) => {
        if (err) {
            return res.status(500).json({ message: '数据库查询失败', error: err });
        }

        if (jobResults.length === 0) {
            return res.status(404).json({ message: '未找到该用户的职位申请' });
        }

        const jobIds = jobResults.map(item => item.job_id);

        const jobQuery = `
            SELECT job_id, job_name
            FROM job
            WHERE job_id IN (?) AND is_deleted = 0
        `;

        db.query(jobQuery, [jobIds], (err, jobInfo) => {
            if (err) {
                return res.status(500).json({ message: '获取职位信息失败', error: err });
            }

            const userInfoQuery = `
                SELECT user_id, interview_time, interview_location, notice
                FROM user_info
                WHERE user_id = ? AND is_deleted = 0
            `;
            db.query(userInfoQuery, [user_id], (err, userInfo) => {
                if (err) {
                    return res.status(500).json({ message: '获取用户面试信息失败', error: err });
                }

                if (userInfo.length === 0) {
                    return res.status(404).json({ message: '未找到用户面试信息' });
                }
                const interviewData = jobResults.map(application => {
                    const job = jobInfo.find(job => job.job_id === application.job_id);
                    const user = userInfo[0];
                    return {
                        job_id: job ? job.job_id : null,
                        job_name: job ? job.job_name : null,
                        interview_time: user ? user.interview_time : null,
                        interview_location: user ? user.interview_location : null,
                        notice: user ? user.notice : null
                    };
                });
                res.status(200).json({
                    message: '用户职位和面试信息获取成功',
                    data: interviewData
                });
            });
        });
    });
});

// 简历投递
app.post('/user/submitResume', (req, res) => {
    const { user_id, job_id } = req.body;
    if (!user_id || !job_id) {
        return res.status(400).json({ message: '缺少 user_id 或 job_id 参数' });
    }
    const insertQuery = `
        INSERT INTO job_application (user_id, job_id, is_deleted)
        VALUES (?, ?, 0)
    `;
    db.query(insertQuery, [user_id, job_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: '数据库插入失败', error: err });
        }
        res.status(200).json({
            message: '简历投递成功',
            data: { user_id, job_id }
        });
    });
});

// 取消投递
app.post('/user/cancelResume', (req, res) => {
    const { user_id, job_id } = req.body;
    if (!user_id || !job_id) {
        return res.status(400).json({ message: '缺少 user_id 或 job_id 参数' });
    }
    const updateQuery = `
        UPDATE job_application
        SET is_deleted = 1
        WHERE user_id = ? AND job_id = ? AND is_deleted = 0
    `;
    db.query(updateQuery, [user_id, job_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: '数据库更新失败', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '未找到匹配的简历投递记录' });
        }
        res.status(200).json({
            message: '简历投递取消成功',
            data: { user_id, job_id }
        });
    });
});

app.get('/user/getJobDetailList', (req, res) => {
    const { job_name, address } = req.query;
    let query = 'SELECT * FROM job WHERE is_deleted=0';
    const params = [];
    if (job_name) {
        query += ' AND job_name LIKE ?';
        params.push(`%${job_name}%`);
    }
    if (address) {
        query += ' AND address LIKE ?';
        params.push(`%${address}%`);
    }
    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json({ message: '数据库查询失败', error: err });
        }

        if (result.length > 0) {
            res.status(200).json({
                message: '查询成功',
                data: result
            });
        } else {
            res.status(404).json({
                message: '未找到相关职位'
            });
        }
    });
});


app.listen(9090, () => {
    console.log('项目运行于：http://127.0.0.1:9090');
})

//  ©Light 2024年12月
