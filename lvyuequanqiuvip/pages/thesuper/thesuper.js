// pages/thesuper/thesuper.js
const config = require('../../config')
const getAdsUrl = config.getAdsUrl

var app = getApp()
console.log(app)
var util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    adsList:[]
  },
   vip199:function(){
     wx.navigateTo({
       url: '/pages/repairshops/detail/repairdetail?goodsId=' + '1'
     });
   },
  vipm:function(){
    wx.navigateTo({
      url: '/pages/repairshops/detail/repairdetail?goodsId=' + '5'
    });
  },
  adsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
      },
      success: function (res) {
        console.log(JSON.parse(res.data.data))
        if (res.data.status == 1) {
          that.setData({
            adsList: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.goodsId;
    this.adsRequest()
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
    // wx.showToast({
    //   title: '加载中...',
    //   icon: 'loading'
    // })
    // // this.repairsRequest();
    // wx.showNavigationBarLoading();

    // //模拟加载
    // setTimeout(function () {
    //   wx.stopPullDownRefresh()
    //   wx.hideNavigationBarLoading()
    // }, 1000);
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
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)) {
      tenantId = app.globalData.kmUserInfo.tenantId;
      console.log(tenantId)
      tenantNo = app.globalData.kmUserInfo.userNo;
      console.log(tenantNo)
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  },
})