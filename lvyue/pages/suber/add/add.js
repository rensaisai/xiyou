const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getGoodsListUrl = config.getGoodsListUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:['商品','线路'],
    index:0,
    hiddenNone:true,
    loadingType: 0,
    loding: false,
    goodslist:null,
    page:1,
    currentData:0,
    search:'',
  },
  commodity() {
    var that = this;
    if (that.data.currentData == 0){
      var goodsType = 0
    }else{
      var goodsType = 5
    }
    if (search != ''){
      var search = that.data.search
    }else{
      var search = ''
    }
    util.kmRequest({
      url: getGoodsListUrl,
      data:{
        goodsType: goodsType,
        search: search,
        page:that.data.page
      },
      method:"post",
      success:(res)=>{
        if(res.data.status == 1){
          var goodslist = JSON.parse(res.data.data)[0].pageData
          if (goodslist.length < 10) {
            that.setData({
            loding: true,
            loadingType: 2
            })
          }
          if (that.data.goodslist != null) {
            var commoditylist = that.data.goodslist
            var goodslist = commoditylist.concat(goodslist)
          } 
        }else if(res.data.status == 6){
          if (that.data.page > 0) {
             that.setData({
               page:that.data.page - 1,
              loadingType:2,
              loding:true
             })
           
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        that.setData({
          goodslist: goodslist,
          search:'',
        })
        if (that.data.goodslist == null || that.data.goodslist.length == 0) {
           that.setData({
             hiddenNone:''
           })
        } else {
          that.setData({
            hiddenNone:true
          })
        }
      }
    })
  },
  checkCurrent(e){
    var that = this
    that.setData({
      index: e.currentTarget.dataset.index,
      currentData: e.currentTarget.dataset.index,
      goodslist: null,
      hiddenNone: true,
      loadingType: 0,
      loding: false,
      page: 1,
      search: '',
    })
    that.commodity()
  },
  eventchange(e){
    var that = this
    that.setData({
      index: e.detail.current,
      currentData: e.detail.current,
      goodslist: null,
      hiddenNone: true,
      loadingType: 0,
      loding: false,
      page: 1,
      search: '',
    })
    that.commodity()
  },
  scroll(e){
    var that = this
    if (this.data.loadingType != 0 || this.data.loding || this.data.hiddenNone == false) {
      return;
    }
    this.setData({
      loadingType: 1
    });
    setTimeout(() => {
      that.setData({
        loadingType: 0,
        page: that.data.page + 1
      })
        that.commodity()
    }, 1000)
  },
  goods(e){
    var that = this
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 2]; // 当前页面
    currPage.data.busiId = that.data.goodslist[e.currentTarget.dataset.index]
    wx.navigateBack({
      delta: 1
    })
  },
  goodsseek(e){
   console.log(e)
   this.setData({
     search: e.detail.value,
     goodslist: null,
     hiddenNone: false,
     loadingType: 0,
     loding: false,
     page: 1,
   })
  },
  goodssech(){
    this.setData({
      page: 1,
      goodslist: null,
      hiddenNone: false,
      loadingType: 0,
      loding: false,
    })
    this.commodity()
  },
  cancel(){
    this.setData({
      circuitlist: null,
      pages:0,
      loadingTypes:0,
      lodings:false,
    })
    this.data.search = '',
    this.data.type = '',
    this.destination()
  },
  goodscancel(){
    this.setData({
      goodslist: null,
      page: 0,
      loadingType: 0,
      loding: false,
    })
    this.commodity()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 45;
      }
    })
    this.setData({
      windowHeight: windowHeight
    })
    this.commodity()
    // this.destination()
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