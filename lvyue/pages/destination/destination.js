const config = require('../../config.js')
const util = require('../../utils/util.js')
const getAdsUrl = config.getAdsUrl
const getAllPopularDestinationUrl = config.getAllPopularDestinationUrl
const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
const getAllToursUrl = config.getAllToursUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 img:null,
 code:'',
loadingType: 0,
loding: false,
 hot:null,
 check:true,
 page:0,
 list:null,
 hiddenNone:true,
  },
  picture: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type: 2
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            img: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  hot() {
    var that = this
    util.kmRequest({
      url: getAllPopularDestinationUrl,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          var hot = JSON.parse(res.data.data)
          for (var i = 0; i < hot.length; i++) {
            hot[i].active = false
          }
          that.setData({
            hot: hot
          })
        }
      }
    })
  },
  inquires() {
    var check = this.data.check
    var hot = this.data.hot
    var list = this.data.list
    for (var i = 0; i < hot.length; i++) {
      hot[i].active = false
    }
    this.setData({
      check: true,
      hot: hot,
      code:'',
      list:null,
      loding: false,
      loadingType: 0,
      page:0,
    })
    this.destination();
  },
  inquire(e) {
    var that = this
    var code = e.currentTarget.dataset.code
    var hot = that.data.hot
    var check = that.data.check
    for (var i = 0; i < hot.length; i++) {
      hot[i].active = false
      if (hot[i].cityName == code) {
        hot[i].active = true
      }
    }
    that.setData({
      check: false,
      list: null,
      loding:false,
      loadingType: 0,
      page: 0,
      hot: hot,
      code: code
    })
    that.latitude()
  },
  latitude: function () {
    var that = this
    util.kmRequest({
      url: getPopularDestinationByCodeUrl,
      data: {
        code: that.data.code,
        pageNumber: that.data.page,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          if (list.length < 5){
            that.setData({
              loding: true,
              loadingType: 2,
            })
          }
          for (var i = 0; i < list.length; i++) {
            list[i].lineName = '<' + list[i].lineName + '>'
          }
          if(that.data.list != null){
            var circuitlist = that.data.list
            var list = circuitlist.concat(list)
          }
          that.setData({
            list: list
          })
        } else if(res.data.status == 6){
          if(that.data.page > 0){
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            })
          }
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        that.show()
      }
    })
  },
  destination: function () {
    var that = this
    util.kmRequest({
      url: getAllToursUrl,
      data: {
        type: 1,
        pageNumber: that.data.page,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          if(list.length < 5){
            that.setData({
              loding: true,
              loadingType: 2,
            })
          }
          for (var i = 0; i < list.length; i++) {
            list[i].lineName = '<' + list[i].lineName + '>'
          }
          if (that.data.list != null){
            var lister = that.data.list
            var list = lister.concat(list)
          }
          that.setData({
            list: list
          })
        } else if (res.data.status == 6) {
          if(that.data.page >0){
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        that.show()
      }
    })
  },
  show(){
    var that = this
    if (that.data.list == null || that.data.list.length == 0){
      that.setData({
        hiddenNone: ''
      })
    }else{
      that.setData({
        hiddenNone: true
      })
    }
  },
  bourn(e){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/line/scattered/scattered?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.picture()
    this.hot()
    this.destination()
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
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    }, 800)  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (this.data.loadingType != 0 || this.data.loding || this.data.hiddenNone == false) {
      return;
    }
    this.setData({
      loadingType: 1
    });
    if(that.data.code === ''){
      setTimeout(()=>{
        that.setData({
          loadingType: 0,
          page: that.data.page+1
        })
        that.destination()
      },1000)
    }else{
      setTimeout(() => {
        that.setData({
          loadingType: 0,
          page: that.data.page + 1
        })
        that.latitude()
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})