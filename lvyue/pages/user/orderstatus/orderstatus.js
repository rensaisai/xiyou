const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const queryTourOrderInfoUrl = config.queryTourOrderInfoUrl
const cancelTourOrderUrl = config.cancelTourOrderUrl
var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist:null,
  },
  order(id){
    var that = this
    util.kmRequest({
      url: queryTourOrderInfoUrl,
      data:{
        orderId:id
      },
      success(res){
        if(res.data.status == 1){
          var orderlist = JSON.parse(res.data.data)[0]
          console.log(orderlist)
          if (orderlist.status == 0) {
            orderlist.pays = '立即支付'
            orderlist.refund = '取消支付'
            orderlist.active = true
          }
          if (orderlist.status == 1) {
            orderlist.pays = '联系客服'
            orderlist.active = true
          }
          if (orderlist.status == 2) {
            orderlist.pays = '退款中'
            orderlist.active = true
          }
          if (orderlist.status == 3) {
            orderlist.pays = '已退款'
            orderlist.active = true
          }
          if (orderlist.status == 4) {
            orderlist.pays = '再次购买'
            orderlist.active = true
          }
          orderlist.tourist.forEach(i=>{
            if (i.touristSex == 0){
              i.gender = '男'
            }
            if (i.touristSex == 1){
              i.gender = '女'
            }
          
          })
          that.setData({
            orderlist: orderlist
          })
        }
      }
    })
  },
  travelbtn(e) {
    var that = this
    var orderlist = that.data.orderlist
    orderlist.active = true
    that.setData({
      orderlist: orderlist
    })
    if (orderlist.status == 1){
      wx.showModal({
        title: '是否联系客服',
        content: '400-0098-365',
        success(res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: '400-0098-365',
              success: function () {
                console.log("成功拨打电话")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (orderlist.status == 2){
      wx.showModal({
        title: '是否联系客服咨询退款进度',
        content: '400-0098-365',
        success(res) {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: '400-0098-365',
              success: function () {
                console.log("成功拨打电话")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    if (orderlist.status == 4){
      if (orderlist.routeType == 0){
        wx.redirectTo({
          url: '/pages/line/sincedetails/sincedetails?id=' + orderlist.routeId
        })
      }
      if (orderlist.routeType == 1){
        wx.redirectTo({
          url: '/pages/line/scattered/scattered?id=' + orderlist.routeId
        })
      }
    }
  },
  travelbtn1(e) {
    var that = this
    var orderlist = that.data.orderlist
    orderlist.active = false
    that.setData({
      orderlist: orderlist
    })
    if (orderlist.status == 0) {
      that.delete(orderlist.orderId)
    }
  },
  delete(id){
   util.kmRequest({
     url: cancelTourOrderUrl,
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
          setTimeout(()=>{
            wx.showToast({
              title: '取消成功',
            })
          },200)
       }
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