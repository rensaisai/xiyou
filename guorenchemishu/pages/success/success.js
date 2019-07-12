// pages/success/success.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    type:0,
  },
  order(){
    wx.redirectTo({
      url: '/pages/orderstatus/orderstatus?id=' + this.data.orderid,
    })
  },
  checkorder(){
    wx.redirectTo({
      url: '/pages/users/myorder/myorder',
    })
  },
  phone() {
    wx.showModal({
      content: '400-992-5550',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-992-5550',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type != undefined){
      this.setData({
        type:1,
      })
    }
    this.setData({
      orderid: options.orderid
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