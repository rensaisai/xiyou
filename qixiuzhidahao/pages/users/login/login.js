const config = require('../../../config')
const cmsglLoginUrl = config.cmsglLoginUrl

var app = getApp()
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')

Page({
  data: {
    
  },
  loginRequest:function(e){
    var that = this;

    var err = '';
    if (e.detail.value.phone.length == 0){
      err = '请输入手机号';
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '手机号格式错误';
    } else if (e.detail.value.pwd.length == 0) {
      err = '请输入密码';
    }
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }

    util.kmRequest({
      url: cmsglLoginUrl,
      data: {
        phone: e.detail.value.phone,
        pwd: md5.md5(e.detail.value.pwd),
        // openId: ''
        openId: app.globalData.openid
      },
      success: function (res) {
        if(res.data.status == 1){
          app.globalData.kmUserInfo = JSON.parse(res.data.data);
          wx.showToast({
            title: "登录成功",
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
            // duration: 1000
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // var secondId = options.id;
  },
  register: function () {
    wx.redirectTo({//关闭当前页跳转
      url: '/pages/users/register/register'
    });
  }
})

