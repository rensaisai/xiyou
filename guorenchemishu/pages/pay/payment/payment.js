const config = require('../../../config')
const createUserOrderUrl = config.createUserOrderUrl
const usePwdUrl = config.usePwdUrl
const commitOrderUrl = config.commitOrderUrl
const carwashCommitOrderUrl = config.carwashCommitOrderUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
const coomitUrl = config.coomitUrl

var app = getApp()
var util = require('../../../utils/util')
// var md5 = require('../../../utils/md5')
// var xmlUtil = require('../../../utils/ObjTree')
// var xmlDom = require('../../../utils/xmldom/dom-parser')

Page({
  data: {
    totalprice:'',//总价
    price: 0,//显示价格
    loading:false,
    // pwd:null,
    arr:"",
    payType: 1, //1购买会员微信支付 2余额充值微信支付 3购买套餐余额或车豆支付 4购买套餐微信支付
    orderData: null,
    payAgain: 0, //0首次支付 1已有未支付订单再次支付
    // desc:""//支付备注
    desc:0,//使用车豆
    commission:0,//使用余额
  },
  onLoad: function (options) {
    var paytype = options.paytype;
    console.log(paytype)
    var arr=options.time;
    console.log(arr)
    if (paytype != null) {
      this.setData({
        payType: paytype,
        arr:arr
      })
    };
    var orderdata = options.orderdata;
    if (orderdata != null) {
      var order = JSON.parse(orderdata);
      console.log(order)
      if(config.debug){
        // order.price = 0.01;//测试支付>>>>>>
      }
      // if (order.carwashId != undefined){
      //   this.setData({
      //     desc: '车豆支付' + order.payAmount,
      //     price:0
      //   })
      // }
      var totalprice = order.price
      var showPrice = order.price;
      console.log(showPrice)
      var value = parseFloat(order.price) - parseFloat(order.payAmount)
      console.log(value)
      if (value >= 0 && paytype == 3){
        showPrice = value;
      }
      this.setData({
        orderData: order,
        price: showPrice,
        totalprice: totalprice
      })
      if (paytype == 3) {
        var payname = "";
        if (order.payType == 2){
          // payname = "佣金支付：";
          this.setData({
            commission: order.payAmount
          })
        } else if (order.payType == 3){
          // payname = "车豆支付：";
          this.setData({
            desc: order.payAmount
          })
        }
      }
    };
    var payagain = options.payagain;
    if (payagain != null) {
      this.setData({
        payAgain: payagain
      })
    };
  },
  createUserOrderRequest: function (orderData) {
    var that = this;
    util.kmRequest({
      url: createUserOrderUrl,
      data: orderData,
      success: function (res) {
        if (res.data.status == 1) {
          that.wxPreOrder(JSON.parse(res.data.data)[0].id);          
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  checkPwdRequest: function (e) {
    var that = this;
    // if(this.data.pwd == null || this.data.pwd.length == 0){
    //   wx.showToast({
    //     title: '请输入密码',
    //     icon: "none"
    //   })
    //   return;
    // }
    // util.kmRequest({
    //   url: usePwdUrl,
    //   data: {
    //     userId: app.globalData.kmUserInfo.id,
    //     pwd: md5.md5(this.data.pwd)
    //   },
    //   success: function (res) {
    //     if (res.data.status == 1) {
    //       wx.showToast({
    //         title: "验证成功",
    //       })
          if (that.data.payAgain == 0){
            if (that.data.payType == 3 || that.data.payType == 4) {
              if (that.data.orderData.carwashId == undefined && that.data.orderData.detectionLineId == undefined){
                that.commitOrderUrl();//余额保养下单 
              } else if (that.data.orderData.carwashId != undefined) {
                that.generate()
              } else if (that.data.orderData.detectionLineId != undefined){
                that.vehicle()
              }
            } else {
              that.createUserOrderRequest(that.data.orderData);//生成订单
            }
          } else if (that.data.payAgain == 1) {//已有未支付订单直接支付
            that.wxPreOrder(that.data.orderData.id);
          }
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none"
    //       })
    //     }
    //   }
    // })
  },
  // pwdInputBind:function(e){
  //   this.setData({
  //     pwd: e.detail.value
  //   })
  // },
  //提交保养订单
  commitOrderUrl: function () {
    var that = this;
    var tler = this.data.orderData
    var reservationTime = this.data.arr 
    tler.reservationTime = reservationTime
    console.log(tler)
    util.kmRequest({
      url: commitOrderUrl,
      data: tler,
      success: function (res) {
        if (res.data.status == 1) {
          console.log(that.data.payType)
          if (that.data.payType == 3){
            var value = parseFloat(that.data.orderData.price) - parseFloat(that.data.orderData.payAmount);
            if (value > 0) {//已支付金额小于订单金额，继续微信支付
              that.wxPreOrder(JSON.parse(res.data.data)[0].id);
            }else{
              that.showSuccess('您已成功购买保养套餐，可以马上保养');
            }
          } else if (that.data.payType == 4){
            that.wxPreOrder(JSON.parse(res.data.data)[0].id);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  //提交审车订单
  vehicle:function(){
    var that = this;
    var tler = this.data.orderData
    var reservationTime = this.data.arr
    tler.reservationTime = reservationTime
    util.kmRequest({
      url: coomitUrl,
      data: tler,
      success: function (res) {
        if (res.data.status == 1) {
          console.log(that.data.payType)
         console.log(JSON.parse(res.data.data))
          if (that.data.payType == 3) {
            var value = parseFloat(that.data.orderData.price) - parseFloat(that.data.orderData.payAmount);
            if (value > 0) {//已支付金额小于订单金额，继续微信支付
              that.wxPreOrder(JSON.parse(res.data.data)[0].id);
            } else {
              that.showSuccess('您已成功购买保养套餐，可以马上保养');
            }
          } else if (that.data.payType == 4) {
            that.wxPreOrder(JSON.parse(res.data.data)[0].id);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  //提交洗车订单
  generate:function(){
    var that = this;
    var tler = this.data.orderData
    // var reservationTime = this.data.arr
    // tler.reservationTime = reservationTime
    util.kmRequest({
      url: carwashCommitOrderUrl,
      data: tler,
      success: function (res) {
        if (res.data.status == 1) {
            that.showSuccess('您已成功购买洗车套餐');
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  showSuccess:function(msg){
    console.log(11111111)
    wx.showToast({
      title: "购买成功",
    })
    wx.navigateTo({
      url: '/pages/pay/payresult/payresult?result='
      + '支付成功' +
      '&price=' + this.data.price +
      '&message=' + msg
    });
  },
  wxPreOrder: function (orderid) {
    var that = this;
    var data = {
      openId: app.globalData.openid,
      orderId: orderid,
      ip:'127.0.0.1'
    };
    util.kmRequest({
      url: wxGRCreateOrderUrl,
      data: data,
      success: function (res) {
        if(res.data.status == 1){
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: '失败',
            icon: "none"
          })
        }
      }
    })
  },
  wxPay: function (data){
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        util.kmConsoleLog(res);
        console.log(that.data.payType)
        if (res.errMsg == 'requestPayment:ok'){
          if (that.data.payType == 1) {
            that.showSuccess('您已成功加入VIP会员');
          } else if (that.data.payType == 2) {
            that.showSuccess('您已成功充值');
          } else if (that.data.payType == 3 || that.data.payType == 4) {
            that.showSuccess('您已成功购买保养套餐，可以马上保养');
          }
        }else{
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0){
          res.errMsg = "取消支付";
        }
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  }
})
