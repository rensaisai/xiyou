 const config = require('../../config.js')
const getUserBalanceDetail1Url = config.getUserBalanceDetail1Url
 const util = require('../../utils/util.js')
 var app = getApp()
 console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
   hiddenNone: 'true'
  },
  balance:function(){
    var that = this
    util.kmRequest({
      url: getUserBalanceDetail1Url,
      data:{
        userId: app.globalData.kmUserInfo.id
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          that.setData({
            list:list
          })
        }
        that.showNone()
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
  withdrawal(){
    wx.navigateTo({
      url: '/pages/withdrawal/withdrawal',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.balance()
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
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    // this.amountRequest();
    wx.showNavigationBarLoading();

    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
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