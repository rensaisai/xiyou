// pages/sale/sale.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:false,
    active:false,
    phone:false,
    wx:false,
    img:[
      "https://www.tianxiadiaochang.com/xyweb/otherImg/qr2.png",
      "https://www.tianxiadiaochang.com/xyweb/otherImg/qr3.png",
      "https://www.tianxiadiaochang.com/xyweb/otherImg/qr1.png",
    ]
  },
  sale(){
    this.setData({
      showModalStatus: true,
      active: true,
    })
  },
  shutbtn(){
    this.setData({
      showModalStatus: false,
      active: false,
    })
  },
  telephone(){
    this.setData({
      showModalStatus: true,
      phone: true,
    })
  },
  wx(){
    this.setData({
      showModalStatus: true,
      wx: true,
    })
  },
  hider(){
    this.setData({
      showModalStatus: false,
      wx: false,
    })
  },
  dial() {
    wx.makePhoneCall({
      phoneNumber: '400-0098-365',
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.setData({
      showModalStatus: false,
      phone: false,
    })
  },
  cancel() {
    this.setData({
      showModalStatus: false,
      phone: false,
    })
  },
  preview(e){
    console.log(e)
    var img = e.currentTarget.dataset.src
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: this.data.img
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