const config = require('../../../config.js')
const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   text:'开始检测',
   active:true,
   actives: false,
   complete:false,
   num:100,
   color:'color1',
   colors:'text-color1'
  },
  btn(){
    var that = this
    var num = 0
   function sum(m, n) {
     num = Math.floor(Math.random() * (m - n) + n);
         that.setData({
           num:num,
           active:false,
           actives: false,
           complete: false,
         })
         console.log(num)
      }
   var time= setInterval(function () {
      sum(1, 100);
    }, 100)
    setTimeout(()=>{
      if (num >= 70 && num <= 100) {
        var color = 'color1'
        var colors = 'text-color1'
        var colorl = '#493bfc'
      }
      if (num >= 30 && num <= 69) {
        var color = 'color2'
        var colors = 'text-color2'
        var colorl = '#ff682e'
      }
      if (num >= 0 && num <= 29) {
        var color = 'color3'
        var colors = 'text-color3'
        var colorl = '#fc0019'
      }
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: colorl,
        // animation: {
        //   duration: 100,
        //   timingFunc: 'easeIn'
        // }
      })
      that.setData({
        actives: true,
        complete: true,
        color: color,
        colors: colors,
        text: '重新检测',
      })
      clearInterval(time)
    },1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#493bfc',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      text:'开始检测',
      num:100,
      active: true,
      actives: true,
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