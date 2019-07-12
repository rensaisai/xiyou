// pages/location/location.js
const config = require('../../config.js')
const getUserAllMailingAddressUrl = config.getUserAllMailingAddressUrl
const modifyDefaultMailingAddrUrl = config.modifyDefaultMailingAddrUrl
const deleteUserMailingAddressUrl = config.deleteUserMailingAddressUrl
const util=require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    hiddenNone: 'true',
    numb:'',
    sendType:null,
    addres:null
  },
  myaddress:function(){
    var that = this
    util.kmRequest({
      url: getUserAllMailingAddressUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
      },
      success:function(res){
        console.log(res.data)
        if (res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for(var i=0; i<list.length; i++){
            list[i].checked = false
            var addres = list[i].province + list[i].city + list[i].town
            list[i].addres = addres
            if (list[i].isDefault == 1) {
              list[i].checked = true
            }
          }
          that.setData({
            list: list,
            addres:addres
          })
        }
        if(res.data.status == 6){
          var list=[]
          that.setData({
            list: list
          })
        }
        that.showNone()
      }
    })
  },
  radioChange:function(e){
    var that = this
    var id = e.target.dataset.id
      util.kmRequest({
        url: modifyDefaultMailingAddrUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          id: id,
          source: 'wx'
        },
        success: function (res) {
          console.log(res.data.data)
          if (res.data.status == 1) {
            that.myaddress()
          }
          if (that.data.sendType != null){
            wx.navigateBack({
              url:'/pages/suber/plaxe/place'
            })
          }
         }
      })
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  delert:function(e){
    var that = this
    console.log(e)
     util.kmRequest({
       url: deleteUserMailingAddressUrl,
       data:{
         id: e.currentTarget.dataset.id,
         source:'wx'
       },
       success:function(res){
         if(res.data.status == 1){
           that.myaddress()
           wx.showToast({
             title: "删除成功",
             icon: "none"
           })
         }
       }
     })
  },
  editor:function(e){
    var that=this
    var data = e.currentTarget.dataset
    var datas=JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/addre/addre?datalet=' + datas,
    })
  },
  address:function(){
    wx.navigateTo({
      url: '/pages/addre/addre',
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
    this.myaddress()
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 2]
    console.log(currPage)
    if (currPage.data.sendType != undefined){
      this.setData({
        sendType: currPage.data.sendType
      })
    }
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