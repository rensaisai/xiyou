const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getAllCardUrl =config.getAllCardUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:null,
  hiddenNone: 'true'
  },
  coupon:function(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getAllCardUrl,
        param:{
          type: '',
          isBuy: 0,
          cityCode: app.globalData.cityCode
        } 
      },
      success:function(res){
        if(res.data.status==1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            var time = list[i].deadTime.slice(0, 10)
            var timel = time.replace(/\-/g, '\.')
            list[i].finish = timel
            var times = list[i].startTime.slice(0, 10)
            var timels = times.replace(/\-/g, '\.')
            list[i].start = timels
          }
          that.setData({
            list: list
          })
        }else if(res.data.status==6){
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
      }
    })
  },
  upgrade(){
     wx.navigateTo({
       url: '/pages/upgrade/order/order?cardType=' + 0+'&ids='+2,
     })
  },
  buy(e){
   console.log(e)
    var data = this.data.list[e.currentTarget.dataset.index]
    var data = JSON.stringify(data)
   wx.navigateTo({
     url: '/pages/upgrade/order/order?cardType='+ 1+'&data='+data,
   })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.coupon()
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