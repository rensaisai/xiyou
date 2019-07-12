const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const savePayPassWordUrl = config.savePayPassWordUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    length: 6,
    isFocus: true,
    value: '',
    password:'',
  },
  focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue.length == 6) {
      that.setData({
        active: true
      })
    } else {
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
  affirm(){
    var that = this
    if (that.data.password != that.data.value){
      wx.showToast({
        title: '两次输入密码不一致',
        icon:'none'
      })
      return
    }
    util.kmRequest({
      url: savePayPassWordUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        passWord:that.data.value
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          wx.navigateBack({
            delta: 3
          })
          setTimeout(()=>{
            wx.showToast({
              title: '设置成功',
            })
          },400)
        }else{
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var password = options.password
    this.setData({
      password: password
    })
    if (options.num == 1){
      wx.setNavigationBarTitle({
        title: '设置支付密码'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '修改支付密码'
      })
    }
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