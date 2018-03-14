/*
  @param <Array> 电话号码组成的数组
 */
module.exports = function callPhone(phoneList) {
    let phone

    wx.showActionSheet({
        itemList: phoneList,
        success: (res) => {
            if (!res.cancel) {
                phone = phoneList[res.tapIndex]
                wx.makePhoneCall({
                    phoneNumber: phone
                })
            }
        }
    })
}
