// pages/technician/technician.js
const config = require('../../config')
var util = require('../../utils/util')
var app = getApp()
// const saveStaffUrl = config.saveStaffUrl
const getStaffByMechanismIdUrl = config.getStaffByMechanismIdUrl
const delStaffByIdUrl = config.delStaffByIdUrl
Page({
    
  /**
   * 页面的初始数据
   */
  data: {
    hiidenNone: true,
    list:null
  },
  // technician:function(){
  //   util.kmRequest({
  //     url: getTechnicianByRepairIdUrl,
  //     data:{
  //       repairId: app.globalData.kmUserInfo.id
  //     },
  //     success:function(res){
  //        console.log(JSON.parse(res.data.data))
  //        console.log(res.data)
  //     }
  //   })
  // },
  modalinput: function () {
    wx.navigateTo({
      url: '/pages/technic/technic',
    })
  },
  technician:function(){
    var that=this
     util.kmRequest({
       data:{
         interfaceName: getStaffByMechanismIdUrl,
         param:{
           mechanismId: app.globalData.kmUserInfo.mechanismId
         }
       },
       method:"post",
       success:function(res){
         console.log(res.data)
         var list = null
         if(res.data.status==1){
           list = JSON.parse(res.data.data)
           console.log(list)
         }
         that.setData({
           list: list
         })
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
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    })
  },
  bindinput:function(e){
    console.log(e)
    var text=e.detail.value;
    this.setData({
      text:text
    })
  },
  bindinput1: function (e) {
    console.log(e)
    var role = e.detail.value;
    this.setData({
      role: role
    })
  },
  bindinput2: function (e) {
    console.log(e)
    var account = e.detail.value;
    this.setData({
      account: account
    })
  },
  delte:function(e){
    console.log(e)
    var that = this
    var id = e.currentTarget.dataset.id 
    util.kmRequest({
      data:{
        interfaceName: delStaffByIdUrl,
        param:{
          id: id
        }
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          that.technician()
          setTimeout(function(){
            wx.showToast({
              title: '删除成功',
              icon: "none"
            })
          }, 500)
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
    this.technician()
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