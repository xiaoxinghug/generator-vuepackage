const LoginAPI = require('../public/login')
const DecryptGId = require('../public/groupId')

const requiredFlag = '!'
const optionFlag = '*'

const getToken = function(paramsObj = {}) {
    let params = {
        token: ''
    }
    return new Promise((resolve, reject) => {
        if (paramsObj.token === requiredFlag) { // 必须带上token
            LoginAPI.ensure().then(res => {
                params.token = res.token
                params.openId = res.openId

                resolve({
                    code: 200,
                    params
                })
            }).catch(err => {
                console.log('getToken FAIL:', err)
                resolve({
                    code: 101,
                    params: params,
                    msg: '账号登录失败'
                })
            })
        } else if (paramsObj.token === optionFlag) {
            LoginAPI.getUserInfo().then(res => {
                if (res && res.token) {
                    params.token = res.token
                    params.openId = res.openId

                    resolve({
                        code: 200,
                        params
                    })
                } else {
                    resolve({
                        code: 200,
                        params
                    })
                }
            })
        } else {
            resolve({
                code: 200,
                params
            })
        }
    })
}

const getOpenId = function(paramsObj = {}) {
    let params = {
        openId: ''
    }
    return new Promise((resolve) => {
        LoginAPI.getUserInfo().then(res => {
            if (res && res.openId) {
                params.openId = res.openId || ''
                resolve({
                    code: 200,
                    params: params
                })
            } else if (paramsObj.openId === requiredFlag) {
                LoginAPI.niceToHave().then((res) => {
                    params.openId = res.openId || ''
                    resolve({
                        code: 200,
                        params: params
                    })
                }).catch(err => {
                    console.log('getOpenId FAIL:', err)
                    resolve({
                        code: 101,
                        params: params,
                        msg: '微信登陆失败'
                    })
                })
            } else {
                resolve({
                    code: 200,
                    params: params
                })
            }
        })
    })
}

const getOpenGroupId = function(paramsObj = {}) {
    let params = {
        wxOpenGroupId: ''
    }
    if (paramsObj.wxOpenGroupId === optionFlag) {
        let {shareTicket} = getApp().getShowOptions()
        return DecryptGId(shareTicket).then((res) => {
            res.openGId && (params.wxOpenGroupId = res.openGId)
            return Promise.resolve({
                code: 200,
                params,
                msg: res.msg
            })
        }).catch((e) => {
            return Promise.resolve({
                code: 101,
                params,
                msg: !!e && e.msg
            })
        })
    }
}

const taskMap = {
    token: getToken,
    openId: getOpenId,
    wxOpenGroupId: getOpenGroupId
}

/**
 *
 * @param {*} url
 * @param {*} 校验参数数组
 */
module.exports = function(paramsObj) {
    if (!paramsObj) {
        return
    }
    let params = {
        ...paramsObj
    }
    return new Promise(resolve => {
        let ret = {
            code: 200
        }
        let tasksFn = []
        let tasks = Object.keys(taskMap)

        tasks.map(taskKey => {
            if (paramsObj.hasOwnProperty(taskKey)) {
                tasksFn.push(taskMap[taskKey](paramsObj))
            }
        })

        Promise.all(tasksFn).then(resArray => {
            resArray.map(res => {
                if (res.code === 200) {
                    params = Object.assign({}, params, res.params)
                } else {
                    ret.code = 101
                    ret.msg = res.msg
                }
            })
            ret.params = params
            resolve(ret)
        })
    })
}
