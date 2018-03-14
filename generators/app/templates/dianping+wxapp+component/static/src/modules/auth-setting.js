const lx = require('../utils/npm/lx-analytics')

/**
 * 用户权限重新唤起
 */
module.exports = function(authType) {
    let lxBid = {
        userInfoBid: {
            viewBid: 'b_jdgvpvd3',
            successBid: 'b_odegorq8',
            failBid: 'b_xtffe712'
        },
        locationBid: {
            viewBid: 'b_akl3mw59',
            successBid: 'b_9qtgt8mg',
            failBid: 'b_lh706pi9'
        }
    }
    const userInfoContent = '若不授予大众点评小程序获取用户信息，则可能无法提供个性化推荐和操作；点击授权，则可以顺利使用！'
    const locationContent = '若不授予大众点评小程序获取位置信息，则可能无法为您提供准确的推荐信息；点击授权，则可以顺利使用！'
    let content, bid, authText
    if (authType == 'userInfo' || authType == 'userLocation') {
        if (authType == 'userInfo') {
            content = userInfoContent
            bid = lxBid.userInfoBid
            authText = 'scope.userInfo'
        } else if (authType == 'userLocation') {
            content = locationContent
            bid = lxBid.locationBid
            authText = 'scope.userLocation'
        }
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: '温馨提示',
                content: content,
                success: res => {
                    if (res.confirm) {
                        console.log(`用户重新授权获取${authType}权限`)
                        lx.moduleView(bid.viewBid, {
                            showModel: 'success'
                        })
            // 打开设置界面
                        wx.openSetting({
                            success: data => {
                                if (data.authSetting[authText] == true) {
                                    console.log(`重新获取用户${authText}权限成功`)
                                    resolve({
                                        code: 200,
                                        msg: `获取用户权限成功${authText}`
                                    })
                                } else {
                                    console.log(`重新获取用户${authText}权限失败`)
                                    resolve({
                                        code: 103,
                                        msg: `用户仍然没有授权${authText}`
                                    })
                                }
                                lx.moduleClick(bid.successBid, {
                                    authInfo: 'success'
                                })
                            },
                            fail: () => {
                                reject({
                                    code: 103,
                                    msg: '授权失败'
                                })
                                lx.moduleClick(bid.failBid, {
                                    authInfo: 'fail'
                                })
                            }
                        })
                    } else if (res.cancel) {
                        resolve({
                            code: 103,
                            msg: '用户拒绝打开授权页面'
                        })
                        lx.moduleClick(bid.failBid, {
                            authInfo: 'fail'
                        })
                    }
                }
            })
        })
    }
}
