const urlStringify = function(url, data) {
    if (!data) {
        return url
    }
    var param = []
    for (var o in data) {
        //  过滤未复制变量
        if (data.hasOwnProperty(o) && data[o] !== undefined) {
            param.push(o + '=' + data[o])
        }
    }
  //  _fb_参数格式化
    if (!url) {
        return param.join('&')
    } else {
        return ~url.indexOf('?') ? url + '&' + param.join('&') : url + '?' + param.join('&')
    }
}
module.exports = urlStringify
