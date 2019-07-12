const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getOrderInfoUrl = config.getOrderInfoUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:null,
  },
  details(orderid){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getOrderInfoUrl,
        param:{
          orderId: orderid
        }
      },
      success:(res)=>{
        var details = JSON.parse(res.data.data)[0]
        console.log(details)
        var service = ''
        for (var i = 0; i < details.itemsList.length; i++) {
          service += details.itemsList[i].itemName + ',' + ' '
        }
        details.service = service
        that.setData({
          details: details
        })
      }
    })
  },
  btn(){
    wx.navigateTo({
      url: '/pages/construct/check/check?orderid=' + this.data.details.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.details(options.orderid)
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