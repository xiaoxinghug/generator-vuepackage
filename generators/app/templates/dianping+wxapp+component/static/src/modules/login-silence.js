const Promise = require('../common/pinkie')
const Login = require('./login')

module.exports = function(options = {}) {
  //  静默登陆，失败不处理
    return new Promise((resolve, reject) => {
        console.log('Login  Slience start=====')
        const forceLogin = false
        const noNotice = true
        const isSilenceLogin = true
        let loginOpts = {
            forceLogin,
            noNotice,
            isSilenceLogin,
            wxAccount: options.wxAccount
        }

        Login(loginOpts).then(resolve, reject).catch(err => console.log('Login  Slience err=====', err))
    })
}
