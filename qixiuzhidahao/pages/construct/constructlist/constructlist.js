const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getOrderOngoingByRepairIdUrl = config.getOrderOngoingByRepairIdUrl
const cancelOrderByIdUrl = config.cancelOrderByIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   hiidenNone:true
  },
construct(){
  var that = this
  util.kmRequest({
    data:{
      interfaceName: getOrderOngoingByRepairIdUrl,
      param:{
        repairId: app.globalData.kmUserInfo.repairId
      }
    },
    method:"post",
    success:(res)=>{
    var list = null
    if(res.data.status == 1){
      list = JSON.parse(res.data.data)
    }else if(res.data.status == 6){

    }else{
     wx.showToast({
       title: res.data.msg,
       icon:'none'
     })
    }
    that.setData({
      list: list
    })
    if(that.data.list == null){
      that.setData({
        hiidenNone:''
      })
    }else{
      that.setData({
        hiidenNone: true
      })
    }
    }
  })
},
detail(e){
 console.log(e)
 wx.navigateTo({
   url: '/pages/construct/constructdetail/constructdetail?orderid=' + e.currentTarget.dataset.id,
 })
},
cancel(e){
var that = this
util.kmRequest({
  data:{
    interfaceName: cancelOrderByIdUrl,
    param:{
      orderId: e.currentTarget.dataset.orderid
    }
  },
  method:"post",
  success:function(res){
    if(res.data.status == 1){
      console.log(res.data)
      that.construct()
      setTimeout(function(){
        wx.showToast({
          title: '取消成功',
        })
      },500)
    }
  }
})
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
    this.construct()
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