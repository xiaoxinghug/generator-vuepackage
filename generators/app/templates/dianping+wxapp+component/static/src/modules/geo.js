const config = require('../config/index')
const wxp = require('../common/wxp')
const request = require('../common/request')
const Promise = require('../common/pinkie')

const geo = {
  /**
    * 获取定位,默认wgs84，不进行缓存需要业务自行缓存
    * @returns Promise
        {
            resolve: {
            latitude,
            longitude
            }
            reject: {
            code,
            msg
            }
        }
    */
    getLocation: function() {
        const app = getApp()
        return new Promise((resolve, reject) => {
            wxp.getLocation({
                type: 'wgs84',
                complete: function(res) {
                    if (!(res && res.latitude && res.longitude)) {
                        reject()
                    }
                }
            }).then((res) => {
                app.setLocation({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                resolve(res)
            })
            .catch((err) => {
                console.log('[Geo Fail]===>', err)
                reject({
                    code: 102,
                    msg: '定位失败'
                })
            })
        })
    },
    getLocationNoReject: function() {
        return new Promise((resolve) => {
            this.getLocation().then((location) => {
                resolve(location)
            }, () => {
                resolve()
            })
        })
    },
  /*
    获取用户定位城市，不进行缓存需要业务自行缓存
    @param [location] <Object> - 经纬度信息
    @param [location.latitude] <Number>
    @param [location.longitude] <Number>
    @return Promise
    {
      resolve: <CityObject> cityId, cityName, cityPyName etc...
      reject: {
        code,
        msg
      }
    }
   */
    getLocCity: function(location) {
        const app = getApp()
        return new Promise((resolve, reject) => {
            const doFetch = (location) => {
                let data
                if (location) {
                    data = {
                        lat: location.latitude,
                        lng: location.longitude
                    }
                } else {
                    data = {}
                }
                request({
                    url: config.DOMAIN + config.API.LOCATE_CITY,
                    data: data
                })
        .then((res) => {
            if (res && res.statusCode == 200 && res.data.code == 200 && res.data.cityInfo && res.data.cityInfo.cityId) {
                app.setCity(res.data.cityInfo, { isGeo: true })
                resolve(res.data.cityInfo)
            } else {
                reject({
                    code: 103,
                    msg: '定位城市服务出错',
                    err: res
                })
            }
        })
        .catch((err) => {
            reject({
                code: 103,
                msg: '定位城市出错',
                err: err
            })
        })
            }
            if (location) {
                doFetch(location)
            } else {
                this.getLocation().then((location) => {
                    doFetch(location)
                }, () => {
                    doFetch()
                })
            }
        })
    },
    _getDefaultCity() {
        return {
            cityId: 1,
            cityName: '上海',
            isOverseaCity: false
        }
    },
     /*
      获取用户选择城市
      @return Promise
      {
        resolve: <CityObject> cityId, cityName, cityPyName etc...
      }
    */
    getCity: function() {
        const app = getApp()
      //  获取城市
        return new Promise((resolve) => {
            let city = app.getCity()
            if (city) {
                resolve(city)
            } else {
                this.getLocCity().then(locCity => {
                    if (locCity) {
                        app.setCity(locCity, { isGeo: false })
                        resolve(locCity)
                    } else {
                        city = this._getDefaultCity()
                        app.setCity(city, { isGeo: false })
                        resolve(city)
                    }
                }).catch(err => {
                    console.log('[City Fail]===>', err)
                    resolve()
                })
            }
        })
    }
}
for (let fn in geo) {
    if (geo.hasOwnProperty(fn) && typeof geo[fn] === 'function') {
        geo[fn] = geo[fn].bind(geo)
    }
}
module.exports = geo
