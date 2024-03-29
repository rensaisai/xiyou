const config = require('../../../../config.js')
const util = require('../../../../utils/util.js')
const moveCarUrl = config.moveCarUrl
const getCarQrCodeByContentUrl = config.getCarQrCodeByContentUrl
const getXLOpenIdUrl = config.getXLOpenIdUrl
const getUserInfoByOpenIdUrl = config.getUserInfoByOpenIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   phone:'',
  },
  phone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  ueserphone(){
    var that = this;
    util.kmRequest({ 
      data:{
        interfaceName: moveCarUrl,
        param:{
          telUserId: that.data.userId,
          aPhone:that.data.phone,
        }
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          wx.makePhoneCall({
            phoneNumber: res.data.data,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  call(){
    var that = this
    if(that.data.phone == ''){
      wx.showToast({
        title: '请输入您的手机号',
        icon:'none'
      })
      return
    }else if(!util.checkPhone(that.data.phone)){
      wx.showToast({
        title: '请输入的手机号有误',
        icon: 'none'
      })
      return
    }
    that.ueserphone()
  },
  next(){
    wx.switchTab({
      url: '/pages/index/index'
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.scene)
    if (options.scene != undefined) {
      this.setData({
        userId: options.scene
      })
      util.kmRequest({
        data: {
          interfaceName: getCarQrCodeByContentUrl,
          param: {
            content: options.scene,
          },
          token: '',
        },
        success: (res) => {
          if (res.data.status == 1) {
            app.globalData.content = options.scene
            wx.redirectTo({
              url: '/pages/cars/mycar/referrer/referrer'
            })  
          } else if (res.data.status == 3) {
             
          }
        }
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