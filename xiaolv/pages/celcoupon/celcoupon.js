const config = require('../../config.js')
const util = require('../../utils/util.js')
const getCodeByCardNumberUrl = config.getCodeByCardNumberUrl
const writeOffCardTicketUrl = config.writeOffCardTicketUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: true,
    alreadySend: false,
    second: 60,
    carvcher:'',
    code:'',
  },
  formSubmit(e){
   console.log(e)
   var that = this
    if (e.detail.value.carvcher == ''){
      wx.showToast({
        title: '请输入卡券号',
        icon:'none'
      })
      return
    } else if (e.detail.value.code == ''){
      wx.showToast({
        title: '请获取验证码',
        icon: 'none'
      })
      return
    }
    util.kmRequest({
      data:{
        interfaceName: writeOffCardTicketUrl,
        param: {
          cardNumber: e.detail.value.carvcher,
          code: e.detail.value.code
        }
      },
      success:(res)=>{
        console.log(res)
        if (res.data.status == 1){
          wx.showToast({
            title: '成功',
          })
          that.setData({
            carvcher: '',
            code: '',
          })
        }else if(res.data.status == 6){

        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  phone(e){
   this.setData({
     carvcher: e.detail.value
   })
  },
  sendMsg() {
    var that = this
    if (that.data.carvcher == '') {
      wx.showToast({
        title: '请输入卡券号',
        icon: 'none',
      })
      return
    }
    that.pop()
  },
  pop(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCodeByCardNumberUrl,
        param: {
          cardNumber: that.data.carvcher,
        }
      },
      success: (res) => {
        if(res.data.status == 1){
             that.setData({
               send: false,
               alreadySend: true,
             })
          that.timer()
        }else if(res.data.status == 6){

        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  timer() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
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