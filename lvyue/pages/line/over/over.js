const config = require('../../../config.js')
const getTouristRouteByKeyWordUrl = config.getTouristRouteByKeyWordUrl
const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   hiddenNone:true,
   loadingType: 0,
   loding:false,
   status:1,
  },
  over: function (keyWord){
    var that = this
    util.kmRequest({
      url: getTouristRouteByKeyWordUrl,
      method: "POST",
      data:{
        keyWord: keyWord
      },
      success:function(res){
       if(res.data.status ==1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for (var i = 0; i < list.length; i++) {
           list[i].lineName = '<' + list[i].lineName + '>'
         }
         that.setData({
           list:list,
           loadingType: 2,
           loding: true,
         })
       }else if(res.data.status == 6){
        
       }else{
         wx.showToast({
           title: res.data.msg,
           icon: "none"
         })
       }
        if (that.data.list == null || that.data.list.length==0) {
          that.setData({
            hiddenNone: false,
          })
        } else {
          that.setData({
            hiddenNone: true,
          })
        }
      }
    })
  },
  bourn: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    if (type == 0){
      wx.navigateTo({
        url: '/pages/line/sincedetails/sincedetails?id=' + id,
      })
    }
    if (type == 1){
      wx.navigateTo({
        url: '/pages/line/scattered/scattered?id=' + id,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.over(options.name)
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
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    wx.showNavigationBarLoading();
    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
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