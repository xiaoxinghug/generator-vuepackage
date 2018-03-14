module.exports = function(param, sep = '&', pairSep = '=') {
    let decodeParam = ''
    let obj = {}
    if (/(%253d|%253D|%3d|%3D)/.test(param)) {
        decodeParam = decodeURIComponent(param)
    } else {
        decodeParam = param
    }
    obj = parseObj(decodeParam, sep, pairSep)
    return obj
}

function parseObj(paramStr, sep, pairSep) {
    let ret = {}
    paramStr.split(sep).forEach(function(pair) {
        let splited = pair.split(pairSep)
        ret[splited[0]] = splited[1]
    })
    return ret
}
