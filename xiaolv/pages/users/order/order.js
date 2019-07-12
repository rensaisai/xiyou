const config = require('../../../config.js')
const util= require('../../../utils/util.js')
const getCardTicketByUserIdNewUrl = config.getCardTicketByUserIdNewUrl
const coomitUrl = config.coomitUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
var app = getApp()
Page({
  data: {
   list:null,
   entity:null,
  voucher:null,
    money:'',//总价
    bean:0,//车豆
    price:0,//实付金额
    name:'',
    phone:'',
    preferential: 0,//使用优惠券
    orderid:'',
  },
  address() {
    wx.navigateTo({
      url: '/pages/map/map?scign=' + 1 + '&type=2',
    })
  },
  envelope(e) {
    console.log(e)
    var that = this
    var list = that.data.list
    var order = list[e.currentTarget.dataset.index]
    that.setData({
      index: e.currentTarget.dataset.index,
    })
    that.userStatisticsRequest(order.price, order.type)
  },
  userStatisticsRequest(price, type) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCardTicketByUserIdNewUrl,
        param:{
          type: type,
          price: price,
        }
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/upgrade/coupon/coupon?envelope=' + price + '&type=' + type,
          })
        } else if (res.data.status == 6) {
          var list = that.data.list
          list[that.data.index].cardNum = '无可用优惠券'
          that.setData({
            list: list
          })
        }
      }
    })
  },
  btn(){
    var that = this
    var list = that.data.list
    var setmealId = []
    var userCardId = []
    for(var i=0; i<list.length; i++){
      setmealId.push({itemName: list[i].itemName, price:list[i].price})
      if (list[i].cardId != undefined){
        userCardId.push({cardId: list[i].cardId, itemId: list[i].id})
      }
    }
    if (userCardId == [] && userCardId.length == 0) {
      var userCardId = ''
    } else {
      var userCardId= JSON.stringify(userCardId)
    }
    var setmeal = JSON.stringify(setmealId)
    if (that.data.bean > 0 ){
      var payType = 3
    }else{
      var payType = 0
    }
    util.kmRequest({
      data:{
        interfaceName: coomitUrl,
        param:{
          price: that.data.money,
          userCarId: app.globalData.carInfo.id,
          setmealId: setmeal,
          detectionLineId: that.data.entity.id,
          payType: payType,
          userCardId: userCardId,
          beanPrice: that.data.bean,
          payAmount: that.data.price,
        }
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          that.setData({
            loading: true
          })
          var orders = JSON.parse(res.data.data)[0]
          console.log(orders)
          that.setData({
            orderid: orders.id
          })
          if (orders.status == 1) {
            wx.redirectTo({
              url: '/pages/success/success?orderid=' + orders.id+'&type='+1
            })
          } else {
            that.wechatorder(orders.id)
          }
      }
    }
    })
  },
  wechatorder(orderid) {
    var that = this;
    var data = {
      interfaceName: wxGRCreateOrderUrl,
      param:{
        openId: app.globalData.openid,
        orderId: orderid,
        ip: '127.0.0.1'
      }
    };
    util.kmRequest({
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          that.wxPay(JSON.parse(res.data.data)[0])
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          that.setData({
            loading: false
          })
        }
      }
    })
  },
  wxPay: function (data) {
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        if (res.errMsg == 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/success/success?orderid=' + that.data.orderid + '&type=' + 1
          })
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          res.errMsg = "取消支付";
          that.setData({
            loading: false
          })
        }
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  },
  onLoad: function (options) {
    var list = JSON.parse(options.order)
    var price = 0
    var name = ''
    var phone = app.globalData.kmUserInfo.phone
    var bean = app.globalData.kmUserInfo.bean
    if (app.globalData.kmUserInfo.userName == '') {
      name = app.globalData.kmUserInfo.nickName
    } else {
      name = app.globalData.kmUserInfo.userName
    }
    for(var i=0; i<list.length; i++){
      list[i].cardNum = '请选择优惠券'
      price += list[i].price 
    }
    if (bean < price) {
      var privilegeprice = (price - bean).toFixed(2)
    } else if (bean >= price) {
      var privilegeprice = (price - price).toFixed(2)
      var bean = price.toFixed(2)
    }
    this.setData({
      list: list,
      money: price,//商品总价
      bean: bean,//优惠的车豆
      price: privilegeprice,//车豆优惠后的价格
      // orderprice: privilegeprice,//车豆优惠后的价格
      name: name,
      phone: phone,
      entity: JSON.parse(options.entity),
    })
  },
  onShow(){
    var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[pages.length - 1];
    console.log(prevPage)
    if (this.data.voucher != null){
      var list = this.data.list
      var deductionAmount = 0
      list[this.data.index].cardNum = this.data.voucher.cardName + ':' + '￥-' + this.data.voucher.deductionAmount
      list[this.data.index].cardprice = this.data.voucher.deductionAmount
      list[this.data.index].cardId = this.data.voucher.cardId
      for (var i = 0; i < list.length; i++) {
        if (list[i].cardprice != undefined) {
          deductionAmount += list[i].cardprice
        }
      }
      if (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean > 0) {
        var price = (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean).toFixed(2)
        var bean = app.globalData.kmUserInfo.bean
      } else if (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean <= 0) {
        var price = '0.00'
        var bean = (this.data.money - deductionAmount).toFixed(2)
      }
      this.setData({
        price: price,//实际支付价格
        list: list,
        bean: bean,//减去的车豆
        preferential: deductionAmount,//优惠的价格
      })
    }
    this.setData({
      loading: false
    })
  },
})

