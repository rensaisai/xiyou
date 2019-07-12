const config = require('../../../config')
const isExistByNumberUrl = config.isExistByNumberUrl
const getTenantInfoByTenantIdUrl = config.getTenantInfoByTenantIdUrl
const getUserAllMailingAddressUrl = config.getUserAllMailingAddressUrl
const isMemberUrl = config.isMemberUrl
var app = getApp()
console.log(app)
var util = require('../../../utils/util')

Page({
  data: {
    site:null,
    loading:false,
    pays: [
      { value: 'wxpay', name: '微信', checked: 'true' }
    ],
    payType: 'kmPay',
    senders: [
      { value: '1', name: '快递', checked: 'true' },
      // { value: '2', name: '门店自取' }
    ],
    sendType: null,
    // name: '',
    // address: '',
    // phone: '',
    lat: '',
    lon: '',
    phone:'',
    name:'',
    goodscolor:'',
    goodssize: '',
    fansPrice:'',
    disabled:false
    // tenantNo: '',
    // notEditTenantNo: true,
    // notEdit: false
  },
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  commitOrder: function (e) {
    var that = this;
    console.log(that.data.site)
    if ((that.data.site == undefined) || (that.data.site.province == '')){
      wx.showToast({
        title: '请添加收货地址',
        icon: "none"
      })
      return
    }
    var buyType = this.data.senders[0].value
    var data={
      // 原价
      orderAmount: that.data.sendType.fansPrice,
      tenantId: app.globalData.kmUserInfo.tenantId,
      userAddress: that.data.site.id,
      userName: that.data.site.receiver,
      goodsId: that.data.goodsid,
      goodsNum: that.data.num,
      phone: that.data.site.phone,
      price: that.data.sendType.memberPrice,
      openId: app.globalData.openid,
      skuId: that.data.sendType.skuId,
      // 取货方式
      buyType: buyType,
      orderSource:'wx', 
      userId:app.globalData.kmUserInfo.id,
      // 现金价，实际付款
      cashAmount: that.data.pay,
      coupon: that.data.coupon,
      orderType:'1',
      // region: add,
      isDefault: that.data.site.isDefault,
      isVip: app.globalData.kmUserInfo.isVip
    }
    console.log(data)
    that.setData({
      loading: true
    })
    wx.navigateTo({
      url: '/pages/pay/payment/payment?paytypel=' + JSON.stringify(data)
    });
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
 
  location:function(){
    var that = this
    util.kmRequest({
      url: getUserAllMailingAddressUrl,
      data:{
        userId:app.globalData.kmUserInfo.id,
        source: 'wx'
      },
      success:function(res){
        if(res.data.status == 1){
          var site = JSON.parse(res.data.data)
          console.log(site)
          for(var i=0; i<site.length; i++){
            if (site[i].isDefault == 1){
              var sites = site[i]
            } else if (site != [] && site[i].isDefault != 1){
              var sites=site[0]
            }
          }
          that.setData({
            site:sites
          })
        }
      }
    })
  },
  sitels:function(){
    wx.navigateTo({
      url: '/pages/addre/addre',
    })
  },
  sitel:function(){
    wx.navigateTo({
      url: '/pages/location/location',
    })
  },
  onLoad: function (options) {
    var data = JSON.parse(options.data)
    console.log(data)
    var num = data.num
    var price = data.price
    var coupon = app.globalData.kmUserInfo.coupon
    var subtotal = (price * num).toFixed(2)
    if (coupon > data.goodsdetails.couponPrice) {
      var pay = ((price * num) - data.goodsdetails.couponPrice).toFixed(2)
      var bean = data.goodsdetails.couponPrice
    } else {
      var bean = coupon
      var pay = ((price * num) - bean).toFixed(2)
    }
    this.setData({
      sendType: data.goodsdetails,
      goodsdard: data.goodsdard,
      goodsprice: price,
      goodsName: data.goodsName,
      subtotal: subtotal,
      supplier: data.supplier,
      num: num,
      pay: pay,
      goodsid: data.goodsid,
      coupon: bean
    })
  },
  onShow: function () {
    this.location();
    this.setData({
      loading:false
    })
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    console.log(currPage)
  },
})

