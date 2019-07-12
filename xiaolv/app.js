//app.js
const  config = require('./config.js')
// const getXLOpenIdUrl = config.getXLOpenIdUrl
const token = config.token
const  util = require('/utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    that.getUserInfo();
    wx.getStorage({
      key: token,
      success(res) {
        console.log(res.data)
        that.globalData.token = res.data
      }
    })
  },
  onHide: function () {
    var that = this
    var pages = getCurrentPages();
    // if (pages['0'].route == "pages/index/index") {
      that.globalData.page = 1
    // }
    // this.getLocation();
  },
  globalData: {
    userInfo: null,
    openid:null,
    userId: null,
    kmUserInfo: null,//memberType;//0车主 1修理厂 2连锁店
                    //memberFlag 未交费0 已交费1 喜游已交费的2
    token:null,
    accesss_token:null,
    fctInfo:null,
    brInfo:null,
    yearInfo:null,
    ccInfo:null,
    page:0,
    carInfo:null,
    cityCode:null,
    cityName:'太原市',
    locationInfo:null,
    addressComponent:null,
    refereInfo:null,//保养顾问，推荐人

    content:null,
  },
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        util.kmConsoleLog(res.userInfo);
        that.globalData.userInfo = res.userInfo;
      }
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           that.globalData.userInfo = res.userInfo

    //         }
    //       })
    //     }
    //   }
    // })
  },
})