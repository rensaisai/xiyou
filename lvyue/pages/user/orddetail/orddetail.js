const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const queryGoodsOrderInfoUrl = config.queryGoodsOrderInfoUrl
const cancelGoodsOrderUrl = config.cancelGoodsOrderUrl
const receivedUrl = config.receivedUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
const judgementOrderUrl = config.judgementOrderUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null,
  },
  order(id){
    var that = this
    util.kmRequest({
      url: queryGoodsOrderInfoUrl,
      data:{
        orderId:id
      },
      success(res){
        if(res.data.status == 1){
          var order = JSON.parse(res.data.data)[0]
          console.log(order)
          if (order.orderStatus == 0) {
            order.pays = '立即支付'
            order.refund = '取消支付'
            order.active = true
          }
          if (order.orderStatus == 1) {
            order.pays = '代发货'
            order.active = true
          }
          if (order.orderStatus == 3) {
            order.pays = '确认收货'
            order.refund = '物流信息'
            order.active = true
          }
          if (order.orderStatus == 2) {
            order.pays = '再次购买'
            order.active = true
          }
          that.setData({
            order:order
          })
        }
      }
    })
  },
  btn(){
    var that = this
    var order= that.data.order
    order.active=true
    that.setData({
      order: order
    })
    if (order.orderStatus == 0){
      if (order.orderType == 6 || order.orderType == 7) {
        util.kmRequest({
          url: judgementOrderUrl,
          data: {
            orderId: order.orderId
          },
          success: (res) => {
            if (res.data.status == 1) {
              that.wxPreOrder(order.orderId)
            } else {
              wx.showToast({
                title: '此订单已失效',
                icon: 'none'
              })
            }
          }
        })
      } else {
        that.wxPreOrder(order.orderId)
      }
     
    }
    if (order.orderStatus == 3){
      that.affirm(order.orderId)
    }
    if (order.orderStatus == 2){
      wx.redirectTo({
        url: '/pages/suber/goods/goods?id=' + order.goodsId + '&source=' +order.source
      })
    }
  },
  btn1() {
    var that = this
    var order = that.data.order
    order.active = false
    that.setData({
      order: order
    })
    if (order.orderStatus == 0){
      that.cancelgoods(order.orderId)
    }
    if(order.orderStatus == 3){
      wx.navigateTo({
        url: '/pages/user/logistics/logistics?expressNo=' + order.expressNo + '&addresid=' + order.address,
      })
    }
  },
  affirm(id){
     var that = this 
     util.kmRequest({
       url: receivedUrl,
       data:{
         orderId:id
       },
       success(res){
         if(res.data.status == 1){
           var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
           var prevPage = pages[pages.length - 2];
           prevPage.data.orderid = id
           wx.navigateBack({
             delta: 1
           })
           setTimeout(() => {
             wx.showToast({
               title: '收货成功',
             })
           }, 200)
         }
       }
     })
  },
  cancelgoods(id) {
    var that = this
    util.kmRequest({
      url: cancelGoodsOrderUrl,
      data: {
        orderId: id,
      },
      success(res) {
        if (res.data.status == 1) {
          var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          var prevPage = pages[pages.length - 2];
          prevPage.data.orderid = id
          wx.navigateBack({
            delta: 1
          })
          setTimeout(() => {
            wx.showToast({
              title: '取消成功',
            })
          }, 200)
        }
      }
    })
  },
  wxPreOrder(orderid) {
    var that = this
    var data = {
      openId: app.globalData.openid,
      orderId: orderid,
      ip: '127.0.0.1',
    }
    util.kmRequest({
      url: wxCreateOrderUrl,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          var order = JSON.parse(res.data.data)
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
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
            url: '/pages/payment/payment?price=' + that.data.pay
          })
        } else {
          setTimeout(() => {
            wx.showToast({
              title: res.errMsg,
              icon: "none"
            })
          }, 200)
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          res.errMsg = "取消支付";
        }
        that.setData({
          loading: false
        })
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
    this.order(options.id)
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