//api/index.js

import request from "../utils/requests";


export function getList(query) {
    return request({
        url: "/user/getJobDetailList",
        method: 'get',
        params: query
    })
}

export function submitResume(data) {
    return request({
        url: "/user/submitResume",
        method: 'post',
         data
    })
}


