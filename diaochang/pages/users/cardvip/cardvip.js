const config = require('../../../config')
const updateUserMemberFlagUrl = config.updateUserMemberFlagUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
  },
  registerClick: function (e) {
    var that = this;

    var err = '';
    if (e.detail.value.cardpwd.length == 0) {
      err = '请输入团购卡密码';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }

    var data = {
      userId: app.globalData.kmUserInfo.id,
      cardPwd: e.detail.value.cardpwd
    };
    var complete = function (res) {
      if (res.data.status == 1) {
        app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
        wx.showToast({
          title: "升级成功",
        })
        wx.switchTab({
          url: '/pages/proxy/proxy'
        });
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: "none"
          // duration: 1000
        })
      }
    };
    this.carvipRequest(data, complete);
  },
  carvipRequest: function (data, complete) {
    util.kmRequest({
      url: updateUserMemberFlagUrl,
      data: data,
      success: complete
    })
  },
  onLoad: function (options) {
    // var refereId = options.refereId;
  }
})

