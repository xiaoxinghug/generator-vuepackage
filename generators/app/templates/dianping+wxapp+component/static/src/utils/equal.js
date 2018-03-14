module.exports = function(a, b) {
    // 获取对象属性的所有的键
    if (typeof a !== 'object' || typeof b !== 'object') {
        return a == b
    }
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)

    // 如果键的数量不同，那么两个对象内容也不同
    if (aProps.length != bProps.length) {
        return false
    }

    for (var i = 0, len = aProps.length; i < len; i++) {
        var propName = aProps[i]

        // 如果对应的值不同，那么对象内容也不同
        if (a[propName] !== b[propName]) {
            return false
        }
    }

    return true
}
