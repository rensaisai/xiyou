const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const saveUserInfoUrl = config.saveUserInfoUrl
const saveuserinformation = config.saveuserinformation
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
  },
  loginRequest(e){
  var that = this
  var err = ''
  if(e.detail.value.code==""){
    err="请输入邀请码"
  } else if (e.detail.value.name == ""){
    err = "请输入您的真实姓名"
  }
  if(err.length>0){
    wx.showToast({
      title: err,
      icon:'none'
    })
    return
  }
  util.kmRequest({
    url: saveUserInfoUrl,
    data:{
      openId: app.globalData.openid,
      phone:that.data.phone,
      inviteCode: e.detail.value.code,
      userName: e.detail.value.name,
      nickName: app.globalData.userInfo.nickName,
      headImg: app.globalData.userInfo.avatarUrl,
      version:2,
    },
    success:function(res){
      console.log(res.data)
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
      }else{
        setTimeout(function () {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }, 500)
      }
    }
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.phone)
    this.setData({
      phone:options.phone
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