// pages/suber/referrer/referrer.js
const config = require('../../../config.js')
const checkInviteCodeUrl = config.checkInviteCodeUrl
const saveVipUserInfoUrl = config.saveVipUserInfoUrl

var app = getApp()
console.log(app)
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false,
    inviteCode:'',
    data:'',
    defaul:false
  },
  focue:function(e){
    var inviteCode=e.detail.value;
    console.log(inviteCode)
    this.setData({
      inviteCode: inviteCode,
    })
  },
 referrer:function(){
   var that = this
   if (app.globalData.tenantId != '' && app.globalData.tenantNo != ''){
      that.setData({
        inviteCode: app.globalData.tenantNo,
        defaul:true
      })
   } 
 },
 click:function(){
     var that=this
     var inviteCode = that.data.inviteCode
     util.kmRequest({
       url: checkInviteCodeUrl,
       data:{
         inviteCode: inviteCode,
         source:wx
       },
       success:function(res){
         if(res.data.status == 1){
           var data = JSON.parse(res.data.data)
          console.log(JSON.parse(res.data.data))
           that.setData({
             data:data
           })
           that.showModal()
         }else{
           wx.showToast({
             title: res.data.msg,
             icon: "none"
           })
         }
       }
     })
 
   },
 
  are:function(){
    var that= this
    var data = this.data.data[0].userNo
    console.log(data)
    // var userId = app.globalData.kmUserInfo.id
    // console.log(userId)
    util.kmRequest({
      url: saveVipUserInfoUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        inviteCode: data,
        // userId: userId,
        source:wx
      },
      success:function(res){
       if(res.data.status == 1){
         wx.switchTab({
           url: '/pages/suber/shops/shops',
         })
       }else{
         console.log(666666)
         wx.showToast({
           title: res.data.msg,
           icon: "none"
         })
       }
      }
       
    })
  },
  back:function(){
    this.hideModal()
  },
    showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },

  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
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
    this.referrer()
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