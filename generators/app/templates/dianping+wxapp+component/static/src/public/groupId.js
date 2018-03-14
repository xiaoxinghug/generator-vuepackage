const wxp = require('../common/wxp')
const Promise = require('../common/pinkie')
const CONFIG = require('../config/index')

module.exports = function getOpenGroupId(shareTicket) {
    let ret = {
        openGId: undefined,
        msg: ''
    }
    if (!shareTicket) {
        ret.msg = 'shareTicket不存在'
        return Promise.resolve(ret)
    }
    return Promise.all([wxp.login(), wxp.getShareInfo({shareTicket})])
        .then(([loginInfo, shareInfo]) => {
            let { code } = loginInfo
            let { encryptedData, iv } = shareInfo
            if (!code || !encryptedData || !iv) {
                ret.msg = '微信API出错'
                return Promise.resolve(ret)
            }
            return wxp.request({
                url: CONFIG.DOMAIN + CONFIG.API.DECRYPT_GID,
                data: {
                    code, encryptedData, iv
                }
            }).then(({statusCode, data}) => {
                if (statusCode != 200 || !data) {
                    ret.msg = '网络出错'
                } else if (!data.data || data.code != 200) {
                    ret.msg = '服务出错'
                } else {
                    ret.openGId = data.data.openGId
                }
                return Promise.resolve(ret)
            })
        })
}
