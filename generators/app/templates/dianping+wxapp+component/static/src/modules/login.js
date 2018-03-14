const wxp = require('../common/wxp')
const Promise = require('../common/pinkie')
const CONFIG = require('../config/index')
const wxLogin = require('./login-wx')

/*
  判断当前用户登陆态，返回token则表示已经登陆
  @param force 强制更新登陆态
  @param noNotice 不需要错误提示
  @param wxAccount 详见wxLogin返回结果
  @param isSilenceLogin 是否静默登录，默认false
*/

module.exports = function(options = {}) {
    const app = getApp()

    return new Promise((resolve, reject) => {
        var showToast = function(config) {
            if (!options.noNotice) {
                wx.showToast(config)
            } else {
                reject({
                    code: 100,
                    msg: '自动登陆失败'
                })
            }
        }

        const token = app.getToken()
        const openId = app.getOpenId()
        const thirdUser = app.getThirdUser()
        if (thirdUser && !options.force) {
            return resolve(thirdUser)
        }
        if (!options.force && token) {
            return resolve({
                token,
                openId
            })
        }

        app.getFigure()
            .then(cx => {
                const DPLogin = (wxAccount, cx) => {
                    if (wxAccount) {
                        app.setWxUser(wxAccount[1].userInfo)
                    }

                    let data = {
                        code: wxAccount[0].code,
                        rawData: wxAccount[1].rawData,
                        signature: wxAccount[1].signature,
                        encryptedData: wxAccount[1].encryptedData,
                        iv: wxAccount[1].iv,
                        cx
                    }
                    wxp.request({
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        url: CONFIG.DOMAIN + CONFIG.API.LOGIN,
                        data: data
                    })
                    .then((res) => {
                        if (res && res.statusCode == 200 && res.data.resultCode == 200) {
                            app.logger('DPLogin success==>')
                            const data = res.data
                            const token = data.msg.token
                            const openId = data.msg.eod
                            let ret = {}
                            if (openId) {
                                ret.openId = openId
                                app.setOpenId(openId)
                            }
                            if (token) {
                                ret.token = token
                                app.setToken(token)
                                resolve(ret)
                            } else {
                                const _thirdUser = {
                                    thirdUid: data.thirdUid,
                                    thirdUidAuth: data.thirdUidAuth
                                }
                                app.setThirdUser(_thirdUser)
                                resolve(_thirdUser)
                            }
                        } else if (res.data.resultCode == 500) {
                            showToast({
                                title: '微信登录态失败',
                                icon: 'success',
                                complete: () => {
                                    reject({
                                        code: 100,
                                        msg: '获取微信登陆态失败'
                                    })
                                }
                            })
                        } else {
                            showToast({
                                title: '服务出错了',
                                icon: 'success',
                                complete: () => {
                                    reject({
                                        code: 100,
                                        msg: '登录服务出错'
                                    })
                                }
                            })
                        }
                    })
                    .catch((err) => {
                        console.error('[Login Fail]===>', err)
                        showToast({
                            title: '登录失败',
                            icon: 'success',
                            complete: () => {
                                reject(err)
                            }
                        })
                    })
                }

                if (options.wxAccount) {
                    DPLogin(options.wxAccount, cx)
                } else {
                    wxLogin({ isSilenceLogin: options.isSilenceLogin })
                .then(res => {
                    if (res.code == 200 && res.ret) { // 静默登录处理
                        resolve(res.ret)
                    } else if (res.code == 201 && res.wxAccount) { // 强制登录
                        app.logger('DPLogin start==>')
                        DPLogin(res.wxAccount, cx)
                    } else {
                        resolve()
                    }
                }, err => {
                    console.log('微信登录失败', err)
                    resolve({
                        code: 1041,
                        msg: '用户拒绝授权'
                    })
                }).catch((err) => {
                    console.log('微信登录失败', err)
                    resolve({
                        code: 104,
                        msg: '微信登录失败'
                    })
                })
                }
            })
            .catch(err => {
                console.log('绑定手机号失败:', err)
            })
    })
}
