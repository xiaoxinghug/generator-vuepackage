const wxp = require('../common/wxp')
const CONFIG = require('../config/index')
const Promise = require('../common/pinkie')

/**
 * options:
 * - isSilenceLogin:是否强制登录，默认false,不强制登录，true为强制登录
 * @param {*} options
 */
module.exports = function(options) {
    let app = getApp()
    return new Promise((resolve, reject) => {
        let wxAccount = []
        let isSilenceLogin = options.isSilenceLogin
        let cx
        app.getFigure()
        .then(res => {
            cx = res
            return wxp.login()
        })
        .then(res => {
            app.logger('【wx.login】 result===>', res)

            if (res && res.code) { // 先静默登录
                let params = {
                    code: res.code,
                    directLogin: true, // directLogin :true 无需授权，静默登录，false需要授权
                    sourceType: 0, //  账号登陆小程序类别，默认是“大众点评”小程序，代号0
                    cx
                }
                return wxp.request({
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    url: CONFIG.DOMAIN + CONFIG.API.LOGIN,
                    data: params
                })
            } else {
                return {
                    code: 100,
                    msg: 'wxp.login fail'
                }
            }
        })
        .then((result) => { // 静默登录
            app.logger('【SilenceLogin】 res==>', result)
            if (result && result.statusCode == 200 && result.data.resultCode == 200) {
                let ret = {}
                let data = result.data
                let token = data.msg.token
                let openId = data.msg.eod
                ret.openId = openId
                ret.token = token || ''
                if (openId) {
                    app.setOpenId(openId)
                }
                if (token) { // 静默登录成功,有token && openId
                    app.setToken(token)
                    resolve({
                        code: 200,
                        ret
                    })
                }
                if (isSilenceLogin) { // 静默登录
                    resolve({
                        code: 200,
                        ret
                    })
                } else {
                    app.logger('【ForceLogin】 start==>', result)
                    wxp.login().then(res => {
                        wxAccount[0] = res
                        return wxp.getUserInfo()
                    }).then(res => {
                        wxAccount[1] = res
                        resolve({
                            code: 201,
                            wxAccount
                        })
                    }).catch(err => {
                        if (err && err.errMsg === 'getUserInfo:fail auth deny') {
                            reject({
                                code: 1041,
                                msg: '未授权用户信息'
                            })
                        } else {
                            reject({
                                code: 104,
                                msg: '微信登陆失败'
                            })
                        }
                    })
                }
            } else {
                if (!isSilenceLogin) { // 强制登录
                    wxp.login()
                .then(res => {
                    wxAccount[0] = res
                    return wxp.getUserInfo()
                }).then(res => {
                    wxAccount[1] = res
                    resolve({
                        code: 201,
                        wxAccount
                    })
                }).catch(err => {
                    if (err && err.errMsg === 'getUserInfo:fail auth deny') {
                        reject({
                            code: 1041,
                            msg: '未授权用户信息'
                        })
                    } else {
                        reject({
                            code: 104,
                            msg: '微信登陆失败'
                        })
                    }
                })
                } else {
                    reject({
                        code: 104,
                        msg: '微信登陆失败'
                    })
                }
            }
        }).catch(err => {
            app.logger('login fail:', err)
            reject({
                code: 100,
                msg: '自动登录失败'
            })
        })
    })
}
