const config = require('../../../config')

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    price: 0,
    loading:false,
    message:'',
    result:'支付成功'
  },
  onLoad: function (options) {
    var price = options.price;
    if (price != null) {
      this.setData({
        price: price
      })
    };
    var message = options.message;
    if (message != null) {
      this.setData({
        message: message
      })
    };
    var result = options.result;
    if (result != null) {
      this.setData({
        result: result
      })
    };
  },
  okClick:function(){
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
