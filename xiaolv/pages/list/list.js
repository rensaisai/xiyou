const config = require('../../config.js')
const util = require('../../utils/util.js')
const getRepairsUrl = config.getRepairsUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    orderType: 0,// 0 - 距离优先，1-评价优先 
  },
  repairsRequest: function () {
    var that = this;
    var lon = -1;
    var lat = -1;
    if (app.globalData.locationInfo != null) {
      lon = app.globalData.locationInfo.longitude,
      lat = app.globalData.locationInfo.latitude
    }
    util.kmRequest({
      url: getRepairsUrl,
      data: {
        cityCode: app.globalData.cityCode,
        orderType: that.data.orderType,
        lon: lon,
        lat: lat
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var stars = new Array();
            var count = item.evaluate;
            for (var j = 0; j < count; j++) {
              stars[j] = j;
            }
            item.stars = stars;
            if (item.distance != -1) {
              item.distanceShow = item.distance + 'km';
            } else {
              item.distanceShow = '';
            }
          }
          that.setData({
            list: list
          });
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: ''
          })
        } else {
          that.setData({
            hiddenNone: 'true'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.repairsRequest()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})