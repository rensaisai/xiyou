const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserTeamUrl = config.getUserTeamUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenNone: true,
    list:null
  },
  teamunm(){
    var that = this
    util.kmRequest({
      url: getUserTeamUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        level:1,
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            if (list[i].appType == 1){
              list[i].pricename = '999会员'
            }
            if (list[i].appType == 0) {
              list[i].pricename = '399会员'
            }
            if (list[i].isApp == 1) {
              list[i].shopname = '粉丝店主'
            }
            if (list[i].isApp == 2) {
              list[i].shopname = '店主'
            }
            if (list[i].isApp == 3) {
              list[i].shopname = '金牌店主'
            }
            if (list[i].isApp == 4) {
              list[i].shopname = '特约店主'
            }
            if (list[i].isApp == 5) {
              list[i].shopname = '特约高级店主'
            }
            if (list[i].isApp == 6) {
              list[i].shopname = '特约资深店主'
            }
          }
        }else{
          var list = null
        }
        that.setData({
          list:list
        })
        that.show()
      }
    })
  },
  show() {
    var that = this
    if (that.data.list == null || that.data.list.length == 0) {
      that.setData({
        hiddenNone: ''
      })
    } else {
      that.setData({
        hiddenNone: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.teamunm()
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