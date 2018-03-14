const request = require('../common/request')
const config = require('../config/index')

let shopMapCache = {}
  /*
    打开商户地图
    @param <String>{shopId} 商户ID
    @param <Object>{data} 商户地图需要的数据
      @lat: 纬度
      @lng: 经度
      @shopName: 商户名称
      @address: 商户地址
   */
module.exports = function OpenShopMap(data) {
    if (!data) return
    let shopId
    let shopMapInfo
    if (typeof data === 'object') {
        shopMapInfo = data
    } else {
        shopId = data
    }
    const doOpen = function(shopMapInfo) {
        wx.openLocation({
            latitude: shopMapInfo.lat,
            longitude: shopMapInfo.lng,
            name: shopMapInfo.shopName,
            address: shopMapInfo.address
        })
    }
    if (shopMapInfo) {
        doOpen(shopMapInfo)
    } else if (shopId) {
        if (shopMapCache[shopId]) {
            doOpen(shopMapCache[shopId])
        } else {
            request({
                url: config.DOMAIN + config.API.SHOP_MAP,
                data: {
                    shopId: shopId
                }
            }).then((res) => {
                if (res && res.statusCode == 200 && res.data.code == 200) {
                    const shopMapInfo = res.data.shopInfo

          //  缓存上一次地图信息
                    shopMapCache = {}
                    shopMapCache[shopId] = shopMapInfo

                    doOpen(shopMapInfo)
                }
            }).catch((err) => {
                console.error('Detail Map', err)
            })
        }
    }
}
