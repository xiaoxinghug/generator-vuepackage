const wxp = require('./wxp')
const Promise = require('./pinkie')
const LoginAPI = require('../public/login')
const getUUID = require('../modules/uuid')
const geo = require('../modules/geo')
const finger = require('../utils/npm/finger')
const nav = require('../common/nav')
const extend = require('../utils/extend')
const lx = require('../utils/npm/lx-analytics')

//  用户选择城市 or 经纬度城市
const CACHE_CITY = ['city', 'loccity']
const CACHE_LOCATION = 'geo'
const CACHE_TOKEN = 'token'
const CACEH_UUID = 'uuid'
const CACHE_OPENID = 'openid'
const KEY_CACHE_LX = 'lxdata'
const UTM_SOURCE = 'utm'
const CACHE_LAUNCH = 'launchData'
const CACHE_CX = 'cx'
const CACHE_UNIONID = 'unoionid'
const CACHE_SHOW = 'showData'

//  任务映射表,位置0代表level-1，位置1代表level-2
const taskMapping = [{
    city: geo.getCity.bind(geo),
    locCity: geo.getLocCity.bind(geo),
    location: geo.getLocation.bind(geo),
    uuid: getUUID,
    token: LoginAPI.must.bind(LoginAPI),
    openId: LoginAPI.niceToHave.bind(LoginAPI)
}, {
    city: geo.getCity.bind(geo),
    locCity: geo.getLocCity.bind(geo),
    location: geo.getLocation.bind(geo),
    uuid: getUUID,
    token: LoginAPI.niceToHave.bind(LoginAPI),
    openId: LoginAPI.niceToHave.bind(LoginAPI)
}]

const parseTask = function(tasks) {
    let taskObj = {}
    tasks.map((task) => {
        taskObj[task.name] = task
    })
    //  getCity的操作必然会调用getLocCity,必然会调用getLocation
    if (taskObj.city) {
        delete taskObj.locCity
        delete taskObj.location
    } else if (taskObj.locCity) {
        delete taskObj.location
    }
    //  登陆操作必然会拿到openId
    if (taskObj.token) {
        delete taskObj.openId
    }

    let newTasks = []
    let taskName
    for (taskName in taskObj) {
        if (taskObj.hasOwnProperty(taskName)) {
            let task = taskObj[taskName]
            let level = task.level
            let fn = taskMapping[level - 1][taskName]
            newTasks.push({
                name: taskName,
                fn: fn
            })
        }
    }
    return newTasks
}

const Global = {
    /*
      param {tasks} Array<Object>
        - param {task} Object {name: 'token': level: 1}

      需要的全局参数信息：
      (包括token, uuid, openId, city, locCity, location)
      1: must（必须具备），比如下单必须要token
      2: recommend（尽量有），比如搜索列表有token可以优化结果
     */
    init(tasks) {
        return new Promise((resolve) => {
            let tasksMust = []
            let tasksRecomm = []

            tasks.map((task) => {
                if (task.level === 1) {
                    tasksMust.push(task)
                } else if (task.level === 2) {
                    tasksRecomm.push(task)
                }
            })

            //  目前在任务较少的情况，recommend任务也默认执行，后续可优化
            tasks = tasksMust.concat(tasksRecomm)

            let cache
            this.getCache().then((res) => {
                let key
                for (key in res) {
                    if (res.hasOwnProperty(key) && res[key]) {
                        for (let i = 0; i < tasks.length; i++) {
                            if (tasks[i].name === key) {
                                tasks.splice(i, 1)
                            }
                        }
                    }
                }
                if (tasks.length) {
                    cache = res
                    tasks = parseTask(tasks)
                    return tasks
                } else {
                    resolve({
                        code: 200,
                        data: res
                    })
                }
            }).then((tasks) => {
                if (tasks && tasks.length) {
                    let promises = tasks.map(function(task) {
                        return task.fn()
                    })
                    return Promise.all(promises)
                } else {
                    resolve({
                        code: 200
                    })
                }
            }).then((res) => {
                let obj = {}
                let code = 200
                tasks.map((task, index) => {
                    if (task.name === 'token') {
                        if (!res[index].token) {
                            code = 100
                        } else {
                            obj.token = res[index].token
                        }
                        obj.openId = res[index].openId
                    } else {
                        obj[task.name] = res[index]
                    }
                })
                resolve({
                    code: code,
                    data: extend(cache, obj)
                })
            })
                .catch((err) => {
                    console.log('[App init Fail]', err)
                    if (err && err.code) {
                        resolve(err)
                    } else {
                        resolve({
                            code: 500,
                            msg: err
                        })
                    }
                })
        })
    },

    isLocationCity() {
        const locCity = this.getLocCity()
        const city = this.getCity()
        if (locCity && city && locCity.cityId === city.cityId) {
            return true
        }
    },

    _getOpenId() {
        return new Promise((resolve) => {
            wxp.getStorage({
                key: CACHE_OPENID
            }).then((res) => {
                resolve(res.data)
            }).catch(() => {
                resolve()
            })
        })
    },

    //  openId用于支付场景
    getOpenId() {
        return this.data.openId
    },

    setOpenId(openId) {
        if (openId) {
            this.data.openId = openId
            return wxp.setStorage({
                key: CACHE_OPENID,
                data: openId
            })
        }
    },

    _getToken() {
        return new Promise((resolve) => {
            wxp.getStorage({
                key: CACHE_TOKEN
            }).then((res) => {
                resolve(res.data)
            }).catch(() => {
                resolve()
            })
        })
    },

    getToken() {
        return this.data.token
    },

    setToken(token) {
        this.data.token = token

        //  重置webview登陆cookie
        if (token) {
            let invalid = true
            this.setWebviewCookieState(invalid)
        }

        return wxp.setStorage({
            key: CACHE_TOKEN,
            data: token
        })
    },

    getThirdUser(user) {
        return this.data.thirdUser
    },

    setThirdUser(user) {
        this.data.thirdUser = user
        return wxp.setStorage({
            key: CACHE_UNIONID,
            data: user
        })
    },

    getWxUser() {
        return this.data.wxUser
    },

    setWxUser(user) {
        this.data.wxUser = user
    },

    _getLocation() {
        //  resolve locationInfo
        return new Promise((resolve) => {
            wxp.getStorage({
                key: CACHE_LOCATION
            }).then((res) => {
                resolve(res.data)
            }).catch(() => {
                resolve()
            })
        })
    },

    getLocation() {
        return this.data.locationInfo && this.data.locationInfo.location
    },

    getLocationInfo() {
        return this.data.locationInfo
    },

    setLocation(location) {
        if (!location) return

        const locationInfo = {
            lastModify: new Date().getTime(),
            location: location
        }
        this.data.locationInfo = locationInfo

        wx.setStorage({
            key: CACHE_LOCATION,
            data: locationInfo
        })
    },

    _getUUID() {
        return new Promise((resolve) => {
            wxp.getStorage({
                key: CACEH_UUID
            }).then((res) => {
                resolve(res.data)
            }).catch(() => {
                resolve()
            })
        })
    },

    getUUID() {
        return this.data.uuid
    },

    setUUID(uuid) {
        this.data.uuid = uuid
        wx.setStorage({
            key: CACEH_UUID,
            data: uuid
        })
    },

    _getCity(isGeo) {
        // 内部使用，获取缓存城市,失败返回空
        return new Promise((resolve) => {
            wxp.getStorage({
                key: isGeo ? CACHE_CITY[1] : CACHE_CITY[0]
            }).then((res) => {
                resolve(res.data)
            }).catch(() => {
                resolve()
            })
        })
    },

    getCity() {
        return this.data.cityInfo && this.data.cityInfo.city
    },

    _setCity(city, isGeo) {
        this.setCity(city, {
            isGeo: isGeo,
            noStorage: true
        })
    },

    setCity(city, opts) {
        if (!city) return
        if (city.cityId && city.cityName) {
            opts = opts || {}

            let lastModify = new Date().getTime()
            if (opts.isDefault) {
                lastModify = 0
            }

            const cityInfo = {
                lastModify: lastModify,
                city: city
            }
            if (opts.isGeo) {
                this.data.locCityInfo = cityInfo
            } else {
                this.data.cityInfo = cityInfo
            }

            if (!opts.noStorage) {
                wx.setStorage({
                    key: opts.isGeo ? CACHE_CITY[1] : CACHE_CITY[0],
                    data: cityInfo
                })
            }
        } else {
            console.log('setCity失败')
        }
    },

    _getLocCity() {
        // 内部使用，获取缓存城市,失败返回空
        return this._getCity(true)
    },

    getCityInfo(isGeo) {
        return this.data.cityInfo
    },

    getLocCityInfo() {
        return this.data.locCityInfo
    },

    setUserInfo(userInfo) {
        this.data.userInfo = userInfo
    },

    getUserInfo(userInfoRaw) {
        let that = this
        return new Promise(resolve => {
            if (this.data.userInfo) {
                resolve({
                    code: 200,
                    userInfo: this.data.userInfo
                })
            } else {
                // 调用登录接口
                try {
                    wx.getUserInfo({
                        withCredentials: false,
                        success: function(res) {
                            that.setUserInfo(res.userInfo)
                            resolve({
                                code: 200,
                                userInfo: res.userInfo
                            })
                        },
                        fail: function() {
                            resolve({
                                code: 100,
                                msg: '获取用户微信信息失败'
                            })
                        }
                    })
                } catch (error) {
                    resolve({
                        code: 100,
                        msg: '获取用户微信信息err'
                    })
                }
            }
        })
    },

    getLocCity() {
        return this.data.locCityInfo && this.data.locCityInfo.city
    },

    store(key, data) {
        this.data.store[key] = data
    },

    retrieve(key) {
        return this.data.store[key]
    },

    clear(key) {
        this.data.store[key] = undefined
    },

    //  获取切换城市、定位城市、经纬度缓存
    getCache() {
        return new Promise((resolve) => {
            let tasks = [this._getLocation(), this._getCity(), this._getLocCity(), this._getUUID(), this._getToken(), this._getOpenId()]

            const memory = [this.getLocationInfo(), this.getCityInfo(), this.getLocCityInfo(), this.getUUID(), this.getToken(), this.getOpenId()]

            //  如果内存中以及有全部的数据，则不在从本地存储读取
            let hasEmptyParam = false
            memory.forEach((param) => {
                if (!param) {
                    hasEmptyParam = true
                }
            })
            // 数组存储转对象
            let lxdata = {}
            const a2o = (arr) => {
                return {
                    location: arr[0] && arr[0].location,
                    city: arr[1] && arr[1].city,
                    locCity: arr[2] && arr[2].city,
                    uuid: arr[3],
                    token: arr[4],
                    openId: arr[5]
                }
            }
            if (!hasEmptyParam) {
                lxdata = {
                    cityId: memory[1].city.cityId,
                    openId: memory[5]
                }
                if (this.data.hasAdUtm) {
                    lxdata.custom = this.getAdUTM() || {}
                }
                this.setLxData(lxdata)
                resolve(a2o(memory))
            } else {
                Promise.all(tasks)
                    .then((res) => {
                        const locationInfo = res[0]
                        const cityInfo = res[1]
                        const locCityInfo = res[2]
                        const uuid = res[3]
                        const token = res[4]
                        const openId = res[5]

                        this.data.locationInfo = locationInfo || {}
                        this.data.cityInfo = cityInfo || {}
                        this.data.locCityInfo = locCityInfo || {}

                        if (uuid) {
                            this.data.uuid = uuid
                        }
                        if (token) {
                            this.data.token = token
                        }
                        if (openId) {
                            this.data.openId = openId
                        }
                        lxdata = {
                            cityId: res[1] && res[1].city ? res[1].city.cityId : '',
                            openId: res[5]
                        }
                        if (this.data.hasAdUtm) {
                            lxdata.custom = this.getAdUTM() || {}
                        }
                        this.setLxData(lxdata)
                        resolve(a2o(res))
                    }).catch((err) => {
                        console.error('App Cache Fail', err)
                        resolve()
                    })
            }
        })
    },

    // 获取设置信息
    getSetting() {
        return new Promise((resolve) => {
            wxp.getSetting().then((res) => {
                resolve(res.authSetting)
            }).catch(() => {
                resolve()
            })
        })
    },

    setLxData(data) {
        this.data[KEY_CACHE_LX] = data
    },

    getLxData() {
        let lxdata = this.data[KEY_CACHE_LX] || {}
        lxdata.lxcuid = lx.get('lxcuid') || ''
        lxdata.utm = lx.get(UTM_SOURCE)
        if (!lxdata.openId || lxdata.openId.length == 0) {
            lxdata.openId = wx.getStorageSync(CACHE_OPENID)
        }
        if (!lxdata.cityId || lxdata.cityId.length == 0) {
            let cityInfo = wx.getStorageSync(CACHE_CITY[0])
            if (cityInfo.city && cityInfo.city.cityId) {
                lxdata.cityId = cityInfo.city.cityId
            }
        }
        return lxdata
    },
    getUtmSource() {
        return lx.get(UTM_SOURCE) || {}
    },
    logger() {
        try {
            if (this.data.debug && console && console.log) {
                console.log.apply(console, arguments)
            }
        } catch (error) {
            console.log('console.log err:', error)
        }
    },
    getLaunchOptions() {
        return wx.getStorageSync(CACHE_LAUNCH)
    },

    setLaunchOptions(options) {
        wx.setStorage({
            key: CACHE_LAUNCH,
            data: options
        })
    },

    getShowOptions() {
        return wx.getStorageSync(CACHE_SHOW)
    },

    setShowOptions(options) {
        wx.setStorage({
            key: CACHE_SHOW,
            data: options
        })
    },

    getSystemInfo() {
        let sysInfo = wx.getSystemInfoSync() || {}
        if (sysInfo.model) {
            if (sysInfo.model.indexOf('iPhone X') != -1) {
                sysInfo.isIpx = true
            }
        }
        return new Promise((resolve) => {
            wxp.getNetworkType().then(res => {
                sysInfo.networkType = res.networkType
                resolve(sysInfo)
            }).catch(err => {
                this.logger('获取系统信息err:', err)
                resolve(sysInfo)
            })
        })
    },
    setSystemInfo(sysInfo) {
        this.data.sysInfo = sysInfo
    },

    gotoLogin(url) {
        let systemInfo = wx.getSystemInfoSync()
        if (systemInfo) {
            //  手机号授权登陆
            nav({
                url: '/pages/mobile/mobile?redirectUrl=' + encodeURIComponent(url)
            })
        }
    },

    // 获取诚信sdk 的指纹信息
    getFigure() {
        return new Promise(resolve => {
            let figure = this.data.figure
            if (figure) {
                resolve(figure)
            } else {
                finger.g((res) => { // 获取指纹，res为指纹字符串
                    this.setFigure(res)
                    resolve(res)
                })
            }
        })
    },
    setFigure(figure) {
        this.data.figure = figure
        wx.setStorage({
            key: CACHE_CX,
            data: figure
        })
    },

    getDomain() {
        return new Promise(resolve => {
            if (this.data.domain) {
                resolve(this.data.domain)
            } else {
                let debugInfo = wx.getStorageSync('debug')
                if (debugInfo) {
                    this.data.domain = debugInfo.domain
                    resolve(debugInfo.domain)
                } else {
                    resolve()
                }
            }
        })
    },
    setDomain(domainKey, value) {
        if (this.data.domain) {
            this.data.domain[domainKey] = value
        } else {
            this.data.domain = {
                [domainKey]: value
            }
        }
        wx.setStorageSync('debug', {
            domain: this.data.domain
        })
    }
}

module.exports = Global
