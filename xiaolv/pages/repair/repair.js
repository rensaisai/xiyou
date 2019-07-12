const config = require('../../config.js')
const util = require('../../utils/util.js')
const getMaintainByOrderIdUrl = config.getMaintainByOrderIdUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:null,
  hiddenNone:false,
  },
  waybill(orderId){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getMaintainByOrderIdUrl,
        param:{
          orderId: orderId
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          if(list.length == 0){
            var list = null
          }else{
            var list = list[0]
          }
          if(list != undefined){
            list.time = list.caerteTime.slice(0, 16)
          }
        }
        console.log(list)
        that.setData({
          list:list
        })
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: false
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
    this.waybill(options.orderid)
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