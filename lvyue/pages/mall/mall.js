const config = require('../../config.js')
const util = require('../../utils/util.js')
const getGoodsVersionUrl = config.getGoodsVersionUrl
const getAdsUrl = config.getAdsUrl
const getAllGoodsTypeUrl = config.getAllGoodsTypeUrl
const getGoodsByGoodsTypeIdUrl = config.getGoodsByGoodsTypeIdUrl
const queryAllRunTimeUrl = config.queryAllRunTimeUrl
const queryRunTimeAppGoodsUrl = config.queryRunTimeAppGoodsUrl
const queryAppGoodsNumAllUrl = config.queryAppGoodsNumAllUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist:null,
    versions:1,
    windowHeight:'',
    adsList:null,
    currentData: 0,
    goodstypeid:0,
    commodity:null,
    title:'',
    active:true,
    indexs:0,
    time:null,
    timegoods:null,
    limitgoods:null,
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
  // 获取商城分类
  goodscategory: function () {
    var that = this
    util.kmRequest({
      url: getAllGoodsTypeUrl,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          var commodity = []
          for (var i = 0; i < list.length; i++) {
            commodity.push({ page: 0, loding: false, loadingType: 0, hiddenNone:true, goodstypeid:list[i].id,goods:null})
          }
          that.setData({
            list: list,
            commodity: commodity
          })
          that.commodity();
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
        scrollLeft: e.currentTarget.dataset.index * 30
      })
    }
  },
  timelist(e){
    var that = this
    var time = that.data.time[e.currentTarget.dataset.index]
    if (that.data.indexs === e.currentTarget.dataset.index) {
      return false;
    } else {
      that.setData({
        indexs: e.currentTarget.dataset.index,
        scrollLefts: e.currentTarget.dataset.index * 30
      })
    }
    that.timegood(time.runTimeId)
  },
  // 获取分类商品
  commodity: function () {
    var that = this;
    var commodity = that.data.commodity
    for (var i = 0; i < commodity.length; i++){
      if (commodity[i].goodstypeid == that.data.goodstypeid){
        var item = commodity[i]
        util.kmRequest({
          url: getGoodsByGoodsTypeIdUrl,
          data:{
            goodsTypeId: item.goodstypeid,
            goodsSource: 'sc',
            page: item.page
          },
          success(res){
            if(res.data.status == 1){
              var goodslist = JSON.parse(res.data.data)
              if (goodslist.length < 5){
                item.loding = true
                item.loadingType = 2
              }
              if (item.goods != null){
                var commoditylist = item.goods
                var goodslist = commoditylist.concat(goodslist)
                item.goods = goodslist
              }else{
                item.goods = goodslist
              }
            }else if(res.data.status == 6){
              if (item.page > 0) {
              item.page = item.page-1
              item.loadingType = 2
              item.loding = true
             }else{
               item.goods = []
             }
            }else{
              wx.showToast({
              title: res.data.msg,
              icon: "none"
             })
            }
            if (item.goods == null || item.goods.length == 0) {
              item.hiddenNone = ''
            } else {
              item.hiddenNone = true
            }
            that.setData({
              commodity: commodity,
            })  
          }
        })
      }
    }
  },
  eventchange: function (e) {
    var that = this
    var commodity = that.data.commodity
    var list = that.data.list
    var current = e.detail.current
    var goodstypeid = list[current].id
    that.setData({
      currentData: current,
      goodstypeid: goodstypeid,
      scrollLeft: current * 30
    })     
    for (var i = 0; i < commodity.length; i++){
      if (commodity[i].goodstypeid == goodstypeid){
        var item = commodity[i]
        if(item.goods == null){
          item.hiddenNone = false
          that.setData({
            commodity: commodity
          })
          that.commodity()
        } 
      }
    }
  },
  scroll(e) {
    var that = this
    var commodity = that.data.commodity
    for (var i = 0; i < commodity.length; i++){
      if (commodity[i].goodstypeid == that.data.goodstypeid){
        var item = commodity[i]
        if (item.loadingType != 0 || item.loding || item.hiddenNone == false) {
          return;
        }
        item.loadingType = 1
        that.setData({
          commodity: commodity,
        })
        setTimeout(()=>{
          item.loadingType = 0
          item.page = item.page + 1
          that.commodity()
        },1000)
      }
    }
  },
  buygoods(e){
    console.log(e)
    var that = this
    if (!util.whetherlanding()) {
      return
    }
      var runType = e.currentTarget.dataset.runtype
      if (runType == 1){
        var time = that.data.time[that.data.indexs]
      }
      if (runType == 1 && time.isRun == 0) {
        wx.showToast({
          title: '此活动已结束',
          icon: 'none'
        })
        return
      }else if (runType == 2 && e.currentTarget.dataset.num == 0){
      wx.showToast({
        title: '此商品已售罄',
        icon: 'none'
      })
      return
    }
    var id = e.currentTarget.dataset.id
    var runTimeId = e.currentTarget.dataset.runtimeid
    var isRun = e.currentTarget.dataset.isrun
    var maxNum = e.currentTarget.dataset.maxnum
    var runId = e.currentTarget.dataset.runid
    wx.navigateTo({
      url: '/pages/suber/goods/goods?id=' + id + '&runType=' + runType + '&runTimeId=' + runTimeId + '&isRun=' + isRun + '&maxNum=' + maxNum + '&runId=' + runId
    })
  },
  buy: function (e) {
      if (!util.whetherlanding()) {
        return
      }
      var id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + id
      })
  },
  xtime(){
   this.setData({
     title: '限时抢购',
     active: true
   })
    this.timelimit()
  },
  xquantity(){
    this.setData({
      title: '限量抢购',
      time:null,
      active: false
    })
    this.limitedgoods()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.adsRequest()
    this.goodscategory()
    this.timelimit()
    this.setData({
      currentData: 0,
      title: '限时抢购',
      timegoods: null,
      limitgoods: null,
      time: null,
      active: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  timelimit(){
   var that = this
   util.kmRequest({
     url: queryAllRunTimeUrl,
     data:{},
     method:"post",
     success:(res)=>{
       if(res.data.status == 1){
         var time = JSON.parse(res.data.data)
         if(time.length > 0){
         var index = 0
          time.forEach((i)=>{
            i.time = i.runStarTime.substring(10, 16)
          })
         for(var i=0; i<time.length; i++){
           if (time[i].isRun.indexOf("1") != -1){
             index = i
             break;
           } else if (time[i].isRun.indexOf("1") == -1 && time[i].isRun.indexOf("3") != -1){
             index = i
             break;
           }
         }
         that.timegood(time[index].runTimeId)
         that.setData({
           time:time,
           indexs:index
         })
         }else{
           if (that.data.limitgoods != null){
             that.setData({
               title: '限时抢购',
               active: true
             })
           }else{
             that.limitedgoods() 
           }
         }
       }else{
         
       }
     }
   })
  },
  timegood(id){
   var that = this
   util.kmRequest({
     url: queryRunTimeAppGoodsUrl,
     data:{
       runTimeId:id
     },
     method:"post",
     success:(res)=>{
       if(res.data.status == 1){
         var timegoods = JSON.parse(res.data.data)
           that.setData({
             timegoods: timegoods
           })
       }
     }
   })
  },
  limitedgoods(){
   var that = this
   util.kmRequest({
     url: queryAppGoodsNumAllUrl,
     data:{},
     method:"post",
     success:(res)=>{
       if(res.data.status == 1){
         var limitgoods = JSON.parse(res.data.data)
         if (limitgoods.length > 0){
           if (that.data.time == null) {
             that.setData({
               title: '限量抢购',
               active: false
             })
           }
           that.setData({
             limitgoods: limitgoods,
           })
         }else{
           that.setData({
             limitgoods: null,
           })
         }
         
       } 
     }
   })
  },
  seek(){
    wx.navigateTo({
      url: '/pages/suber/seek/seek',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 42;
      }
    })
    that.setData({
      windowHeight: windowHeight,
    })
    util.kmRequest({
      url: getGoodsVersionUrl,
      data: {},
      method: "post",
      success: (res) => {
        if (res.data.status == 1) {
             if (res.data.data == 0){
               util.kmRequest({
                 url: getGoodsByGoodsTypeIdUrl,
                 data: {
                   goodsTypeId: '105',
                   goodsSource: 'sc',
                   page: 0
                 },
                 success(res) {
                   if (res.data.status == 1) {
                     var goodslist = JSON.parse(res.data.data)
                     that.setData({
                       goodslist: goodslist,
                     })
                   } else if (res.data.status == 6) {
                     
                   } else {
                     wx.showToast({
                       title: res.data.msg,
                       icon: "none"
                     })
                   }
                 }
               })
             }
          that.setData({
            versions: res.data.data
          })
        }
      }
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

  }
})