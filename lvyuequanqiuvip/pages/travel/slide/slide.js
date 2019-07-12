// pages/travel/slide/slide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:[
     {name:1111111},
     { name: 222222222},
     { name: 33333333},
     { name: 44444444 },
     { name: 5555555555},
     ]
  },
  touchS(e) {
   
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  },
  touchM(e) {
    // 获得当前坐标
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      this.setData({
        status: false
      })
    } else if (x < -35 && y < 110) {
      //向右滑
      this.setData({
        status: true
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})