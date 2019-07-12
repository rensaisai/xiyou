const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserCouponDetailUrl = config.getUserCouponDetailUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenNone: true,
    time: '',
    list: null,
  },
  bindDateChange(e) {
    console.log(e)
    var time = e.detail.value.slice(0, 7)
    console.log(time)
    this.setData({
      time: time
    })
    this.balance()
  },
  balance(){
    var that = this
    util.kmRequest({
      url: getUserCouponDetailUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        startTime: that.data.time,
      },
      success:function(res){
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          for (var i = 0; i < list.detail.length; i++) {
            if (list.detail[i].isApp == 1) {
              list.detail[i].shopname = '粉丝店主'
            }
            if (list.detail[i].isApp == 2) {
              list.detail[i].shopname = '店主'
            }
            if (list.detail[i].isApp == 3) {
              list.detail[i].shopname = '金牌店主'
            }
            if (list.detail[i].isApp == 4) {
              list.detail[i].shopname = '特约店主'
            }
            if (list.detail[i].isApp == 5) {
              list.detail[i].shopname = '特约高级店主'
            }
            if (list.detail[i].isApp == 6) {
              list.detail[i].shopname = '特约资深店主'
            }
          }
        }
        that.setData({
          list: list
        })
        that.show()
      }
    })
  },
  show() {
    var that = this
    if (that.data.list.detail == [] || that.data.list.detail.length == 0) {
      that.setData({
        hiddenNone: ''
      })
    } else {
      that.setData({
        hiddenNone: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var time = util.formatTime(new Date());
    console.log(time)
    var times = time.slice(0, 7)
    var tm = times.replace("/", "-")
    this.setData({
      time: tm,
    });
    this.balance()
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