const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const getUserStrokeTrajectoryByIdUrl = config.getUserStrokeTrajectoryByIdUrl
const getUserStrokeInfoUrl = config.getUserStrokeInfoUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '',
    windowwidth:'',
    currentData: 0,
    detail:null,
    polyline:null,
    markers:null,
    id:''
  },
  details() {
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getUserStrokeInfoUrl,
        param: {
          id: that.data.id
        }
      },
      success: (res) => {
        if (res.data.status == 1) {
          console.log(res)
          var list = JSON.parse(res.data.data)[0]
          list.time = (list.duration / 3600).toFixed(6)
          var dates = list.time
          if (dates > 0.01) {
            list.time = (list.duration / 3600).toFixed(2)
          }
          that.setData({
            detail: list
          })
        }
      }
    })
  },
  tab(e) {
    this.setData({
      currentData: e.currentTarget.dataset.current,
      polyline: this.data.polyline,
      markers: this.data.markers
    })
  },
  eventchange(e) {
    this.setData({
      currentData: e.detail.current,
      polyline: this.data.polyline,
      markers: this.data.markers
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight - 50,
          windowwidth: res.windowWidth
        })
      }
    })
    that.setData({
      id: JSON.parse(options.list).id,
    })
    that.details()
    util.kmRequestobd({
      data: {
        interfaceName: getUserStrokeTrajectoryByIdUrl,
        param: {
          id: that.data.id
        }
      },
      success: (res) => {
        if (res.data.status == 1) {
          var arr = []
          var addres = res.data.data.split(';')
          for (var i = 0; i < addres.length; i++) {
            var addre = addres[i]
            var list = addre.split(',')
            arr.push({ longitude: list[0], latitude: list[1] })
          }
          var arrs = arr.slice(0, arr.length - 1)
          var polyline = [{
            points: arrs,
            color: "#DC143C",
            width: 2,
            dottedLine: false
          }]
          var markers = [{
            iconPath: "/image/address3.png",
            id: 0,
            latitude: arrs[0].latitude,
            longitude: arrs[0].longitude,
            width: 14,
            height: 14
          }, {
            iconPath: "/image/address4.png",
            id: 0,
            latitude: arrs[arrs.length - 1].latitude,
            longitude: arrs[arrs.length - 1].longitude,
            width: 14,
            height: 14
          }]
          that.setData({
            polyline: polyline,
            markers: markers
          })
        }
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