const config = require('../../config.js')
const util = require('../../utils/util.js')
const getOrderInfoUrl = config.getOrderInfoUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  active:false,
  list:null,
  count:'',
  },
 orderstatus(id){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: getOrderInfoUrl,
       param:{
         orderId: id
       }
     },
     success:function(res){
       console.log(res.data)
       if(res.data.status == 1){
         var list = JSON.parse(res.data.data)[0]
         console.log(list)
         if (list.orderStatus == 0) {
           list.status = '待付款'
         }
         if (list.orderStatus == 1) {
           list.status = '待配送'
         }
         if (list.orderStatus == 2) {
           list.status = '待保养'
         }
         if (list.orderStatus == 3) {
           list.status = '已完成'
         }
       }
       that.setData({
         list:list
       })
     }
   })
 },
 evaluation(e){
   var li = e.currentTarget.dataset.list
   var that = this
   that.setData({
       active:true,
       actives:false,
   })
   if (li.orderStatus == 0) {
     this.wechatorder(li.id)
   }
   if (li.orderStatus == 2) {
     wx.navigateTo({
       url: '/pages/appointment/appointment?order=' + JSON.stringify(li),
     })
   }
   if (li.orderStatus == 3) {
     wx.navigateTo({
       url: '/pages/orders/my/evaluate/orderevaluate?entity=' + JSON.stringify(li),
     })
   }
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
            url: '/pages/success/success?orderid=' + that.data.orderid
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
repairorder(e){
  var orderid = e.currentTarget.dataset.orderid
  wx.navigateTo({
    url: '/pages/repair/repair?orderid=' + orderid,
  })
},
back(){
  var that = this
  that.setData({
    actives: true,
    active:false,
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var id= options.id
    this.orderstatus(id)
    if (options.count != undefined){
      this.setData({
        count: options.count,
      })
    }
    this.setData({
      orderid:id,
      active: false,
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