const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCardCodeUrl = config.getCardCodeUrl
const verificationCardCodeByCodeAndPhoneUrl = config.verificationCardCodeByCodeAndPhoneUrl
const isBindingUserCardTicketUrl = config.isBindingUserCardTicketUrl
const bindingUserCardTicketUrl = config.bindingUserCardTicketUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: '/image/headdefault.png',
    send: true,
    alreadySend: false,
    second: 60,
    phone:'',
    code:'',
    id:'',
  },
  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  code(e) {
    this.setData({
      code: e.detail.value
    })
  },
  sendMsg() {
    var that = this
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if (!util.checkPhone(that.data.phone)){
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
     return
    }
    that.pop()
  },
  verification(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCardCodeUrl,
        param:{
          phone: that.data.phone
        } 
      },
      success: function (res) {
        console.log(res.data)
      }
    })
    that.setData({
      alreadySend: true,
      send: false
    })
    that.timer()
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
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
  btn() {
    var that = this
    if (that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (that.data.phone != '' && that.data.code == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (that.data.phone != '' && that.data.code != '') {
      util.kmRequest({
        data: {
          interfaceName: verificationCardCodeByCodeAndPhoneUrl,
          param:{
            phone: this.data.phone,
            code: this.data.code,
          }
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 1) {
            that.cardvoucher()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  pop(){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: isBindingUserCardTicketUrl,
       param:{
         phone: that.data.phone,
         id: that.data.id
       } 
     },
     success:function(res){
     console.log(res.data)
     if(res.data.status==1){
       var list = JSON.parse(res.data.data)
       if(list.memberFlag == 0){
         list.title = '非会员'
       }else{
         list.title = '会员'
       }
       that.setData({
         list:list
       })
       that.showModal()
     }else{
       wx.showToast({
         title: res.data.msg,
         icon: 'none'
       })
     }
     }
   })
  },
  cancel(){
    var that = this
    that.hideModal()
    that.setData({
      phone:'',
      send: true,
      alreadySend: false,
      second: 60,
    })
    wx.showToast({
      title: '绑定失败',
      icon: 'none'
    })
  },
  affirm(){
    this.verification()
    this.hideModal()
  },
  cardvoucher(){
    var that =this
    util.kmRequest({
      data:{
        interfaceName: bindingUserCardTicketUrl,
        param:{
          phone: that.data.phone,
          id: that.data.id
        }
      },
      success:function(res){
        if(res.data.status==1){
          wx.navigateBack({
            delta: 1
          })
          setTimeout(function () {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }, 500)
        }
      }
    })
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
    this.setData({
      id:options.id
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