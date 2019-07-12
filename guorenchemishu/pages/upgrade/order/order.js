const  config = require('../../../config.js')
const getVipCardPriceUrl = config.getVipCardPriceUrl
const saveCardOrderUrl = config.saveCardOrderUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
const createUserOrderUrl = config.createUserOrderUrl
const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   num:1,
   xlcard:null,
   name:'',
   phone:'',
   price:'',
   prices:'',
   cardType:'',
   card:'',
   data:null,
   ids:''
  },
  price(){
   var that = this
    util.kmRequest({
      data:{
        interfaceName: getVipCardPriceUrl,
        param:{}
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          that.setData({
            price:res.data.data,
            prices: res.data.data
          })
        }
      }
    })
  },
  plus(){
    var number = this.data.num+1
    var price = this.data.prices* number
    this.setData({
      num: number,
      price:price,
  
    })
  },
  minus(){
    var number = this.data.num-1
    var price = this.data.prices * number
    console.log(price)
    if (number <= 1){
      this.setData({
        num: 1,
        price: this.data.prices,
      })
    }else{
      this.setData({
        num: number,
        price: price,
      })
    }
  },
  order(){
  var that = this
    if (that.data.ids == 1){
   util.kmRequest({
     data:{
       interfaceName: createUserOrderUrl,
       param:{
         price: that.data.price,
         type: 0,
       }
     },
     success:function(res){
       if(res.data.status == 1){
         var order = JSON.parse(res.data.data)[0]
         that.orders(order.id)
       }else{
         wx.showToast({
           title: res.data.msg,
           icon: "none"
         })
       }
     }
   })
  }else{
    if (that.data.cardType == 0) {
      var data = {
        interfaceName: saveCardOrderUrl,
        param:{
          price: that.data.price,
          payType: 0,
          num: that.data.num,
          cardType: that.data.cardType
        }
      }
    }
    if (that.data.cardType == 1) {
      var data = {
        interfaceName: saveCardOrderUrl,
        param:{
          price: that.data.price,
          payType: 0,
          num: that.data.num,
          cardType: that.data.cardType,
          cardId: that.data.card
        }
      }
    }
    if (that.data.cardType == 2){
        var data = {
          interfaceName: saveCardOrderUrl,
          param: {
            userId: app.globalData.kmUserInfo.id,
            price: that.data.price,
            payType: 0,
            num: that.data.num,
            cardType: 1,
            cardId: that.data.data.id
          }
        }
      }
    that.setData({
      loading:true
    })
    util.kmRequest({
      data: data,
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var order = JSON.parse(res.data.data)[0]
          that.orders(order.id)
        } else {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  }
  },
  orders(orderid) {
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
          console.log(res.data)
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
        console.log(res)
        if (res.errMsg == 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/upgrade/success1/success1',
          })
        } else {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          that.setData({
            loading: false
          })
          res.errMsg = "取消支付";
        }
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
   
    if (options.card != undefined){
      var xlcard = JSON.parse(options.card)
      this.setData({
        price: xlcard.price,
        data: xlcard,
        cardType: options.cardType
      })
    }
    if (options.cardType != undefined){
      if (options.cardType == 0) {
        this.price()
        this.setData({
          ids: options.ids,
          cardType: options.cardType,
        })
      }
      if (options.cardType == 1) {
        var data = JSON.parse(options.data)
        this.setData({
          card: data.id,
          price: data.price,
          prices: data.price,
          data: data,
          cardType: options.cardType,
        })
      }
    }
    this.setData({
      name: app.globalData.kmUserInfo.userName,
      phone: app.globalData.kmUserInfo.phone,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})