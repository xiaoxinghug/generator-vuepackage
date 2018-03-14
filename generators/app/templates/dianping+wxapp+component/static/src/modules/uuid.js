const wxp = require('../common/wxp')
const request = require('../common/request')
const Promise = require('../common/pinkie')
const config = require('../config/index')

module.exports = function() {
    const app = getApp()

    return new Promise((resolve) => {
        wxp.login().then((res) => {
            return request({
                url: config.DOMAIN + config.API.UUID,
                data: {
                    code: res.code
                }
            })
        }).then((res) => {
            if (res && res.statusCode == 200 && res.data.code == 200) {
                app.setUUID(res.data.uuid)
                resolve(res.data.uuid)
            } else {
                resolve()
            }
        }).catch((err) => {
            console.error('[UUID FAIL]===>', err)
            resolve()
        })
    })
}
