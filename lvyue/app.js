
App({
  onLaunch: function (options) {
    
  },
  onHide: function () {
    var that = this
    var pages = getCurrentPages();
    that.globalData.page = 1
  },
  globalData: {
    userInfo: null,
    openid: null,
    kmUserInfo: null,//userType 0商户 1用户
    //userFlag 0未交费 1已交费
    fctInfo: null,
    brInfo: null,
    yearInfo: null,
    ccInfo: null,

    page: 0,
    status:'',

    carInfo: null,
    cityCode: null,
    cityName: '太原市',
    locationInfo: null,
    addressComponent: null,

    refereInfo: null,//推荐人
    tenantId: '',//商户id 默认总部
    tenantNo: '',//商户编码 默认总部
  },
})