const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getVerificationUrl = config.getVerificationUrl
const verfiyCodeValidUrl = config.verfiyCodeValidUrl
const simpleSignUrl = config.simpleSignUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   loading:false,
   second:60,
   send: true,
   phone:'',
   alreadySend: false,
    Length:6,
    isFocus: true, 
    Value:'',
    contractId:'',
    signerId:'',
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e){
    var that = this
    if (that.data.Value==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    if (that.data.Value.length< 6){
     wx.showToast({
       title: '验证码有误',
       icon:'none'
     })
     return
    }
    that.setData({
      loading:true
    })
    util.kmRequest({
      url: verfiyCodeValidUrl,
      data:{
        phone: app.globalData.kmUserInfo.phone,
        code: that.data.Value,
      },
      success(res){
        if(res.data.status == 1){
          that.sign()
        }else{
          setTimeout(()=>{
            that.setData({
              loading: false
            })
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          },300)
        }
      }
    })
  },
  //签署合同 
  sign(){
    var that = this
   util.kmRequest({
     url: simpleSignUrl,
     data:{
       userId: app.globalData.kmUserInfo.id,
       contractId: that.data.contractId,
     },
     method:"post",
     success(res){
       if(res.data.status == 1){
         console.log(that.data.signerId)
         wx.reLaunch({
           url: '/pages/contract/signed/signed?contractId=' + that.data.contractId + '&signerId=' + that.data.signerId,
         })
       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
       }
     }
   })
  },
  //获取验证码 
  phone(){
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
            alreadySend:false,
            send:true,
          })
          that.time()
        }
      }
    })
  }, 
  //60秒倒计时 
  time(){
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
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = app.globalData.kmUserInfo.phone
    var text1 = text.slice(3,7)
    var phone = text.replace(text1,'****')
    this.phone()
    this.setData({
      phone: phone,
      contractId: options.contractId,
      signerId: options.signerId
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
    this.setData({
      loading: false
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