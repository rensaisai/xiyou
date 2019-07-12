const config = require('../../../../config')
const commitKmqpOrderUrl = config.commitKmqpOrderUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    entity: {},
  },
  commitRequest: function (cognateorderno){
    var that = this;
    
    util.kmRequest({
      url: commitKmqpOrderUrl,
      data: {
        orderId: this.data.entity.id,
        kmqpOrderNo: cognateorderno
      },
      success: function (res) {
        if(res.data.status == 1){
          wx.showToast({
            title: "关联成功",
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var entity = options.entity;
    this.setData({
      entity: JSON.parse(entity)
    })
  },
  completeClick: function (e) {
    var that = this;
    var err = '';
    if (e.detail.value.cognateorderno.length == 0) {
      err = '请输入关联订单号';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    wx.showModal({
      title: "提示",
      content: "请确认关联订单号:" + e.detail.value.cognateorderno,
      showCancel: true,
      confirmText: "确认",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          that.commitRequest(e.detail.value.cognateorderno);
        }
      }
    })
  }
})

