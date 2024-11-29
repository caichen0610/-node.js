import request from '../utils/requests';

// 获取职位列表
export function getList(query) {
    return request({
        url: '/api/jobList',
        method: 'get',
        params: query
    })
}

// 获取职位详情
export function getJobDetail(job_id) {
    return request({
        url: '/api/getJobDetail',
        method: 'get',
        params: { job_id }
    })
}

// 更新职位
export function updateJob(data) {
    return request({
        url: '/api/updateJob',
        method: 'post',
        data
    })
}

// 删除岗位
export function softDeleteJob(data) {
    return request({
        url: '/api/softDeleteJob',
        method: 'post',
        data
    })
}

//发布职位
export function addJob(data) {
    return request({
        url: '/api/addJob',
        method: 'post',
        data
    })
}

