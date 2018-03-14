const wxp = require('./wxp')
const Promise = require('./pinkie')
const CONFIG = require('../config/index')
const APP_NAME = CONFIG.APP_NAME
const APP_VERSION = CONFIG.VERSION
const Logout = require('../modules/logout')
const extend = require('../utils/extend')

function mapiRequest(req) {
    let app = getApp()
    // 小程序版本还未和app参数对齐
    return new Promise((resolve, reject) => {
        app.getSystemInfo().then(systemInfo => {
            let _header = {
                'dpid': app.getOpenId(),
                'token': app.getToken(),
                'appVersion': CONFIG.VERSION,
                'appName': CONFIG.APP_NAME,
                'isMicroMessenger': 'true',
                'microMsgVersion': systemInfo.version,
                'network-type': systemInfo.networkType,
                'phone-brand': systemInfo.brand,
                'phone-model': systemInfo.model,
                'platform': systemInfo.platform.indexOf('ios') > -1 ? 'iPhone' : 'Android',
                'platformVersion': systemInfo.system.split(' ')[1] || ''
            }
            console.log('mapi_header:', _header)
            req.header = extend(req.header || {}, _header)

            req.success = function(res) {
                if (res && res.statusCode == 200) {
                    resolve(res.data)
                } else {
                    reject(res.errMsg)
                }
            }
            req.fail = function(err) {
                reject(err.errMsg)
            }
            wx.request(req)
        })
    }).catch(err => {
        console.log('mapi_request_err:', err)
    })
}

function wrapRequest(req, promise, opts = {}) {
    return new Promise((resolve, reject) => {
        wxp.request(req).then((res) => {
            if (res && res.statusCode == 200) {
                let loginCode = res.data.loginCode
                if (loginCode != undefined && loginCode != 200 && req.data && req.data.token) {
                    if (opts.checkToken) {
            // 登录失效
                        console.log('Warn: 登陆态失效，正在进行登出')
                        Logout()
                    }
                }
            }
            promise.resolve(res)
        }).catch(() => {
            promise.reject()
        })
    })
}
//  统一封装request API,加入版本号，用户登录态，加密等功能，维护请求队列，优先级
const LIMIT = 10
let requestCount = 0
let queue = [] // {req, opts}
let _config = {
    level: 1,
    checkToken: true
}

const requestManager = {
    push: function(obj, promise, opts) {
        let index = -1
        for (var i = 0; i < queue.length; i++) {
            let anRequest = queue[i]
            if (anRequest.opts.level > opts.level) {
                index = i
                break
            }
        }
        const newRequest = {
            req: obj,
            promise: promise,
            opts: opts
        }
        if (index === -1) {
            queue.push(newRequest)
        } else {
            queue.splice(index, 0, newRequest)
        }
        this.run()
    },
    run: function() {
        const doRequest = (anRequest) => {
            requestCount++

            let req = anRequest.req
            let promise = anRequest.promise
            let opts = anRequest.opts
            let data = req.data || {}
            let token = getApp().getToken()

            if (typeof data === 'object') {
                data.mimaversion = APP_VERSION
                data.appversion = APP_VERSION
                data.appname = APP_NAME
            } else {
                console.error('Request data must be object!')
            }
            if (token) {
                data.token = token
            }
            req.data = data

            const done = () => {
                requestCount--
                this.run()
            }
            const _complete = req.complete
            req.complete = function() {
                done()
                _complete && _complete()
            }

            return wrapRequest(req, promise, opts)
        }
        if (requestCount < LIMIT && queue.length) {
            let anRequest = queue.shift()
            doRequest(anRequest)
        }
    }
}

/**
 * 统一封装接口，使用前请确定你的接口是符合类似node-wxapp-web的接口规范的
 * obj{Object} - 请求对象
 * opts{Object} - 可配置项
 * opts.level{Number} - 请求优先级
 * opts.checkToken{Boolean} -是否校验token
 */
module.exports = function(obj, opts) {
    if (opts && opts.isMapiRequest) {
        return mapiRequest(obj)
    }
    return new Promise((resolve, reject) => {
        opts = extend(_config, opts)
        try {
            requestManager.push(obj, {
                resolve: resolve,
                reject: reject
            }, opts)
        } catch (e) {
            console.log('[Request] Fail:', e)
      // 发送错误时，重置防止阻塞,同时启用正常的API调用
            requestCount = 0
            return wrapRequest(obj, {
                resolve,
                reject
            }, opts)
        }
    })
}
