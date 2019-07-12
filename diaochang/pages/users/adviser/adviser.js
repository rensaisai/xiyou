const config = require('../../../config')
const getRefereInfoUrl = config.getRefereInfoUrl
const insertRefereInfoUrl = config.insertRefereInfoUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    entity:{},
    hasRefere: 'true',
    imgIcon:'/image/logo.png'
  },
  refereInfoRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      url: getRefereInfoUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1 && res.data.data.length > 0) {
          app.globalData.refereInfo = JSON.parse(res.data.data)[0];
          that.setData({
            hasRefere:'true',
            // imgIcon: app.globalData.refereInfo,
            entity: app.globalData.refereInfo
          });
        }else{
          that.setData({
            hasRefere: '',
          });
        }
      }
    })
  },
  insertRefereInfoRequest:function(e){
    var that = this;

    var err = '';
    if (e.detail.value.phone.length == 0){
      err = '请输入手机号';
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '手机号格式错误';
    } else if (e.detail.value.phone == app.globalData.kmUserInfo.phone){
      err = '手机号不能为本人的';
    }
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }

    util.kmRequest({
      url: insertRefereInfoUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        phone: e.detail.value.phone
      },
      success: function (res) {
        if(res.data.status == 1){
          app.globalData.refereInfo = JSON.parse(res.data.data)[0];
          wx.showModal({
            title: "提示",
            content: "保存成功",
            showCancel: false,
            confirmText: "确定",
            confirmColor: "#1296db",
            success: function (res) {
              if (res.confirm == true) {
                wx.switchTab({
                  url: '/pages/mine/mine'
                });
              }
            }
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
    if (app.globalData.refereInfo == null) {
      this.refereInfoRequest();
    }else{
      this.setData({
        hasRefere: 'true',
        // imgIcon: app.globalData.refereInfo,
        entity: app.globalData.refereInfo
      });
    }
  }
})

