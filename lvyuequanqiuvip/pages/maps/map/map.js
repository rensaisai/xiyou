
var util = require('../../../utils/util')

Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    // covers: [{
    //   latitude: 23.099994,
    //   longitude: 113.344520,
    //   iconPath: '/image/location.png'
    // }, {
    //   latitude: 23.099994,
    //   longitude: 113.304520,
    //   iconPath: '/image/location.png'
    // }]
    screenHeight:wx.getSystemInfoSync().windowHeight
  },
  onLoad: function (options) {
    var lon = options.lon;
    var lat = options.lat;
    this.setData({
      latitude: lat,
      longitude: lon,
      markers: [{
        latitude: lat,
        longitude: lon,
        name: '修理厂'
      }]
    })
    util.kmConsoleLog(this.data.screenHeight);
  }
})
