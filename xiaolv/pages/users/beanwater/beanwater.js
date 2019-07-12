const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserBeanFlowingUrl = config.getUserBeanFlowingUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   hiddenNone:true,
  isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
  loadmore: false,
   page:0,
   list:null,
  },
  bean(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getUserBeanFlowingUrl,
        param:{
          userId: app.globalData.kmUserInfo.id,
          pageNum: that.data.page
        }
      },
      method:"post",
      success(res){
        console.log(res.data.data)
        if(res.data.status == 1){
           var list = JSON.parse(res.data.data)
           console.log(list)
           for(var  i=0; i<list.length; i++){
             var time = list[i].createTime.slice(0,16)
             list[i].time = time
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
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
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
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.bean()
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
    if (that.data.loadmore == false) {
      var pages = that.data.page + 1
      that.setData({
        isHideLoadMore: false,
        page: pages
      });
      setTimeout(() => {
        that.bean();
        that.setData({
          isHideLoadMore: true,
        })
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})