const config = require('../../../../config')

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    moneys: [
      { value: '50', name: '¥50', checked: 'true' },
      { value: '100', name: '¥100' },
      { value: '200', name: '¥200' },
      { value: '500', name: '¥500' }
    ],
    price: '50'
  },
  rechargeRequest:function(e){
    var that = this;

    // var err = '';
    // if (e.detail.value.price.length == 0){
    //   err = '请输入充值金额';
    // }
    // if(err.length > 0){
    //   wx.showToast({
    //     title: err,
    //     icon: "none"        
    //   })
    //   return;
    // }
    var data = {
      userId: app.globalData.kmUserInfo.id,
      price: this.data.price,
      type: 1 //0会员 1充值
    }
    wx.navigateTo({
      url: '/pages/pay/payment/payment?paytype=2&orderdata=' + JSON.stringify(data)
    });
  },
  onLoad: function (options) {
    // var secondId = options.id;
  },
  radioChange: function (e) {
    var moneys = this.data.moneys;
    for (var i = 0, len = moneys.length; i < len; ++i) {
      moneys[i].checked = moneys[i].value == e.detail.value
    }
    this.setData({
      moneys: moneys,
      price: e.detail.value
    });
  }
})

