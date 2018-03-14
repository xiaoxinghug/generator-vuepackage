module.exports = function(queryString) {
    let query = {}
    if (!queryString) return query
    try {
        let quries = queryString.split('&')
        if (quries && quries.length) {
            quries.forEach(function(queryItem) {
                var arr = queryItem.split('=')
                query[arr[0]] = arr[1]
            })
        }
        return query
    } catch (e) {
        console.log('Parse QueryString Fail', e)
        return query
    }
}
