const config = require('../../../config')
// const loginUrl = config.loginUrl
const getVerificationUrl = config.getVerificationUrl
const loginByPhoneUrl = config.loginByPhoneUrl
const verfiyCodeValidUrl = config.verfiyCodeValidUrl
const saveuserinformation = config.saveuserinformation
var app = getApp()
console.log(app);
var util = require('../../../utils/util')

Page({
  data: {
    send: true,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',
    otherInfo: ''
  },
  loginRequest:function(res){
    var that = this
    if (this.data.code == '' && this.data.phoneNum == ''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }else if (this.data.code == '' && this.data.send == true){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else{
      util.kmRequest({
        url: verfiyCodeValidUrl,
        data:{
          phone: this.data.phoneNum,
          code: this.data.code,
        },
        success:function(res){
          if(res.data.status == 1){
            that.login()
          }else{
            setTimeout(()=>{
              wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
            },400)
          }
        }
      })
    }
  },
  login(){
    var that = this 
    util.kmRequest({
      url: loginByPhoneUrl,
      data: {
        phone: that.data.phoneNum,
        code: that.data.code,
        openId: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          var user = JSON.parse(res.data.data)[0]
          wx.setStorage({
            key: saveuserinformation,
            data: user
          })
          setTimeout(()=>{
            wx.showToast({
              title: "登录成功",
            })
          },400)
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
          },800)
        }else {
          // setTimeout(function(){
          //   wx.showToast({
          //     title: res.data.msg,
          //     icon: "none"
          //   })
          // },400)
        }
        if(res.data.status == 4){
          wx.navigateTo({
            url: '/pages/user/Invitecode/Invitecode?phone=' + that.data.phoneNum,
          })
        }
      }
    })
  },
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    console.log('code' + this.data.code)
  },
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    console.log(phoneNum)
    if (phoneNum.length === 11) {
      var checkedNum = this.checkPhoneNum(phoneNum)
      console.log('phone'+checkedNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
      }
    } else {
      this.setData({
        phoneNum: ''
      })
    }
  },

  checkPhoneNum: function (phoneNum) {
    if (!(/^1[3456789]\d{9}$/.test(phoneNum))) {
      // alert("手机号码有误，请重填");
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return false;
    } else{
      return true
    }
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  sendMsg: function () {
    var phoneNum = this.data.phoneNum;
    if (phoneNum != '' && phoneNum.length === 11){
      this.setData({
        alreadySend: true,
        send: false
      })
      util.kmRequest({
        url: getVerificationUrl,
        data: {
          phone: phoneNum,
        },
        success: function (res) {
          var data=res.data.data
          console.log(data)
        }
      })
      this.timer()
    }else{
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
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: '400-0098-365',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },

  onLoad: function (options) {
  },
})

