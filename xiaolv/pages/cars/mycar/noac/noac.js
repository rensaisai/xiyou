// pages/cars/mycar/noac/noac.js
const config = require('../../../../config.js')
const addCarQRCodeUrl = config.addCarQRCodeUrl
var app = getApp()
console.log(app);
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'',
  },
    nuoche:function(){
      var that = this
      util.kmRequest({
        data:{
          interfaceName: addCarQRCodeUrl,
          param:{}
        },
        success:function(res){
          var msg=res.data.msg
          that.setData({
            msg:msg
          })
        }
      })
    },
    imges:function(e){
      var img=e.currentTarget.dataset.src
      wx.previewImage({
        current: img,
        urls: [this.data.msg]
      })    
    },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.nuoche()
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