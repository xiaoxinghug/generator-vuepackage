const wxp = require('./common/wxp')
const config = require('./config/index')
const compose = require('./utils/compose')
const Event = require('./common/event')
const Global = require('./common/global')
const Distance = require('./utils/distance')
const lx = require('./utils/npm/lx-analytics')
const extend = require('./utils/extend')

const DISTANCE_LIMIT = 100 // 判断用户定位变化阈值

let INIT_STATE = {
    name: '大众点评',
    version: '0.1.0',
    store: {},
    debug: config.DEBUG,
    isStart: false,
  //  是否写入cookie
    isCookieInValid: false
}

let app = {
    data: extend({}, INIT_STATE),

    setWebviewCookieState(invalid) {
        this.data.isCookieInValid = invalid
    },

    shouldUpdateWebviewCookie() {
        return this.data.isCookieInValid
    },

    isDebug() {
        return this.data.debug
    },
    onError(error) {
        console.log(error)
    },

    clearMemory() {
        this.data = extend({}, INIT_STATE)
        console.log(this.data)
    },

    onLaunch(options) {
        console.log(' ========== Application onLaunch ========== ')
        console.log('启动参数:', options)
        this.setLaunchOptions(options)
        this.setDebugInfo()
    // 灵犀上报配置
        lx.init(config.LXDOMAIN, {
            appnm: 'dianping_wxapp',
            category: 'dianping_nova'
        })
        this.setUTM(options)
    },

    setDebugInfo() {
        let debugInfo = wx.getStorageSync('debug')
        if (debugInfo) {
            debugInfo = JSON.parse(debugInfo)
        }
        if (debugInfo && debugInfo.domain) {
            let domain = debugInfo.domain
            if (domain.m) {
                config.DOMAIN = 'https://m.51ping.com'
            }
            if (domain.mapi) {
                config.MAPI_DOMAIN = 'https://mapi.51ping.com'
            }
        }
    },

    onShow(options) {
    // app 启动
        console.log(' ========== Application onShow ========== ')
        console.log('启动参数:', options)
    //  每次重新进入小程序，强制要求webview更新cookie
        const invalid = true
        this.setWebviewCookieState(invalid)

        // 缓存数据
        this.setShowOptions(options)

        if (this.state === 'HIDE') {
            this.state = 'SHOW'
            console.log('[Update GPS start]')
            wxp.getLocation({
                type: 'wgs84'
            })
        .then((res) => {
            const locationPrev = this.getLocation()
            const locationCurr = res
            const notNeedUpdate = locationPrev &&
            locationCurr &&
            Distance(locationPrev, locationCurr) < DISTANCE_LIMIT
            if (!notNeedUpdate) {
                this.setLocation({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                this.trigger('Location-Change', locationCurr)
            }
        })
        .catch((err) => {
            console.log('[Update Geo Fail]===>', err)
        })
        }
    // 增加灵犀打点
        lx.start()
    },
    onHide(options) {
        console.log(' ========== Application onHide ========== ')
        this.state = 'HIDE'
        lx.quit()
    },
    setUTM(options = {}) {
        let query = options.query
        let utm = {}
        utm.utm_source = 'dianping-wxapp'
        if (query) {
            if (query.serviceType == '39') { // 来自微信搜索
                utm.utm_source = 'wechat_search'
            } else if (options.scene == 1034) {
                utm.utm_source = 'wxpay_order'
            } else {
                const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
                utmKeys.map(item => {
                    if (query && query[item]) {
                        utm[item] = query[item]
                    }
                })
            }
        }
        app.logger('utm信息:', JSON.stringify(utm))
        lx.setUTM(utm)
    }
}

app = compose(app, Event, Global)

App(app)
