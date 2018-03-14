const app = getApp()

Page({
    data: {
        userInfo: {},
        shopOptions:{
            shopId:1798321,
            authId: 'xxxxx'
        },
        hasUserInfo: false
    },
    onLoad(){
        // console.log(app.globalData.userInfo)
        // if (app.globalData.userInfo) {
            // console.log(app.globalData.userInfo)
            // this.setData({
            //     userInfo: app.globalData.userInfo,
            //     hasUserInfo: true
            // })
        // } else {
            wx.getUserInfo({
                success: res => {
                    // app.globalData.userInfo = res.userInfo
                    // this.setData({
                    //     userInfo: res.userInfo,
                    //     hasUserInfo: true
                    // })
                }
            })
        // }
    },
    submitOp(){
          
    }
})
