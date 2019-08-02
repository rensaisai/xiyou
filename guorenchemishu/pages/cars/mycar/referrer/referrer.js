const config = require('../../../../config.js')
const util =require('../../../../utils/util.js')
const md5 = require('../../../../utils/md5.js').md5
const getCodeUrl = config.getCodeUrl
const bindQrCodeByPhoneAndAncestorUrl = config.bindQrCodeByPhoneAndAncestorUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    second: 60,
    send: true,
    alreadySend: false,
    phone:'',
  },
  phone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  formSubmit(e){
    var that = this
    var err = ''
    if (e.detail.value.input == ''){
      err = '请输入推荐人号'
    } else if (e.detail.value.input1 == ''){
      err = '请输入推荐人手机号'
    } else if (e.detail.value.input2 == '') {
      err = '请输入验证码'
    }
    if(err != '' && err.length > 0){
      wx.showToast({
        title: err,
        icon:'none'
      })
      return
    }
    util.kmRequest({
      data: {
        token: '',
        interfaceName: bindQrCodeByPhoneAndAncestorUrl,
        param: {
          content: app.globalData.content,
          ancestor: e.detail.value.input,
          phone: e.detail.value.input1,
          code: e.detail.value.input2,
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          wx.showToast({
            title: '绑定成功',
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          },2000)
        } else if (res.data.status == 3){
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
          if (res.data.msg == '推荐人号不存在'){
            that.setData({
              second: 60,
              send: true,
            })
          }
          if (res.data.msg != '验证码错误' && res.data.msg != '推荐人号不存在'){
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 2000)
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  checkPhoneNum: function (phoneNum) {
    if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none'
      })
      return false;
    } else {
      return true
    }
  },
  sendMsg: function () {
    var phoneNum = this.data.phone;
    if (phoneNum != '' && phoneNum.length === 11) {
    var checkedNum = this.checkPhoneNum(phoneNum)
    if (checkedNum == true){
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log('grcms@2019' + timestamp + phoneNum)
      util.kmRequest({
        data: {
          token: '',
          sign: md5('grcms@2019' + timestamp + phoneNum),
          interfaceName: getCodeUrl,
          param: {
            phone: phoneNum,
          }
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 1) {
            var data = res.data.data
            console.log(data)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
      this.setData({
        alreadySend: true,
        send: false
      })
      this.timer()
     }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
  },
  timer: function () {
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