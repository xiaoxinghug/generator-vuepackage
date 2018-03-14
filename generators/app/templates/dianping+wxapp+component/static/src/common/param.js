const version = require('../config/index').VERSION
let token

//  为所有请求封装mimaversion和token字段
module.exports = (obj) => {
    let data = obj.data || {}

    if (!token) {
        const app = getApp()
        token = app.getToken()
    }

    if (typeof data === 'object') {
        data.mimaversion = version
    } else {
        console.warn('Request data need be object as recommended!')
    }
    if (token) {
        data.token = token
    }
    obj.data = data
    return obj
}
