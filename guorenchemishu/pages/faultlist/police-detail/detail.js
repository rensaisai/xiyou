const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const getObdAlertByIdUrl = config.getObdAlertByIdUrl
const gaodeRegeoUrl = config.gaodeRegeoUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:null,
    addres:'',
  },
  detail(id){
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getObdAlertByIdUrl,
        param: {
           id:id
        }
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var detail = JSON.parse(res.data.data)[0]
          console.log(detail)
          detail.speed = detail.speed+'km/h'
          console.log(detail)
          var lon = detail.lon
          var lat = detail.lat
          wx.request({
            url: gaodeRegeoUrl + lon + ',' + lat,
            data: {},
            success: function (res) {
              if (res.data.status == 1) {
               console.log(res)
               that.setData({
                 addres: res.data.regeocode.formatted_address
               })
              }
            }
          })
          that.setData({
            detail: detail
          })
        } else if (res.data.status == 6) {
         
        }
        if (that.data.detail == null || that.data.detail.length == 0) {
          that.setData({
            hiddenNone: '',
          })
        } else {
          that.setData({
            hiddenNone: true,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detail(options.id)
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