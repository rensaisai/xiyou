 // pages/users/search/search.js
const config = require('../../../config.js')
const getAllGoodsTypeUrl = config.getAllGoodsTypeUrl
const getAllVipSCGoodsUrl = config.getAllVipSCGoodsUrl
const getAllVipZGGoodsUrl = config.getAllVipZGGoodsUrl
const getGoodsByGoodsTypeIdUrl = config.getGoodsByGoodsTypeIdUrl
const loginVipByOpenIdUrl = config.loginVipByOpenIdUrl
const getAdsUrl = config.getAdsUrl
var app = getApp()
console.log(app)
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: [
    ],
    windowHeight:'',
    currentData: 0,
    indexs:0,
    list: null,
    goods:null,
    commodity:null,
    value: '',
    show: false,
    // menuTapCurrent: 0,
    isHideLoadMore: true,
    hiddenNone: 'true',
    hiddenNones:true,
    adsList:null,
    page:0,
    goodstypeid:0,
    scrollLeft:'',
  },
  // 获取轮播图
  adsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
      },
      success: function (res) {
        console.log(JSON.parse(res.data.data))
        if (res.data.status == 1) {
          that.setData({
            adsList: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  // 点击跳转列表
  checkCurrent: function (e) {
    console.log(e)
    var that = this;
    var goodstypeid = e.currentTarget.dataset.id	
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.currentTarget.dataset.index,
        goodstypeid: goodstypeid,
        scrollLeft: e.currentTarget.dataset.index*30
      })
      that.commodity(goodstypeid)
    }
  },
  eventchange:function(e){
    var that = this
    var list = that.data.list
    var current = e.detail.current
    var goodstypeid = list[current].id
    this.setData({
      currentData: current,
      page: 0,
      commodity:null,
      scrollLeft: current* 30
    })
    that.commodity(goodstypeid)
  },
  scroll(e){
    var page = this.data.page+1
    this.setData({
      isHideLoadMore: false,
      page:page 
    })
    setTimeout(() => {
      this.commodity(this.data.goodstypeid)
      this.setData({
        isHideLoadMore: true,
      })
    }, 1000)
  },
  showNone: function () {
    if (this.data.commodity == null || this.data.commodity.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  userInfoRequest: function () {
    var that = this;
    util.kmRequest({
      url: loginVipByOpenIdUrl,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data)[0])
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          console.log(app.globalData.kmUserInfo)
        }
      }
    })
  },
  boutique(){
      wx.showToast({
        title: '敬请期待...',
        icon:'none'
      })
  },
  // boutique:function(){
  //   wx.navigateTo({
  //     url:'/pages/suber/products/products'
  //   })
  // },
  // protect:function(){
  //   wx.navigateTo({
  //     url: '/pages/suber/protect/protect'
  //   })
  // },
  // specialty:function(){
  //   wx.navigateTo({
  //     url: '/pages/suber/specialty/specialty'
  //   })
  // },
  // circuit:function(){
  //   wx.switchTab({
  //     url: '/pages/index/index'
  //   })
  // },
  buy:function(e){
    console.log(app)
     if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.tenantId !='' ){
      console.log(e)
      var id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + id
     })
    }
    if ((app.globalData.kmUserInfo.isVip == 0) && (app.globalData.kmUserInfo.tenantId == '')) {
      wx.navigateTo({
        url:'/pages/suber/referrer/referrer'
      })
    }
  },
  details:function(e){
    console.log(e)
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.tenantId != '') {
      console.log(e)
      var id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + id
      })
    }
    if ((app.globalData.kmUserInfo.isVip == 0) && (app.globalData.kmUserInfo.tenantId == '')) {
      wx.navigateTo({
        url: '/pages/suber/referrer/referrer'
      })
    }
  },
  // 获取分类商品
  commodity:function (goodstypeid){
    var that =this;
    if (goodstypeid == undefined){
      goodstypeid=0
    }else{
      goodstypeid = goodstypeid
    }
    util.kmRequest({
      url: getGoodsByGoodsTypeIdUrl,
      data:{
        goodsTypeId: goodstypeid,
        goodsSource:'sc',
        page: that.data.page,
        source:wx,
      },
      success:function(res){
        if(res.data.status == 1){
          var commodity = JSON.parse(res.data.data)
          console.log(commodity)
          if (that.data.commodity == null){
            var goodslist = commodity
          }else{
            var goods = that.data.commodity
            var goodslist = goods.concat(commodity)
          }
          that.setData({
            commodity: goodslist
          })
        } else if (res.data.status == 6){
          if(that.data.page >0){
            that.setData({
              hiddenNones: false,
            });
            setTimeout(() => {
              that.setData({
                hiddenNones: true,
                page: that.data.page-1
              })
            }, 500)
          }else{
            that.setData({
              commodity: null
            })
          }
        }
        that.showNone()
      }  
    })
  },
  // 获取商城分类
  goodscategory:function(){
    var that=this
     util.kmRequest({
       url: getAllGoodsTypeUrl,
       data:{},
       success:function(res){
         if(res.data.status==1){
           var list = JSON.parse(res.data.data)
           for(var i=0; i<list.length; i++){
             var sid=list[i].id
             var index =[{sid}]
           }
           that.setData({
             list: list,
           })
         }
       }
     })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.goodscategory();
   this.userInfoRequest();
   this.adsRequest();
   this.commodity();
   this.setData({
     page: 0,
     currentData: 0,
     goodstypeid: 0,
   })
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
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight-42;
      }
    })
    this.setData({
      windowHeight: windowHeight
    })
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
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)) {
      tenantId = app.globalData.kmUserInfo.tenantId;
      console.log(tenantId)
      tenantNo = app.globalData.kmUserInfo.userNo;
      console.log(tenantNo)
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  },
})