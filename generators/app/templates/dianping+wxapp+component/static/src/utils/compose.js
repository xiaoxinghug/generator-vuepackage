// 从最后一个参数开始依次复制
module.exports = function() {
    let ret = {}
    let key
    let obj
    let len = arguments.length

    for (var i = len; i >= 0; i--) {
        obj = arguments[i]
        for (key in obj) {
            ret[key] = obj[key]
        }
    }

    return ret
}
