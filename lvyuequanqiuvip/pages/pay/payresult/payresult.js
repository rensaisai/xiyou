const config = require('../../../config')
var app = getApp()
var util = require('../../../utils/util')


Page({
  data: {
    price: 0,
    loading:false,
    message:'',
    orderData:null,
    result:'支付成功'
  },
  onLoad: function (options) {
    var price = options.price;
    var orderData = options.orderData;
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
    // util.kmRequest({
    //   url: getUserInfoByIdAndTypeUrl,
    //   data: orderData,
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.data.status == 1) {
         
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none"
    //       })
    //     }
    //   }
    // })
    wx.switchTab({
      url: '/pages/index/index'
    });
    // wx.showModal({
    //   title: '您已成为会员',
    //   content: '登录账号:您的手机号,默认密码:123456',
    //   showCancel: true,
    //   success: function () {
    //   }
    // })
  }
})
 