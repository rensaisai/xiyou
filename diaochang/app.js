//app.js
var util = require('/utils/util')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    this.getUserInfo();
  },
  globalData: {
    userInfo: null,
    openid:null,
    kmUserInfo: null,//memberType;//0车主 1修理厂 2连锁店
                    //memberFlag 未交费0 已交费1 喜游已交费的2

    fctInfo:null,
    brInfo:null,
    yearInfo:null,
    ccInfo:null,
    
    carInfo:null,
    cityCode:null,
    cityName:'太原市',
    locationInfo:null,
    addressComponent:null,

    refereInfo:null//保养顾问，推荐人
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