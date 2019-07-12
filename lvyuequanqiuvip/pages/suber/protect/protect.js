// pages/suber/protect/protect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: true,
    // hiddenNone: 'true',
  },
  

  buy: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/suber/goods/goods?id=' + id
    })
  },
  showNone: function () {
    if (this.data.commodity == null || this.data.commodity.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
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
    this.setData({
      isHideLoadMore: false,
    });
    setTimeout(() => {
      // var list = this.data.list;
      this.setData({
        isHideLoadMore: true,
        // list: list
      })
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})