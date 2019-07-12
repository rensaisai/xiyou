const config = require('../../config.js')
const util = require('../../utils/util.js')
const getUserQrCodeUrl = config.getUserQrCodeUrl
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  mycode(){
   var that = this
    util.kmRequest({
      data: {
        interfaceName: getUserQrCodeUrl,
        param: {}
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var mycode = JSON.parse(res.data.data)[0]
          console.log(mycode)
          that.setData({
            mycode:mycode
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mycode()
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