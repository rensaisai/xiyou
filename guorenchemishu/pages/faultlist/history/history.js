const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserObdHistoryUrl = config.getUserObdHistoryUrl
const getRepairCheckUrl = config.getRepairCheckUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    currentData:0,
    obdlist:null,
    hiddenNone:true,
    hiddenNones: true,
    showModalloading:true,
  },
  tab(e){
    this.setData({
      currentData: e.currentTarget.dataset.current
    })
  },
  eventchange(e){
    this.setData({
      currentData: e.detail.current
    })
  },
  scroll(e){

  },
  obd() {
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getUserObdHistoryUrl,
        param: {}
      },
      success: (res) => {
        if(res.data.status == 1){
          var obdlist = JSON.parse(res.data.data)
          obdlist.forEach((i)=>{
           i.date = i.createTime.slice(0,10)
          })
          that.setData({
            obdlist: obdlist,
            showModalloading:false
          })
        }
        if (that.data.obdlist == null || that.data.obdlist.length == 0) {
          that.setData({
            hiddenNone: '',
            showModalloading: false
          })
        } else {
          that.setData({
            hiddenNone: true,
            showModalloading: false
          })
        }
       
      }
    })
  },
  obddetails(e){
   var that = this
   var obd = that.data.obdlist[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/faultlist/result/result?id=' + obd.id+'&type='+1,
    })
  },
  repairdetail(e){
    var that = this
    var repair = that.data.repairlist[e.currentTarget.dataset.index]
    console.log(repair)
    wx.navigateTo({
      url: '/pages/faultlist/result/result?id=' + repair.id + '&type=' + 2,
    })
  },
  repair() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getRepairCheckUrl,
        param: {}
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var repairlist = JSON.parse(res.data.data)
          repairlist.forEach((i)=>{
            i.date = i.createTime.slice(0,10)
          })
          that.setData({
            repairlist: repairlist
          })
        }
        if (that.data.repairlist == null || that.data.repairlist.length == 0) {
          that.setData({
            hiddenNones: ''
          })
        } else {
          that.setData({
            hiddenNones: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.obd()
    that.repair()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight:  res.windowHeight-50,
        })
      }
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