const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const Mcaptcha = require('../../../utils/mcaptcha.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: true,
    active: true,
    img: '',
    imgCode: ''
  },
  top() {
    this.mcaptcha.refresh();
  },
  input(e) {
    console.log(e)
    this.setData({
      imgCode: e.detail.value
    })
  },
  btn() {
    var res = this.mcaptcha.validate(this.data.imgCode);
    if (this.data.imgCode == '' || this.data.imgCode == null) {
      wx.showToast({
        title: '请输入图形验证码',
        icon: 'none'
      })
      return;
    }
    if (!res) {
      wx.showToast({
        title: '图形验证码错误',
        icon: 'none'
      })
      return;
    }
    this.hideModal()
    this.setData({
      active: false
    })
  },
  hide() {
    wx.navigateBack({
      delta: 1
    })
  },
  showModal: function () {
    this.setData({
      showModalStatus: true
    })
  },
  hideModal: function () {
    this.setData({
      showModalStatus: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: 105,
      height: 35,
      createCodeImg: "",
    });
    this.setData({
      img: options.img
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