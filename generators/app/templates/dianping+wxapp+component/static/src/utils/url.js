const parseQuery = require('./query')
const stringify = require('./url_stringify')

module.exports = {
    parse: function(url, options = {}) {
        if (options.shouldDecode) {
            url = decodeURIComponent(url)
        }
        let arr1 = url.split('#')
        let hash = arr1.length === 2 ? arr1[1] : undefined
        url = arr1[0]
        let arr2 = url.split('?')
        let uri = arr2[0]
        let queryString = arr2.length === 2 ? arr2[1] : ''
        let query = parseQuery(queryString)

        return {
            uri,
            hash,
            query
        }
    },
    stringify: function(uri, query, hash) {
        let url = stringify(uri, query)
        if (hash) {
            url += ('#' + hash)
        }
        return url
    }
}
