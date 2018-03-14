const Promise = require('./pinkie')

let wxp = {}

let noPromiseMethods = [
    'stopRecord',
    'pauseVoice',
    'stopVoice',
    'pauseBackgroundAudio',
    'stopBackgroundAudio',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'createAnimation',
    'createContext',
    'hideKeyboard',
    'stopPullDownRefresh'
]

for (let key in wx) {
    let noPromise = key.indexOf(noPromiseMethods) !== -1 ||
    key.substr(0, 2) === 'on' ||
    /\w+Sync$/.test(key)

    if (typeof wx[key] !== 'function') {
        wxp[key] = wx[key]
    } else {
        if (!noPromise) {
            wxp[key] = function(obj) {
                obj = obj || {}
                return new Promise((resolve, reject) => {
                    obj.success = resolve
                    obj.fail = reject
                    wx[key](obj)
                })
            }
        } else {
            wxp[key] = () => {
                console.warn('wx.' + key + 'is not a async function, no promise provided!')
                return wx[key].apply(wx, arguments)
            }
        }
    }
}
module.exports = wxp
