const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const isRepeatPayPassWordUrl = config.isRepeatPayPassWordUrl
const isExistPayPassWordUrl = config.isExistPayPassWordUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 6,
    isFocus: true,
    value: '',
  },
  focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue.length == 6){
      that.setData({
        active:true
      })
    }else{
      that.setData({
        active: false
      })
    }
    that.setData({
      value: inputValue,
    }) 
  },
  tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  repetition(){
   var that = this
    util.kmRequest({
      url: isRepeatPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        newPassWord: that.data.value
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          wx.navigateTo({
            url: '/pages/user/affirm/affirm?password=' + that.data.value,
          })
        } else {
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }, 400)
        }
      }
    })
  },

  next(){
   var that = this
   util.kmRequest({
     url: isExistPayPassWordUrl,
     data:{
       userId: app.globalData.kmUserInfo.id,
     },
     method:"post",
     success(res){
       if(res.data.status == 1){
         that.repetition()
       }else if(res.data.status == 0){
         wx.navigateTo({
           url: '/pages/user/affirm/affirm?password=' + that.data.value+'&num='+1,
         })
       }
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.kmRequest({
      url: isExistPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          wx.setNavigationBarTitle({
            title: '修改支付密码'
          })
        } else if (res.data.status == 0) {
          wx.setNavigationBarTitle({
            title: '设置支付密码'
          })
        }
      }
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