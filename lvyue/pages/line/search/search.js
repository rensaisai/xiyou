const config = require('../../../config.js')
// const getAllToursUrl = config.getAllToursUrl
const getAllPopularDestinationUrl = config.getAllPopularDestinationUrl
// const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
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
  type:'',
  },
  hot() {
    var that = this
    util.kmRequest({
      url: getAllPopularDestinationUrl,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          var hot = JSON.parse(res.data.data)
          that.setData({
            hot: hot
          })
        }
      }
    })
  },
  inquire(e) {
    var that = this
    var code = e.currentTarget.dataset.code
    if(that.data.type == 1){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.data.search = code
      prevPage.data.type = that.data.type
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateTo({
        url: '/pages/line/over/over?name=' + code,
      })
    }
  },
  inquireser(e){
    var that = this
    if(that.data.type == 1){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.data.search = e.currentTarget.dataset.time
      prevPage.data.type = that.data.type
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateTo({
        url: '/pages/line/over/over?name=' + e.currentTarget.dataset.time,
      })
    }
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
    }
    var arrs = []
    for (var i = 0; i < lists.length; i++) {
      console.log(lists.indexOf(lists[i]))
      if (arrs.indexOf(lists[i]) == -1) {
        arrs.push(lists[i])
      };
    }
    if (arrs.length < 10) {
      var lists = arrs
    } else {
      var lists = arrs.slice(0, 10)
    }
    wx.setStorage({
      key: searchhistory,
      data: lists,
    })
    if(that.data.type == 1){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.data.search = that.data.search
      prevPage.data.type = that.data.type
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateTo({
        url: '/pages/line/over/over?name=' + that.data.search,
      })
    }
   
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
    if(options.type != undefined){
      this.setData({
        type: options.type
      })
    }

 
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
            if (res.data != undefined) {
              var data = res.data
              that.setData({
                history: data
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