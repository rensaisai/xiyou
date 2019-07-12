const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const goodsseek = config.goodsseek
const getAllHotGoodsNameListUrl = config.getAllHotGoodsNameListUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    history:null,
    type:'',
  },
  hot(){
    var that = this
    util.kmRequest({
      url: getAllHotGoodsNameListUrl,
      data:{},
      method:"post",
      success:(res)=>{
        if(res.data.status == 1){
          var hot = (res.data.data).split(',')
          var hots = hot.slice(0, hot.length - 1)
          that.setData({
            hot:hots,
            value: hots[0]
          })
        }
      }
    })
  },
  input(e){
    this.setData({
      value: e.detail.value
    })
  },
  detail(e){
    this.setData({
      history: null
    })
    wx.removeStorage({
      key: goodsseek,
      success(res) {
        
      }
    })
  },
  seekbtn(e){
    var that = this
    var history = that.data.history
    var arr = []
    var lists = null
    if(that.data.value == ''){
      wx.showToast({
        title: '请输入你要搜索的内容...',
        icon:'none'
      })
      return
    }
    if (history != null) {
      history.forEach((i) => {
          arr.push(that.data.value)
          lists = arr.concat(history)
      })
    }else{
      arr.push(that.data.value)
      lists = arr
    }
    var arrs = []
    for (var i = 0; i < lists.length; i++) {
      console.log(lists.indexOf(lists[i]))
      if (arrs.indexOf(lists[i]) == -1) {
        arrs.push(lists[i])
      }; 
    }
    if (arrs.length < 10){
      var list = arrs
    }else{
      var list = arrs.slice(0, 10)
    }
    wx.setStorage({
      key: goodsseek,
      data: list,
    })
    if (that.data.type == 0){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.data.search = that.data.value
      prevPage.data.type = that.data.type
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.navigateTo({
        url: '/pages/suber/list/list?text=' + that.data.value,
      })
    }
  },
  label(e){
    wx.navigateTo({
      url: '/pages/suber/list/list?text=' + e.currentTarget.dataset.text,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hot()
    if (options.type != undefined) {
      this.setData({
        type: options.type
      })
    }
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
    var that = this
    wx.getStorage({
      key: goodsseek,
      success(res) {
        if (res.errMsg == 'getStorage:ok'){
          if (res.data != undefined ){
            var data = res.data
            that.setData({
              history: data
            })
          }
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