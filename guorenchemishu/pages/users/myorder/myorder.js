const config = require('../../../config.js')
const getUserOrdersUrl = config.getUserOrdersUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
const cancelOrderUrl = config.cancelOrderUrl
const getUserLineOrdersUrl = config.getUserLineOrdersUrl
const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    currentData:0,
    num:[0,1,2,3,4],
    hiddenNone: 'true',
    hiddenNones: 'true',
    list:null,
    vhorder:null,
    orderStatus:'',
    active:1,
    page:0,
    orderType:0
  },
  myorder(){
    var that = this
    var orderType = 0
    if (that.data.active == 1){
      //保养 
      orderType = 0
    }
    if (that.data.active == 3) {
      //洗车 
      orderType = 1
    }
    if (that.data.active == 2) {
      //审车
      orderType = 2
    }
    util.kmRequest({
      data:{
        interfaceName: getUserOrdersUrl,
        param:{
          userStatus: that.data.orderStatus,
          orderType: orderType
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          for(var i=0; i< list.length; i++){
            var date = list[i].createTime.slice(0,10)
            list[i].time = date
            list[i].active = false
            list[i].checked = false
            if (list[i].orderStatus == 0){
              list[i].status = '待付款'
            }
            if (list[i].orderStatus == 1){
              list[i].status = '待配送'
            }
            if (list[i].orderStatus == 2){
              list[i].status = '待保养'
            }
            if (list[i].orderStatus == 3) {
              list[i].status = '已完成'
            }
          }
        } else if (res.data.status == 6){
          var list = null
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
        that.setData({
          list: list,
          orderStatus: that.data.orderStatus,
          orderType: orderType
        })
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: ''
          })
        } else {
          that.setData({
            hiddenNone: 'true'
          })
        }
      }
    })
  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  eventchange: function (e) {
    var that = this
    var current = e.detail.current
    this.setData({
      currentData: current,
      scrollLeft: current
    })
    var orderStatus = ''
    //保养 
    if(that.data.active == 1){
      if (current == 0) {
        orderStatus = ''
      }
      if (current == 1) {
        orderStatus = 0
      }
      if (current == 2) {
        orderStatus = 1
      }
      if (current == 3) {
        orderStatus = 2
      }
      if (current == 4) {
        orderStatus = 3
      }
    }
    if (that.data.active == 3 || that.data.active == 2){
      if (current == 0) {
        orderStatus = ''
      }
      if (current == 1) {
        orderStatus = 0
      }
      if (current == 2) {
        orderStatus = 2
      }
      if (current == 3) {
        orderStatus = 3
      }
    }
   
    that.setData({
         orderStatus: orderStatus
    })
    that.myorder()
  },
  orderstatus(e){
    wx.navigateTo({
      url: '/pages/orderstatus/orderstatus?id=' + e.currentTarget.dataset.orderid,
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
  cancelpay(orderid){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: cancelOrderUrl,
        param:{
          orderId: orderid
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var list = that.data.list
          list.forEach(i=>{
            if (i.id == orderid){
              list.splice(i,1)
              wx.showToast({
                title: '取消成功',
              })
              that.setData({
                list:list
              })
            }
          })
          // that.myorder()
        }else{
          wx.showToast({
            title: res.data.status,
            icon:'none'
          })
        }
      }
    })
  },
  pay(e){
   if(this.data.active){
     var list = this.data.list
     var li = list[e.currentTarget.dataset.index]
   }else{
     var list = this.data.vhorder
     var li = list[e.currentTarget.dataset.index]
   }
   for(var i=0; i<list.length; i++){
     list[i].checked = false
     list[i].active = false
     if (list[i].id == li.id){
       list[i].checked = true
     }else{
       list[i].checked = false 
     }
   }
  if (this.data.active){
    if (li.orderStatus == 0) {
      this.wechatorder(li.id)
    }
    if (li.orderStatus == 2) {
      wx.navigateTo({
        url: '/pages/appointment/appointment?order=' + JSON.stringify(li) + '&orderType=' + this.data.orderType,
      })
    }
    if (li.orderStatus == 3) {
      wx.navigateTo({
        url: '/pages/orders/my/evaluate/orderevaluate?entity=' + JSON.stringify(li),
      })
    }
    this.setData({
      list: list,
    })
  }else{
    if (li.status == 0) {
      this.wechatorder(li.id)
    }
    if (li.status == 2) {
      wx.navigateTo({
        url: '/pages/orders/my/evaluate/orderevaluate?entity=' + JSON.stringify(li),
      })
    }
    this.setData({
      vhorder: list,
    })
  }
  },
  cancel(e){
    var list = this.data.list
    var li = list[e.currentTarget.dataset.index]
    for (var i = 0; i < list.length; i++) {
      list[i].checked = false
      list[i].active = false
      if (list[i].id == li.id) {
        list[i].active = true
      } else {
        list[i].active = false
      }
    }
    if (li.orderStatus == 0) {
      this.cancelpay(li.id, this.data.orderStatus)
    }
    this.setData({
      list: list,
    })
  },
  maintain(){
    this.setData({
      orderStatus: '',
      currentData:0,
      list:null,
      active:1
    })
    this.myorder()
  },
  vehicle(){
    this.setData({
      orderStatus: '',
      currentData: 0,
      list: null,
      active: 2
    })
    this.myorder()
    // this.vehicleorder()
  },
  carwash(){
    this.setData({
      orderStatus: '',
      currentData: 0,
      list: null,
      active: 3
    })
    this.myorder()
    // this.vehicleorder()
  },
  // vehicleorder(){
  //   var that = this
  //    util.kmRequest({
  //      data:{
  //        interfaceName: getUserLineOrdersUrl,
  //        param:{
  //          status: that.data.orderStatus,
  //          pageNum: that.data.page
  //        }
  //      },
  //      method:"post",
  //      success(res){
  //        if(res.data.status == 1){
  //          var vhorder = JSON.parse(res.data.data)
  //          vhorder.forEach(i=>{
  //            i.time = i.createTime.slice(0,10)
  //            i.active = false
  //            i.checked = false
  //            if (i.status == 3 || i.status == 4 || i.status == 7){
  //              i.orderstatus = '已完成'
  //            }
  //            if (i.status == 0) {
  //              i.orderstatus = '待付款'
  //            }
  //            if (i.status == 1) {
  //              i.orderstatus = '待检测'
  //            }
  //            if (i.status == 2){
  //              i.orderstatus = '待评价'
  //            }
  //          })
  //        }else if(res.data.status == 6){

  //        }else{
  //          wx.showToast({
  //            title: res.data.msg,
  //            icon:'none'
  //          })
  //        }
  //        that.setData({
  //          vhorder: vhorder,
  //          orderStatus: that.data.orderStatus
  //        })
  //        if (that.data.vhorder == null || that.data.vhorder.length == 0) {
  //          that.setData({
  //            hiddenNone: ''
  //          })
  //        } else {
  //          that.setData({
  //            hiddenNone: 'true'
  //          })
  //        }
  //      }
  //    })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
        orderStatus: ''
    })
    this.myorder()
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
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 92;
      }
    })
    this.setData({
      windowHeight: windowHeight
    })
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