 const config = require('../../../config')
const loginUrl = config.loginUrl
const existByIdAndUserTypeUrl = config.existByIdAndUserTypeUrl
const getVerificationUrl = config.getVerificationUrl
const loginByPhoneUrl = config.loginByPhoneUrl
var app = getApp()
console.log(app);
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')

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
  // loginRequest: function (e) {
  //   var that = this;
  //   var err = '';
  //   if (e.detail.value.phone.length == 0) {
  //     err = '请输入手机号';
  //   } else if (!util.checkPhone(e.detail.value.phone)) {
  //     err = '手机号格式错误';
  //   } else if (e.detail.value.pwd.length == 0) {
  //     err = '请输入密码';
  //   }
  //   if (err.length > 0) {
  //     wx.showToast({
  //       title: err,
  //       icon: "none"
  //     })
  //     return;
  //   }
  //   util.kmRequest({
  //     url: loginUrl,
  //     data: {
  //       phone: e.detail.value.phone,
  //       pwd: md5.md5(e.detail.value.pwd),
  //       openId: app.globalData.openid
  //     },
  //     success: function (res) {
  //       // console.log(JSON.parse(res.data.data));
  //       console.log(res.data);
  //       if (res.data.status == 1) {
  //         app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
  //         wx.showToast({
  //           title: "登录成功",
  //         })
  //         // wx.navigateBack({
  //         //   delta: 1
  //         // })
  //         wx.reLaunch({
  //           url: '/pages/mine/mine',
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.msg,
  //           icon: "none"
  //           // duration: 1000
  //         })
  //       }
  //     }
  //   })
  // },
  loginRequest:function(res){
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
        url: loginUrl,
        data: {
          phone: this.data.phoneNum,
          code: this.data.code,
          openId: app.globalData.openid,
          source: wx,
        },
        success: function (res) {
           if(res.data.status==1){
             console.log(JSON.parse(res.data.data))
             app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
             console.log(app.globalData.kmUserInfo)
             wx.showToast({
               title: "登录成功",
             })
             wx.switchTab({
            url: '/pages/index/index',
          })
           }else{
             wx.showToast({
            title: res.data.msg,
            icon: "none"        
          })
           }
        }
      })
    }
  },
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    // this.activeButton()
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
        // this.showSendMsg()
        // this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      // this.hideSendMsg()
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
    // let str = /^1\d{10}$/
    // if (str.test(phoneNum)) {
    //   return true
    // } else {
    //   wx.showToast({
    //     title: '手机号不正确',
    //     icon:'none'
    //   })
    //   return false
    // }
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
      console.log(phoneNum)
      wx.request({
        url: getVerificationUrl,
        data: {
          phone: phoneNum,
          source: wx
        },
        success: function (res) {
          console.log(res.data)
          var data=res.data.data
          console.log(data)
          // wx.showToast({
          //   title: data,
          //   icon: 'none'
          // })
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
  // loginls: function () {
  //   util.kmRequest({
  //     url: existByIdAndUserTypeUrl,
  //     data: {
  //       id: app.globalData.kmUserInfo.id,
  //       isVip: app.globalData.kmUserInfo.isVip,
  //     },
  //     success: function (res) {
  //       console.log(res.data)
  //       if (res.data.status == 1) {

  //       }
  //     }
  //   })
  // },
  onLoad: function (options) {
    // var secondId = options.id;
    // this.loginls();
  },
  register: function () {
    wx.redirectTo({//关闭当前页跳转
      url: '/pages/users/register/register'
    });
  }
})

