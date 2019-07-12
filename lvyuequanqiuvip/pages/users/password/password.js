const config = require('../../../config')
const updatePwdUrl = config.updatePwdUrl

var app = getApp()
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')

Page({
  data: {
    
  },
  registerClick: function (e) {
    var that = this;

    var err = '';
    if (e.detail.value.pwd0.length == 0) {
      err = '请输入旧密码';
    } else if (!util.checkPwd(e.detail.value.pwd0)) {
      err = '请输入6-10位字母或数字密码';
    } else if (e.detail.value.pwd.length == 0) {
      err = '请输入新密码';
    } else if (!util.checkPwd(e.detail.value.pwd)) {
      err = '请输入6-10位字母或数字密码';
    } else if (e.detail.value.pwd2.length == 0) {
      err = '请重复新密码';
    } else if (e.detail.value.pwd != e.detail.value.pwd2) {
      err = '两次密码不一致';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }

    util.kmRequest({
      url: updatePwdUrl,
      data: {
        phone: app.globalData.kmUserInfo.phone,
        oldPwd: md5.md5(e.detail.value.pwd0),
        newPwd: md5.md5(e.detail.value.pwd)
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showModal({
            title: "提示",
            content: "修改密码成功",
            showCancel: false,
            confirmText: "确定",
            confirmColor:"#1296db",
            success: function (res) {
              if (res.confirm == true) {
                wx.switchTab({
                  url: '/pages/mine/mine'
                });
              }
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
            // duration: 1000
          })
        }
      }
    });
  },
  onLoad: function (options) {
    // var refereId = options.refereId;
  }
})

