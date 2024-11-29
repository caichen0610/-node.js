import request from '../utils/requests';

//求职者列表
export function getUserList(query) {
    return request({
        url: '/api/getUserList',
        method: 'get',
        params: query
    })
}
