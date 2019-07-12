const config = require('../../config')
const loginUrl = config.loginUrl
const existByIdAndUserTypeUrl = config.existByIdAndUserTypeUrl
var app = getApp()
console.log(app);
var util = require('../../utils/util')
var md5 = require('../../utils/md5')

Page({
  data: {
    send: true,
    alreadySend:false,
    second:60
  },
  loginRequest: function (e) {
    var that = this;

    var err = '';
    if (e.detail.value.phone.length == 0) {
      err = '请输入手机号';
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '手机号格式错误';
    } else if (e.detail.value.pwd.length == 0) {
      err = '请输入密码';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    util.kmRequest({
      url: loginUrl,
      data: {
        phone: e.detail.value.phone,
        pwd: md5.md5(e.detail.value.pwd),
        openId: app.globalData.openid
      },
      success: function (res) {
        // console.log(JSON.parse(res.data.data));
        console.log(res.data);
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          wx.showToast({
            title: "登录成功",
          })
          // wx.navigateBack({
          //   delta: 1
          // })
          wx.reLaunch({
            url: '/pages/mine/mine',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
            // duration: 1000
          })
        }
      }
    })
  },
  sendMsg: function () {
    // var phoneNum = this.data.phoneNum;
    var sessionId = wx.getStorageSync('sessionId');
    // wx.request({
    //   url: `${config.api + '/sendSms.html'}`,
    //   data: {
    //     phoneNum: phoneNum
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     "Cookie": sessionId
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
    this.setData({
      alreadySend: true,
      send: false
    })
    this.timer()
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
  phone: function(){
    wx.makePhoneCall({
      phoneNumber:'10086',
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  loginls: function () {
    util.kmRequest({
      url: existByIdAndUserTypeUrl,
      data: {
        id: app.globalData.kmUserInfo.id,
        isVip: app.globalData.kmUserInfo.isVip,
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {

        }
      }
    })
  },
  onLoad: function (options) {
    // var secondId = options.id;
    this.loginls();
  },
  register: function () {
    wx.redirectTo({//关闭当前页跳转
      url: '/pages/users/register/register'
    });
  }
})

