const config = require('../../../config.js') 
const util = require('../../../utils/util.js')
const saveuserinformation = config.saveuserinformation
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cache:0,
  },
  exitlogin(){
    wx.showModal({
      title: '提示',
      content: '确认退出登录吗?',
      confirmColor: '#ea294b',
      success(res) {
        if (res.confirm) {
          wx.showToast({
            title: '退出中...',
            icon: 'loading',
          })
          wx.removeStorage({
            key: saveuserinformation,
            success(res) {
              if (res.errMsg == "removeStorage:ok") {
                app.globalData.kmUserInfo = null
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }, 500)
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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