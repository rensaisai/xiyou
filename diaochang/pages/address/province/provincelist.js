const getProvicesUrl = require('../../../config').getProvicesUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    list: [
    ],

    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏

    id:null
  },
  dataRequest:function(){
    var that = this;
    util.kmRequest({
      url: getProvicesUrl,
      data: {
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            list: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.dataRequest();
    wx.showNavigationBarLoading()

    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },
  //加载更多
  onReachBottom: function () {
    this.setData({
      isHideLoadMore: false,
    });
    setTimeout(() => {
      var list = this.data.list;
      this.setData({
        isHideLoadMore: true,
        list:list
      })
    }, 1000)
  },
  onLoad: function (options) {
    // var secondId = options.id;
    this.dataRequest();
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    app.globalData.fctInfo = selectItem;
    wx.navigateTo({
      url: '/pages/address/city/citylist?id=' + selectItem.areaLevel
    });
  }
})

