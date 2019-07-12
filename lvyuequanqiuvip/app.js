//app.js
var util = require('/utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    that.getUserInfo();
  },
  globalData: {
    userInfo:null,
    openid:null,
    kmUserInfo: null,//userType 0商户 1用户
                    //userFlag 0未交费 1已交费
    fctInfo:null,
    brInfo:null,
    yearInfo:null,
    ccInfo:null,
    
    carInfo:null,
    cityCode:null,
    cityName:'太原市',
    locationInfo:null,
    addressComponent:null,
    
    refereInfo:null,//推荐人
    tenantId:'',//商户id 默认总部
    tenantNo: ''//商户编码 默认总部
  },
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        util.kmConsoleLog(res.userInfo);
        that.globalData.userInfo = res.userInfo;
        console.log(that.globalData.userInfo);
      }
    })
  }
})