const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCurCodeUrl = config.getCurCodeUrl
const getObdTestingInfoByCheckIdUrl = config.getObdTestingInfoByCheckIdUrl
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
   list:null,
   color:'color1',
   colors:'text-color1'
  },
  btn(){
    this.detection()
    this.setData({
      active: false,
      actives: false,
      complete:false,
      list:null,
      num:100
    })
  //  function sum(m, n) {
  //    num = Math.floor(Math.random() * (m - n) + n);
  //        that.setData({
  //          num:num,
  //          active:false,
  //          actives: false,
  //          complete: false,
  //        })
  //        console.log(num)
  //     }
  //  var time= setInterval(function () {
  //     sum(1, 100);
  //   }, 100)
  //   setTimeout(()=>{
  //     if (num >= 70 && num <= 100) {
  //       var color = 'color1'
  //       var colors = 'text-color1'
  //       var colorl = '#493bfc'
  //     }
  //     if (num >= 30 && num <= 69) {
  //       var color = 'color2'
  //       var colors = 'text-color2'
  //       var colorl = '#ff682e'
  //     }
  //     if (num >= 0 && num <= 29) {
  //       var color = 'color3'
  //       var colors = 'text-color3'
  //       var colorl = '#fc0019'
  //     }
  //     wx.setNavigationBarColor({
  //       frontColor: '#ffffff',
  //       backgroundColor: colorl,
  //       // animation: {
  //       //   duration: 100,
  //       //   timingFunc: 'easeIn'
  //       // }
  //     })
  //     that.setData({
  //       actives: true,
  //       complete: true,
  //       color: color,
  //       colors: colors,
  //       text: '重新检测',
  //     })
  //     clearInterval(time)
  //   },1000)
  },
  detection() {
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getCurCodeUrl,
        param: {}
      },
      success: (res) => {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          var num = list.fraction
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
          animation: {
            duration: 100,
            timingFunc: 'easeIn'
         }
       })
        that.setData({
          num: num,
          list: list,
          complete:true,
          actives: true,
          color: color,
          colors: colors,
          text: '重新检测'
        })
        }
      }
    })
  },
  fault(e){
   var that = this
   var lists = that.data.list.obdErrorList[e.currentTarget.dataset.index]
   if (lists.obdCount != 0 ){
    util.kmRequestobd({
     data:{
       interfaceName: getObdTestingInfoByCheckIdUrl,
       param: {
         obdCheckId: that.data.list.obdCheckId,
         sysId: lists.sysId
       }
     },
     success:(res)=>{
       if(res.data.status == 1){
         var fault = JSON.parse(res.data.data)
         console.log(fault)
         var arr = []
         fault.forEach((i)=>{
           arr.push(i.obdDescription)
         })
         wx.showActionSheet({
           itemList: arr,
           success(res) {
             
           },
           fail(res) {
             
           }
         })
       }
     }
   })
   }
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