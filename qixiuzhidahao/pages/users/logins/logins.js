const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const md5 = require('../../../utils/md5.js').md5
const token = config.token
const getCodeUrl = config.getCodeUrl
const verificationCodeByCodeAndPhoneUrl = config.verificationCodeByCodeAndPhoneUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    second:60,
    send:true,
    alreadySend:false,
    phone:'',
    code:'',
  },
  phone(e){
    var phone = e.detail.value
    if(phone.length ===11){
      var checkphone = this.checkPhoneNum(phone)
      if (checkphone){
        this.setData({
          phone: phone
        })
      }else{
        this.setData({
          phone: ''
        })
      }
    }
  },
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    // this.activeButton()
    console.log('code' + this.data.code)
  },
  checkPhoneNum: function (phone) {
    if (!(/^1[2345678]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return false;
    } else {
      return true
    }
  },
  loginRequest(e){
    var that = this
    if (that.data.code == '' && that.data.phone == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (that.data.code == '' && that.data.send == true) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else{
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      util.kmRequest({
        data:{
          token: '',
          sign: md5('grcms@2019' + timestamp + that.data.phoneNum),
          interfaceName: verificationCodeByCodeAndPhoneUrl,
          param:{
            phone: that.data.phone,
            code: that.data.code,
            openId: app.globalData.openid,
          }
        },
        success:function(res){
          if(res.data.status == 1){
            app.globalData.kmUserInfo = JSON.parse(res.data.data)[0]
            wx.setStorage({
              key: token,
              data: app.globalData.kmUserInfo.token
            })
            wx.getStorage({
              key: token,
              success(res) {
                app.globalData.token = res.data
              }
            })  
            wx.reLaunch({
              url:'/pages/index/index'
            })
            setTimeout(function(){
            wx.showToast({
              title: '登录成功',
            })
            },500)
          }else if(res.data.status == 6){
             
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
        }
      })
    }
  },
  sendMsg: function () {
    var phone = this.data.phone;
    if (phone != '' && phone.length === 11) {
      console.log(phone)
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log('grcms@2019' + timestamp + phone)
      util.kmRequest({
        url: getCodeUrl,
        data: {
          token: '',
          sign: md5('grcms@2019' + timestamp + phone),
          interfaceName: getCodeUrl,
          param:{
            phone: phone,
          }
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 1) {
            var data = res.data.data
            console.log(data)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
      this.setData({
        alreadySend: true,
        send: false
      })
      this.timer()
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
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