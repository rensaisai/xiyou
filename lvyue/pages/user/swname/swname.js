const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const modifyUserInfoUrl = config.modifyUserInfoUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  name:''
  },
  name(e){
  this.setData({
    name:e.detail.value
  })
  },
  btn(){
    var that = this
   if(that.data.name == ''){
     wx.showToast({
       title: '修改信息不能为空',
       icon:'none'
     })
     return
   }
    util.kmRequest({
      url: modifyUserInfoUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        key:'nickName',
        value:that.data.name
      },
      success:function(res){
        if(res.data.status == 1){
          app.globalData.kmUserInfo =JSON.parse(res.data.data)[0]
          wx.navigateBack({
            delta: 1,
          })
          setTimeout(()=>{
            wx.showToast({
              title: '修改成功',
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