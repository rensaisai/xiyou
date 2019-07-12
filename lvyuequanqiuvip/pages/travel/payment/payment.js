const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getAdsUrl = config.getAdsUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
  price:'',
  img:null,
  },
  advertisement(){
    var that = this
    util.kmRequest({
      url: getAdsUrl,
      data:{
        type: 4
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var img = JSON.parse(res.data.data)[0]
          console.log(img)
          that.setData({
            img:img
          })
        }
      }
    })
  },
  getback(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     price: JSON.parse(options.price)
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
    this.advertisement()
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