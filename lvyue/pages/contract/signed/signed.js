
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractId:'',
    signerId:'',
    active:false,
  },
  btn(){
   var that = this
   that.setData({
     active:true
   })
   wx.navigateTo({
     url: '/pages/agtext/agtext?contractId=' + that.data.contractId + '&signerId=' + that.data.signerId,
   })
  },
  btn1(){
    var that = this
    that.setData({
      active: false
    })
    wx.switchTab({
      url:'/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      contractId: options.contractId,
      signerId: options.signerId
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