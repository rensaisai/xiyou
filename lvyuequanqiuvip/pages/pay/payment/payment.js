const config = require('../../../config')
const saveScOrderUrl = config.saveScOrderUrl
const saveZGOrderUrl = config.saveZGOrderUrl
const usePwdUrl = config.usePwdUrl
const commitOrderUrl = config.commitOrderUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
const getUserInfoByPhoneUrl = config.getUserInfoByPhoneUrl
const wxNoPayCreateOrderUrl = config.wxNoPayCreateOrderUrl

var app = getApp()
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')
var xmlUtil = require('../../../utils/ObjTree')
var xmlDom = require('../../../utils/xmldom/dom-parser')

Page({
  data: {
    price: 0,//显示价格
    loading:false,
    paytypedata:null,
    pwd:null,
    payType: 1, //1购买会员微信支付 2余额充值微信支付 3购买套餐余额或车豆支付 4购买套餐微信支付
    orderData: null,
    payAgain: 0, //0首次支付 1已有未支付订单再次支付
  },
  onLoad: function (options) {
    var paytypedata = options.paytypel;
    console.log(paytypedata)
    var id = options.id
    console.log(id)
    var cashAmounts = options.cashAmount
    console.log(cashAmount)
    //消费了的金币
    var coupon = options.coupon
    console.log(coupon)
    var install = options.install
    console.log(install)
    if (app.globalData.kmUserInfo != null && install ==1){

    if ((app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2) && (id != undefined) ){
      // 实际的金币
      var coupons = app.globalData.kmUserInfo.coupon
      console.log(coupons)
      if (coupon <= coupons){
        var cashAmount = cashAmounts
        var coupon = coupon
      } else if (coupon > coupons){
        var cashAmountsl = parseInt(cashAmounts) + parseInt(coupon)
        console.log(cashAmountsl)
        var cashAmount =cashAmountsl - coupons
        console.log(cashAmount)
        var coupon = coupons
      }
      this.setData({
        price: cashAmount
      })
      this.wxpayment(id, cashAmount, coupon)
    } else if (app.globalData.kmUserInfo.isVip == 0){
      var cashAmount = cashAmounts
      this.setData({
        price: cashAmount
      })
      this.wxpayment(id, cashAmount, coupon)
    }
    }
    var sid=options.sid
    if (paytypedata != null) {
      var paytypel = JSON.parse(paytypedata)
      this.setData({
        price: paytypel.cashAmount,
        paytypedata: paytypel 
      })
    };
    var orderdata = options.orderdata;
    console.log(orderdata)
    if (orderdata != null) {
      var order = JSON.parse(orderdata);
      if (order.tenantId==''){
        order.tenantId = sid + '';
      }
      if(config.debug){
        // order.price = 0.01;//测试支付>>>>>>
      }
      var showPrice = order.cashAmount;
      var value = parseFloat(order.price) - parseFloat(order.payAmount)
      if (value > 0){
        showPrice = value;
      }
      this.setData({
        orderData: order,
        price: showPrice
      })
    };
    var payagain = options.payagain;
    if (payagain != null) {
      this.setData({
        payAgain: payagain
      })
    };
  },

  shoppingplace: function (paytypedata){
    var that = this
    util.kmRequest({
      url: saveScOrderUrl,
      data: paytypedata,
      method: 'post',
      success:function(res){
        if(res.data.status == 1){
          that.wxPreOrder(JSON.parse(res.data.data)[0].id)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        // console.log(res.data)
        // console.log(JSON.parse(res.data.data))
      }
    })
  },
  createUserOrderRequest: function (orderData) {
    var that = this;
    util.kmRequest({
      url:saveZGOrderUrl,
      data: orderData,
      method:'post',
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
    if(this.data.pwd == null || this.data.pwd.length == 0){
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return;
    }
    util.kmRequest({
      url: usePwdUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        pwd: md5.md5(this.data.pwd)
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: "验证成功",
          })
          that.startPay();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  startPay:function(){
    var that = this;
    this.setData({
      loading: true
    })
    console.log("支付");
    if (that.data.payAgain == 0) {
      if (that.data.payType == 3 || that.data.payType == 4) {
        that.commitOrderUrl();//余额保养下单
      } else {
        console.log("支付单生成");
        console.log(that.data.orderData)
        if (that.data.orderData != null){
          
          that.createUserOrderRequest(that.data.orderData);//生成订单
        }
        if (that.data.paytypedata != null){
         
          that.shoppingplace(that.data.paytypedata)
        }  
      }
    } else if (that.data.payAgain == 1) {//已有未支付订单直接支付
      that.wxPreOrder(that.data.orderData.id);
      that.shoppingplace(that.data.paytypedata.id)
    }
  },
  pwdInputBind:function(e){
    this.setData({
      pwd: e.detail.value
    })
  },
  commitOrderUrl: function () {
    var that = this;
    util.kmRequest({
      url: commitOrderUrl,
      data: this.data.orderData,
      success: function (res) {
        if (res.data.status == 1) {
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
  showSuccess:function(msg){
    wx.showToast({
      title: "购买成功",
    })
    wx.navigateTo({
      url: '/pages/pay/payresult/payresult?result='
      + '支付成功' +
      '&price=' + this.data.price +
        '&message=' + msg + '&orderData='+this.data.orderData
    });
  },
  wxpayment: function (id,cashAmount,coupon){
    var that = this
    util.kmRequest({
      url: wxNoPayCreateOrderUrl,
      data:{
        openId:app.globalData.openid,
        orderId:id,
        ip:'127.0.0.1',
        cashAmount: cashAmount,
        coupon: coupon,
      },
      success:function(res){
        console.log(JSON.parse(res.data.data))
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data)[0])
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
 
  wxPreOrder: function (orderid) {
    var that = this;
    var data = {
      openId: app.globalData.openid,
      orderId: orderid,
      ip:'127.0.0.1',
      source:'wx'
    };
    util.kmRequest({
      url: wxCreateOrderUrl,
      data: data,
      success: function (res) {
        if(res.data.status == 1){
          console.log(JSON.parse(res.data.data)[0])
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
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
        if (res.errMsg == 'requestPayment:ok'){
          if (that.data.payType == 1) {
            that.showSuccess();
          } else if (that.data.payType == 2) {
            that.showSuccess();
          } else if (that.data.payType == 4) {
            that.showSuccess();
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
        that.setData({
          loading: false
        })
      }
    })
  }
})
