var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var phone = app.globalData.kmUserInfo.phone
   this.setData({
     path:'https://app.k76.net/cjsj/m/func.php?p='+'58'+'&telphone='+phone+'&qudao='+'001'
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