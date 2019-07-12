const config = require('../../../config')
const util = require('../../../utils/util')
const getRepairsByKeywordsUrl = config.getRepairsByKeywordsUrl
var app = getApp()
Page({
  data: {
    list:null,
    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    keyword: '',
    hiddenNone: 'true'
  },
  repairsRequest: function () {
    var that = this;
    var lon = -1;
    var lat = -1;
    if (that.data.keyword == ''){
      wx.showToast({
        title: '请输入搜索的内容',
        icon:'none',
      })
      return
    }
    if (app.globalData.locationInfo != null) {
      lon = app.globalData.locationInfo.longitude,
        lat = app.globalData.locationInfo.latitude
    }
    util.kmRequest({
      data: {
        interfaceName: getRepairsByKeywordsUrl,
        param:{
          cityCode: app.globalData.cityCode,
          keywords: that.data.keyword,
          lon: lon,
          lat: lat
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var stars = new Array();
            var count = item.evaluate;
            for (var j = 0; j < count; j++) {
              stars[j] = j;
            }
            item.stars = stars;
            item.grade = item.evaluate.toFixed(2)
            if (item.distance != -1) {
              item.distanceShow = item.distance.toFixed(2) + 'km';
            } else {
              item.distanceShow = '';
            }
          }
          that.setData({
            list: list
          });
          that.show()
        }
      }
    })
  },
  show(){
    var that = this
    if (that.data.list == null || that.data.list.length == 0) {
      that.setData({
        hiddenNone: ''
      })
    } else {
      that.setData({
        hiddenNone: 'true'
      })
    }
  },
  itemClick: function (event) {
    if (!util.checkUserInfo()) {
      return;
    }
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/progect/project?selectItem=' + JSON.stringify(selectItem)
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.repairsRequest();
    wx.showNavigationBarLoading();

    //模拟加载
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
  this.show()
  },
  keywordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  searchShop: function () {
    this.setData({
      list:null,
    })
    this.repairsRequest();
  },
})

