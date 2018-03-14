// copy对象,过滤undefined
module.exports = function() {
    let ret = {}
    let key
    let obj
    let len = arguments.length

    for (var i = 0; i < len; i++) {
        obj = arguments[i]
        for (key in obj) {
            if (obj[key] !== undefined) {
                ret[key] = obj[key]
            }
        }
    }
    return ret
}
