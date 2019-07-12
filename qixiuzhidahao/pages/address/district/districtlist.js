const getYearInfoUrl = require('../../../config').getYearInfoUrl

var util = require('../../../utils/util')
var app = getApp()

Page({
  data: {
    list: [
    ],

    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏

    id:null
  },
  dataRequest: function (d){
    var that = this;
    util.kmRequest({
      url: getYearInfoUrl,
      data: {
        brId: this.data.id
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
    var id = options.brid;
    if (id != null) {
      this.setData({
        id: id
      })
    }
    this.dataRequest();
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    app.globalData.yearInfo = selectItem;

    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})

