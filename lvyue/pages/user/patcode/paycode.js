const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getVerificationUrl = config.getVerificationUrl
const verfiyCodeValidUrl = config.verfiyCodeValidUrl 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 60,
    send: false,
    phone: '',
    active:false,
    alreadySend: true,
  },
  //获取验证码 
  phone() {
    var that = this
    util.kmRequest({
      url: getVerificationUrl,
      data: {
        phone: app.globalData.kmUserInfo.phone
      },
      success(res) {
        if (res.data.status == 1) {
          var data = res.data.data
          that.setData({
            alreadySend: false,
            send: true,
          })
          that.time()
        }
      }
    })
  }, 
  //60秒倒计时 
  time() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: true,
              send: false,
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  code(e){
    if (e.detail.value.length == 6){
      this.setData({
        active:true
      })
    }else{
      this.setData({
        active: false
      })
    }
    this.setData({
      phone: e.detail.value,
    })
  },
  nextbtn(){
    var that = this
   if(that.data.phone == ''){
     wx.showToast({
       title: '请输入验证码',
       icon:'none',
     })
     return
   }
   util.kmRequest({
     url: verfiyCodeValidUrl,
     data:{
       phone: app.globalData.kmUserInfo.phone,
       code: that.data.phone,
     },
     success(res){
       if(res.data.status == 1){
         wx.navigateTo({
           url: '/pages/user/paypassword/paypassword',
         })
       }else{
         setTimeout(() => {
           wx.showToast({
             title: res.data.msg,
             icon: 'none'
           })
         }, 400)
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