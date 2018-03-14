const wxp = require('./wxp')

let system
let cache = []
function getPage() {
    let pages = getCurrentPages()
    return pages[pages.length - 1] || 'app'
}
let Logger = {
    push: function(msg) {
        cache.push(msg)
        this.report()
    },
    report: function() {
        wxp.request({
            method: 'POST',
            url: 'https://catfront.dianping.com/api/log?v=1',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: 'c=' + encodeURIComponent(JSON.stringify(cache))
        }, {level: 2})
    },
    _log: function() {
        if (!system) {
            system = wx.getSystemInfoSync()
        }
        if (system.platform !== 'devtools') {
            console.log.apply(console, arguments)
        } else {
            if (arguments.length < 2) {
                return
            }
            let msg
            let type = arguments[0]
            if (arguments.length === 2) {
                msg = arguments[1]
                if (typeof msg !== 'string') {
                    msg = JSON.stringify(msg)
                }
            } else {
                msg = []
                for (let i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] === 'string') {
                        msg.push(arguments[i])
                    } else if (arguments[i] != undefined) {
                        msg.push(JSON.stringify(arguments[i]))
                    }
                }
                msg = msg.join(' ')
                if (msg.length > 2048) {
                    console.warn('Log不建议传输多余2048字节的信息')
                }
            }

            this.push({
                project: 'dp-mima',
                pageUrl: 'dp-mima:' + getPage(),
                category: 'jsError',
                timestamp: +new Date(),
                level: type,
                content: msg
            })
        }
    }
};
['log', 'error', 'warn', 'info'].map((type) => {
    Logger[type] = function() {
        let args = [].slice.call(arguments, 0)
        args.unshift(type)
        Logger._log.apply(Logger, args)
    }
})
module.exports = Logger
