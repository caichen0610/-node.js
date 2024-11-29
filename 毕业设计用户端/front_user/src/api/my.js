//api/my.js

import request from "../utils/requests";

export function getUserJob(query) {
    return request({
        url: '/user/getUserJob',
        method: 'get',
        params: query
    })
}

export function cancelResume (data) {
    return request({
        url: '/user/cancelResume',
        method: 'post',
        data
    })
}
export function getUserResume (query) {
    return request({
        url: '/user/getUserResume',
        method: 'get',
        params: query
    })
}
export function updateUserResume (data) {
    return request({
        url: '/user/updateUserResume',
        method: 'post',
        data
    })
}