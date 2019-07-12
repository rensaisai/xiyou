const config = require('../../../config.js')
const getAllToursUrl = config.getAllToursUrl
const getAllPopularDestinationUrl = config.getAllPopularDestinationUrl
const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
const searchhistory = config.searchhistory
const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  hot: null,
  search:'',
  history:null,
  },
  hot() {
    var that = this
    util.kmRequest({
      url: getAllPopularDestinationUrl,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          var hot = JSON.parse(res.data.data)
          // for (var i = 0; i < hot.length; i++) {
          //   hot[i].active = false
          // }
          that.setData({
            hot: hot
          })
        }
      }
    })
  },
  inquire(e) {
    console.log(e)
    var that = this
    var code = e.currentTarget.dataset.code
    // var hot = that.data.hot
    // var check = that.data.check
    // that.setData({
    //   check: false
    // })
    // for (var i = 0; i < hot.length; i++) {
    //   hot.active = false
    //   if (hot[i].destination == code) {
    //     hot[i].active = true
    //   }
    // }
    // that.setData({
    //   hot: hot
    // })
    wx.navigateTo({
      url: '/pages/travel/over/over?code=' + code,
    })
  },
  inquireser(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/travel/over/over?name=' + e.currentTarget.dataset.time,
    })
  },
  search(e){
    this.setData({
      search:e.detail.value
    })
  },
  searchs(){
    var that = this
    if (that.data.search==''){
      wx.showToast({
        title: '请输入你想要去的目的地',
        icon: "none"
      })
      return
    }
    var history = that.data.history
    var arr = []
    if (history != null){
      arr.push(that.data.search)
      var history = that.data.history
      var lists = arr.concat(history)
    }else{
      arr.push(that.data.search)
      var lists = arr
      console.log(lists)
    }
    wx.setStorage({
      key: searchhistory,
      data: lists,
    })
    wx.navigateTo({
      url: '/pages/travel/over/over?name=' + that.data.search,
    })
  },
  deletes(){
    this.setData({
      history: wx.clearStorageSync(searchhistory) || null,//若无储存则为空
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.hot()
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
    var that = this
    wx.getStorage({
      key: searchhistory,
        success: function (res) {
          if (res.errMsg == "getStorage:ok"){
            if (res.data.length <10){
              that.setData({
                history: res.data
              })
            }else{
              var list = res.data.slice(0,10)
              that.setData({
                history:list
              })
            }
          }
        },
    })
    that.setData({
      search:''
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