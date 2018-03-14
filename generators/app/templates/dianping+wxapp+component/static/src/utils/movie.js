const Promise = require('../common/pinkie')
const movieGlobal = require('../movie/scripts/global')
const Login = require('../modules/login')

movieGlobal.initStats({
    appnm: 'dianping_wxapp'
})

movieGlobal.init = function() {
    const app = getApp()

    this.channelId = 60006 // 渠道id
    this.wxAppChannelId = 3 // 支付渠道
    this.name = '点评'
    this.theme = '#FF6633'
    this.loginPath = '/pages/mobile/mobile'
    this.Promise = Promise
  /**
   * uuid
   * 主流程目前只有排片页用到
   */
    this.$uuid = app.getUUID()
    this.uuid = function() {
        return Promise.resolve(this.$uuid)
    }

    this.$location = app.getLocation() || {}

    this.$location.city = {}
    const city = app.getCity()
    const locationCity = app.getLocCity() || {}

    let cityIdMap

    const getCityIdMap = () => {
        if (!cityIdMap) {
            cityIdMap = this.get('cityIdMap')
        }
        if (cityIdMap) {
            return Promise.resolve(cityIdMap)
        } else {
            return this.request()
        .get('/proxy/city/dpcityidtomtcityid')
        .header('x-host', 'http://open-in.vip.sankuai.com')
        .end()
        .then(res => {
            this.set('cityIdMap', res.body.data, { expires: 7 * 24 * 60 * 60 })
            return res.body.data
        })
        }
    }

    this.location = function() {
        return Promise.all([this.getCitys(), getCityIdMap()])
      .then(rets => {
          const citysMap = rets[0]
          const cityIdMap = rets[1]
          const mtCityId = cityIdMap[city.cityId]
          this.$location.city = citysMap.idMap[mtCityId]
          this.$location.locationCity = citysMap.nameMap[locationCity.cityName] || {}
      })
    }

    this.$user = {}
    let _userPromise = null
    this.user = function() {
        if (!_userPromise) {
            _userPromise = Login()
        .then(user => {
            if (user.token) {
                this.$user = {
                    openId: app.getOpenId(),
                    token: app.getToken(),
                    isBindMobile: !!app.getToken(),
                    wxUserInfo: {
                        userInfo: app.getWxUser() || {}
                    }
                }
                return this.$user
            }

            throw Error('need_bind_mobile')
        })
        }

        _userPromise
      .then(() => {
          _userPromise = null
      })
      .catch(() => {
          _userPromise = null
      })

        return _userPromise
    }
    this.user()

    this.logout = function() {
        this.$user = {}
    }
    this.handleInvalidToken = function() {
        Login(true, true)
        this.user()
    }

    setTimeout(res => {
        this.systemInfo()
    }, 0)

    return Promise.all([this.location()])
}

module.exports = movieGlobal
