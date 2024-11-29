import request from "../utils/requests";

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

