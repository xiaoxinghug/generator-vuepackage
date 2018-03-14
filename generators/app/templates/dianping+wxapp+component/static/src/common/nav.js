const PAGE_LIMIT = 10

module.exports = function go2Page(opts) {
    if (!opts) return
    if (!opts.url) return
    let url = opts.url
  // 跳到webview里的h5页面
    if (opts.type === 'h5') {
        let redirectUrl = encodeURIComponent(url)
        url = `/pages/webview/webview?url=${redirectUrl}`
    }
    const history = getCurrentPages()
    let pageLen = history.length

    let path = url.split('?')

    let page = path[0].split('/').pop()

    if (page === 'webview' && pageLen === PAGE_LIMIT - 1) {
        wx.redirectTo({
            url: url
        })
    } else {
        if (pageLen < PAGE_LIMIT) {
            wx.navigateTo({
                url: url
            })
        } else {
            wx.redirectTo({
                url: url
            })
        }
    }
}
