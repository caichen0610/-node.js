import request from '../utils/requests'

export function login(data) {
    return request({
        url: '/api/login',
        method: 'post',
        data
    })
}