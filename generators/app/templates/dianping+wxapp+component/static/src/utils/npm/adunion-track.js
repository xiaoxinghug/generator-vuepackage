exports.init = function (obj, identifyId) {
    if (obj) {
        if (!identifyId.openid && !identifyId._lxsdk_cuid) {
            console.warn("请传入识别参数openid 或 lxcuid")
            return false;
        }
        if (obj._fb_) {
            //获取fb的值并加上openid unionid dealid然后上报
            var fb = obj._fb_;
            if (/(%253d|%253D|%3d|%3D)/.test(fb)) {
                fb = decodeURIComponent(fb);
            }
            if (/^(http|https)/.test(fb)) {
                fb = decodeURIComponent(fb);
            }
            if (!(/act/.test(fb))) {
                fb = fb + '&act=4';
            }
            if (!(/openid/.test(fb))) {
                fb = fb + '&openid=' + identifyId.openid;
            }
            if (!(/_lxsdk_cuid/.test(fb))) {
                fb = fb + '&_lxsdk_cuid=' + identifyId._lxsdk_cuid;
            }
            if (!(/adshop_id/.test(fb))) {
                fb = fb + '&adshop_id=' + identifyId.adshop_id;
            }
            if (identifyId.pageName === 'tuandetail') {
                if (!(/addeal_id/.test(fb))) {
                    fb = fb + '&addeal_id=' + identifyId.addeal_id;
                }
            }
            // if (obj.utm) {
            //     if (!(/utm/.test(fb))) {
            //         fb = fb + '&'+ obj.utm;
            //     }
            // }

            if(obj.utm){
                fb = fb + '&utm='+obj.utm;
            }
            if(obj.utm_source){
                fb = fb + '&utm_source='+obj.utm_source;
            }
            if(obj.sub_media){
                fb = fb + '&sub_media='+obj.sub_media;
            }

            wx.request({
                url: 'https://m.dianping.com/adp/log?' + fb,
                data: {},
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    //console.log(res)
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        }

    } else {
        console.warn("请传入对象格式的url参数")
        return false;
    }

};