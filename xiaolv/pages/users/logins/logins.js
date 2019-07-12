// pages/users/logins/logins.js
const config=require('../../../config.js')
const util=require('../../../utils/util.js')
const md5 = require('../../../utils/md5.js').md5
const getCodeUrl = config.getCodeUrl
const verificationCodeByCodeAndPhoneUrl = config.verificationCodeByCodeAndPhoneUrl
const token = config.token
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    send: true,
    alreadySend: false,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',
    otherInfo: '',
    active:true,
    loading:false,
  },
  link(){
    wx.navigateTo({
      url: '/pages/upgrade/protocol/protocol',
    })
  },
  // radio(){
  //   this.setData({
  //     active:true
  //   })
  // },
  loginRequest: function (e) {
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    if (this.data.code == '' && this.data.phoneNum == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (this.data.code == '' && (this.data.send == true || this.data.alreadySend == true)) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {
      if (app.globalData.userId != null){
        var userId = app.globalData.userId
      }else{
        var userId = ''
      }
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      that.setData({
        loading: true
      })
      if (app.globalData.content != '' && app.globalData.content != null) {
        var content = app.globalData.content
      } else {
        var content = ''
      }
      util.kmRequest({
        data: {
          token:'',
          sign: md5('grcms@2019' + timestamp + that.data.phoneNum),
          interfaceName: verificationCodeByCodeAndPhoneUrl,
          param:{
            phone: that.data.phoneNum,
            code: that.data.code,
            openId: app.globalData.openid,
            ancestor:userId,
            content: content
          }
        },
        success: function (res) {
          if (res.data.status == 1) {
            app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
            wx.setStorage({
              key: token,
              data: app.globalData.kmUserInfo.token
            })
            wx.getStorage({
              key: token,
              success(res) {
                app.globalData.token = res.data
              }
            })  
            wx.switchTab({
              url: '/pages/index/index'
            })
            wx.showToast({
              title: "登录成功",
            })
          } else {  
            that.setData({
              loading: false
            })
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
      
    }
  },
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
    // this.activeButton()
    console.log('code' + this.data.code)
  },
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    console.log(phoneNum)
    if (phoneNum.length === 11) {
      var checkedNum = this.checkPhoneNum(phoneNum)
      console.log('phone' + checkedNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        // this.showSendMsg()
        // this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      // this.hideSendMsg()
    }
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

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },
  hideSendMsg: function () {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  sendMsg: function () {
    var phoneNum = this.data.phoneNum;
    if (phoneNum != '' && phoneNum.length === 11) {
    
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      console.log('grcms@2019' + timestamp + phoneNum)
      util.kmRequest({
        // url: getCodeUrl,
        data: {
          token:'',
          sign: md5('grcms@2019' + timestamp + phoneNum),
          interfaceName: getCodeUrl,
          param:{
            phone: phoneNum,
          }
        },
        success: function (res) {
          console.log(res.data)
          if(res.data.status==1){
            var data = res.data.data
            console.log(data)
          }else{
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