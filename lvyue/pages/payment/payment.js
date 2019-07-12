const config = require('../../config.js')
const util = require('../../utils/util.js')
const getAdsUrl = config.getAdsUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    img: null,
  },
  advertisement() {
    var that = this
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type: 3
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          that.setData({
            img: JSON.parse(res.data.data)[0]
          });
        }
      }
    })
  },
  getback() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  order(){
    wx.redirectTo({
      url:'/pages/user/myorder/myorder'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.advertisement()
    this.setData({
      price: options.price
    })
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