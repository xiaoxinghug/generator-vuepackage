const wxp = require('../common/wxp')
const CONFIG = require('../config/index')
const Promise = require('./promise')
const Nav = require('./nav')
const Event = require('../common/event')

//  代表大众点评小程序
const sourceType = 0

let niceToHaveFlag = false
let openId

module.exports = {
  /**
   * 获得当前当前用户的token和openId,如果不存在会进行静默登陆
   * @returns Promise
   * {
   *  code: 200|500
   *  token,
   *  openId,
   *  msg: '错误原因'
   * }
   */
    getUserInfo: function() {
        return new Promise(resolve => {
            let token = getApp().getToken()
            let openId = getApp().getOpenId()
            if (token) {
                resolve({
                    code: 200,
                    token,
                    openId
                })
            } else {
                resolve({
                    code: 500,
                    msg: '未登录'
                })
            }
        })
    },
  /**
   * 静默登陆，对于用户无感知
   * @returns Promise
   * {
   *    code: 200|500,
   *    token,
   *    openId,
   *    msg: '错误消息'
   * }
   */
    niceToHave: function() {
        let that = this
        return new Promise(resolve => {
            niceToHaveFlag = true
            let cx
            getApp().getFigure()
                .then(res => {
                    cx = res
                    return wxp.login()
                }).then(res => {
                    let code = res.code

                    return wxp.request({
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        url: CONFIG.DOMAIN + CONFIG.API.LOGIN,
                        data: {
                            code,
                            sourceType: sourceType, //  业务来源
                            directLogin: true,
                            cx
                        }
                    })
                }).then(res => {
                    if (res && res.statusCode == 200 && res.data) {
                        let msg = res.data.msg
                        let data = res.data

                        //  获得openId
                        if (msg && msg.eod) {
                            openId = msg.eod
                            that._setUserInfo({
                                openId
                            })
                        }

                        //  第三方登陆失败
                        if (data.resultCode == 100) {
                            resolve({
                                code: 500,
                                msg: '需要微信授权登陆'
                            })
                        } else if (data.resultCode == 200) {
                            //  第三方登陆成功
                            if (msg && msg.token) {
                                that._setUserInfo({
                                    token: msg.token,
                                    openId: msg.eod
                                })
                                resolve({
                                    code: 200,
                                    token: msg.token,
                                    openId: msg.eod
                                })
                            } else {
                                resolve({
                                    code: 500,
                                    msg: '未绑定手机号'
                                })
                            }
                        } else {
                            resolve({
                                code: 500,
                                msg: '服务出错，微信登陆失败'
                            })
                        }
                    } else {
                        resolve({
                            code: 500,
                            msg: '接口出错了'
                        })
                    }
                }).catch(e => {
                    resolve({
                        code: 500,
                        msg: '出错了' + e.message
                    })
                })
        })
    },
  /**
   * 打开登陆页
   * @param [redirectUrl] - 登陆后成功后需要重新打开的页面，默认为当前页面
   * @param [opts]{Object}
   * @param [opts.close]{Boolean} - 是否关闭当前页面，默认不关闭
   * @param [opts.onlyAuth]{Boolean} - 只进行鉴权登陆（如果已经尝试过静默登陆）
   */
    goToLoginPage: function(redirectUrl, opts = {}) {
        this._navAfterLogin({
            ...opts,
            redirectUrl
        })
    },
  /**
   * 必须登陆，微信授权登陆|绑定手机号
   * @param opts
   * @param [opts.close]{Boolean} - 是否关闭当前页面，默认不关闭
   * @param [opts.redirectUrl]{String} - 登陆后跳转页面
   * @param [opts.urlType]{String} - 跳转页面类型'h5|native'
   * @return Promise
   *
   * resovle - 登陆成功
   * {
   *    token,
   *    openId
   * }
   * reject - 登陆失败
   * {
   *    msg
   * }
   */
    must: function(opts = {}) {
        return new Promise((resolve, reject) => {
            const doJob = () => {
                const loginFn = (data) => {
                    openId = data.openId || getApp().getOpenId()
                    if (data.isSuccess) {
                        resolve({
                            token: data.token,
                            openId: openId
                        })
                    } else {
                        reject(data.msg)
                    }

                    Event.off('loginEnd', loginFn)
                }
                //  只走绑定流程，避免走2次静默登陆
                opts.onlyAuth = true
                this._navAfterLogin(opts)
                if (!opts.redirectUrl) {
                    //  没有重定向时使用事件广播
                    Event.on('loginEnd', loginFn)
                }
            }
            if (niceToHaveFlag) {
                doJob()
            } else {
                this.niceToHave().then(res => {
                    if (res.code === 200) {
                        resolve(res)
                    } else {
                        doJob()
                    }
                })
            }
        })
    },
    /**
     * @param [opts.close]{Boolean} - 是否关闭当前页面，默认不关闭
     * @param [opts.redirectUrl]{String} - 登陆后跳转页面
     * @param [opts.urlType]{String} - 跳转页面类型'h5|native'
     * 保证有登陆态
     */
    ensure: function(opts = {}) {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(res => {
                if (res && res.code === 200) {
                    return {
                        token: res.token,
                        openId: res.openId
                    }
                } else {
                    return this.must(opts)
                }
            }).then(res => {
                resolve({
                    token: res.token,
                    openId: res.openId
                })
            }).catch(err => {
                console.log('登录失败', err)
                reject({
                    msg: '登录失败，请稍后再试'
                })
            })
        })
    },
    _setUserInfo: function(data = {}) {
        if (data.token) {
            getApp().setToken(data.token)
        }
        if (data.openId) {
            getApp().setOpenId(data.openId)
        }
    },
    _navAfterLogin: function(opts = {}) {
        let {
            redirectUrl,
            type,
            close,
            onlyAuth
        } = opts

        onlyAuth = onlyAuth ? 1 : 0
        type = type || ''

        if (redirectUrl) {
            redirectUrl = encodeURIComponent(redirectUrl)
        } else {
            redirectUrl = ''
        }

        let url = `/pages/mobile/mobile?onlyAuth=${onlyAuth}&redirectUrl=${redirectUrl}&type=${type}`

        if (close) {
            wx.redirectTo({
                url
            })
        } else {
            Nav({
                url
            })
        }
    }
}
