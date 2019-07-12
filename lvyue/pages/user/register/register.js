const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getXYOpenIdUrl = config.getXYOpenIdUrl
const loginByOpenIdUrl = config.loginByOpenIdUrl
const userInfos = config.userInfos
const saveuserinformation = config.saveuserinformation
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading1:false,
    loading2:false,
  },
  onGotUserInfo(e){
    var that = this
    var userInfo = e.detail.userInfo
    app.globalData.userInfo = userInfo
    wx.setStorage({
      key: userInfos,
      data: userInfo
    })
    if (e.currentTarget.dataset.id == 1) {
      that.setData({
        loading1:true,
      })
      that.usernum()
    }
    if (e.currentTarget.dataset.id == 2) {
      that.setData({
        loading2: true,
      })
      wx.navigateTo({
        url: '/pages/user/login/login',
      })
    }
  },
  usernum(){
    util.kmRequest({
      url: loginByOpenIdUrl,
      data: {
        openId: app.globalData.openid,
    },
    success: function (res) {
      if(res.data.status == 1){
        var user = JSON.parse(res.data.data)[0];
        wx.setStorage({
          key: saveuserinformation,
          data: user
        })
        setTimeout(()=>{
          wx.showToast({
            title: "登录成功",
          })
        },400)
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 800)
      }
      if (res.data.status == 4){
        wx.navigateTo({
          url: '/pages/user/login/login',
        })
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
   this.setData({
     loading1: false,
     loading2: false,
   })
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