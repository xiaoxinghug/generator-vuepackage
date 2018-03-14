const geo = require('../modules/geo')

module.exports = {
  //  获得定位
    getLocation: geo.getLocation,
  //  获得当前城市
    getCity: geo.getCity,
  //  获得当前定位城市
    getLocCity: geo.getLocCity
}
