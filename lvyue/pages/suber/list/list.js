const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const searchGoodsUrl = config.searchGoodsUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    page:0,
    loadingType: 0,
    loding: false,
    hiddenNone:true,
  },
  list(){
    var that = this
    util.kmRequest({
      url: searchGoodsUrl,
      data:{
        parameter:that.data.text,
        source:'app',
        page:that.data.page,
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          if (list.length > 0){
            if(list.length < 5){
              that.setData({
                loding: true,
                loadingType: 2,
              });
            }
            that.setData({
              list: list
            })
          }else{
            if (that.data.page > 0) {
              that.setData({
                loding: true,
                loadingType: 2,
                page: that.data.page - 1,
              });
            }
          }
          if(that.data.list == null || that.data.list.length == 0){
            that.setData({
              hiddenNone:''
            })
          }else{
            that.setData({
              hiddenNone:true
            })
          }
        }
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      text: options.text
    })
    this.list()
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
      that.list()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})