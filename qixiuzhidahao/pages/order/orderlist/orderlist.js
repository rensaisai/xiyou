const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getRepairOrdersByRepairIdAndStatusUrl = config.getRepairOrdersByRepairIdAndStatusUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    hiidenNone: true,
  },
  orderlist(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getRepairOrdersByRepairIdAndStatusUrl,
        param:{
          repairId: app.globalData.kmUserInfo.repairId,
        }
      },
      method:"post",
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          that.setData({
            list:list
          })
        }else if(res.data.status == 6){
        
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        if (that.data.list == null) {
          that.setData({
            hiidenNone: ''
          })
        } else {
          that.setData({
            hiidenNone: true
          })
        }
      }
    })
  },
  detail(e){
   var that = this
   var orderid = that.data.list[e.currentTarget.dataset.index]
   wx.navigateTo({
     url: '/pages/order/orderdetail/orderdetail?orderid=' + orderid.orderId,
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orderlist()
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