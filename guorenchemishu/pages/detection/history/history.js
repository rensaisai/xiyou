const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getRepairCheckUrl = config.getRepairCheckUrl
const getUserObdHistoryUrl = config.getUserObdHistoryUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenNone:false,
    windowHeight:'',
    currentData:0,
    repairlist:null,
  },
  repair(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getRepairCheckUrl,
        param:{}
      },
      success:(res)=>{
        if(res.data.status == 1){
          var repairlist = JSON.parse(res.data.data)
          console.log(repairlist)
          that.setData({
            repairlist: repairlist
          })
        }
        if (that.data.repairlist == null || that.data.repairlist.length == 0){
          that.setData({
            hiddenNone:''
          })
        }else{
          that.setData({
            hiddenNone: true
          })
        }
      }
    })
  },
  next(e){
    wx.navigateTo({
      url: '/pages/detection/details/details?id=' + e.currentTarget.dataset.id,
    })
  },
  obd(){
    util.kmRequestobd({
      data:{
        interfaceName: getUserObdHistoryUrl,
        param:{}
      },
      success:(res)=>{
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.repair()
    // this.obd()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  eventchange: function (e) {
    var current = e.detail.current
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight-50;
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