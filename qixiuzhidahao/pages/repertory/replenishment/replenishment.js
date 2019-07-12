const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getPurchaseByMechanismIdUrl = config.getPurchaseByMechanismIdUrl
const getReplenishByMechanismIdUrl = config.getReplenishByMechanismIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    hiidenNone:'',
    windowHeight:'',
    currentData:0,
    loadmore: false,
    isHideLoadMore: true,
    type:'',
    page:0,
    active:true,
  },
  triggerbtn(){
   var that = this
   if(that.data.active){
     that.setData({
       list:null,
       active:false,
       currentData: 0,
       loadmore: false,
       isHideLoadMore: true,
       type: '',
       page: 0,
     })
     that.superior()
   }else{
     that.setData({
       list: null,
       active: true,
       currentData: 0,
       loadmore: false,
       isHideLoadMore: true,
       type: '',
       page: 0,
     })
     that.replenishment()
   }
  },
  replenishment(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getPurchaseByMechanismIdUrl,
        param:{
          mechanismId: app.globalData.kmUserInfo.mechanismId,
          type:that.data.type,
          pageNumber:that.data.page
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
         var list = JSON.parse(res.data.data)
          list.forEach((i)=>{
            i.price = '￥' + i.price
            switch (i.status) {
              case 1:
                i.stat = '待发货'
                i.btn = '查看'
                break;
              case 2:
                i.stat = '待收货'
                i.btn = '收货'
                break;
              case 3:
                i.stat = '已完成'
                i.btn = '查看'
                break;
              case 4:
                i.stat = '待付款'
                i.btn = '支付'
                break;
            }   
          })
          if (that.data.list != null) {
            var lists = that.data.list
            var list = lists.concat(lists)
          }
          that.setData({
            list:list
          })
        }else if(res.data.status == 6){
          if (that.data.page > 0) {
            that.setData({
              page: that.data.page - 1,
              loadmore: true
            });
          }
        }
        if(that.data.list == null || that.data.list.length == 0){
         that.setData({
           hiidenNone:''
         })
        }else{
          that.setData({
            hiidenNone:true
          })
        }
      }
    })
  },
  superior(){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: getReplenishByMechanismIdUrl,
       param:{
         mechanismId: app.globalData.kmUserInfo.mechanismId,
         type: that.data.type,
         pageNumber: that.data.page
       }
     },
     success:(res)=>{
       if (res.data.status == 1) {
         var list = JSON.parse(res.data.data)
         list.forEach((i) => {
           i.price = '￥' + i.price
           switch (i.status) {
             case 0:
               i.stat = ''
               i.btn = '查看'
               break;
             case 1:
               i.stat = '待发货'
               i.btn = '查看'
               break;
             case 2:
               i.stat = '待收货'
               i.btn = '收货'
               break;
             case 3:
               i.stat = '已完成'
               i.btn = '查看'
               break;
             case 4:
               i.stat = '待付款'
               i.btn = '支付'
               break;
           }
         })
         if(that.data.list != null){
           var lists =  that.data.list
           var list = lists.concat(lists)
         }
         that.setData({
           list: list
         })
       } else if (res.data.status == 6) {
         if (that.data.page > 0) {
           that.setData({
             page: that.data.page - 1,
             loadmore: true
           });
         }
       }
       if (that.data.list == null || that.data.list.length == 0) {
         that.setData({
           hiidenNone: ''
         })
       } else {
         that.setData({
           hiidenNone: true
         })
     }
     }
   })
  },
  scroll(){
    var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true) {
      that.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page: that.data.page + 1
        })
        that.replenishment()
      }, 1000)
    }
  },
  goods(e){
   console.log(e)
    var goods = this.data.list[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/repertory/bhdetails/bhdetails?goods=' + JSON.stringify(goods) + '&type='+this.data.active,
    })
  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    switch (current) {
      case 0:
        var type = ''
        break;
      case 1:
        var type = 4
        break;
      case 2:
        var type = 1
        break;
      case 3:
        var type = 2
        break;
      case 4:
        var type = 3
        break;
    }   
    this.setData({
      currentData: current,
      loadmore: false,
      isHideLoadMore: true,
      type: type
    })
    this.replenishment()
  },
  eventchange: function (e) {
    var current = e.detail.current
    switch (current) {
      case 0:
        var type = ''
        break;
      case 1:
        var type = 4
        break;
      case 2:
        var type = 1
        break;
      case 3:
        var type = 2
        break;
      case 4:
        var type = 3
        break;
    }   
    this.setData({
      currentData: current,
      loadmore: false,
      isHideLoadMore: true,
      type:type
    })
    this.replenishment()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 100;
      }
    })
    this.setData({
      windowHeight: windowHeight
    })
    this.replenishment()
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