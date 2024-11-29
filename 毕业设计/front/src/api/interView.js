import request from '../utils/requests';

// 更新面试时间，地点，发布通知
export function updateInterView(data) {
    return request({
        url: '/api/updateInterview',
        method: 'post',
        data
    })
}

// 面试管理获取所有用户投递职位表
export function getUserJob(query) {
    return request({
        url: '/api/getUserJob',
        method: 'get',
        params: query
    })
}
