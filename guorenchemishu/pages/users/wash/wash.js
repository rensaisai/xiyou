const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCarwashUrl = config.getCarwashUrl 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caty: '',
    // adsList: null,
    hiddenNone: 'true',
    sortname: '评分最高',
    sortList: ['距离优先', '评分最高'],
    orderType: 0,// 0 - 距离优先，1-评价优先
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    loadmore:false,
    page:0,
  },

  vehicle: function () {
    var that = this
    var lon = -1;
    var lat = -1;
    if (app.globalData.locationInfo != null) {
      lon = app.globalData.locationInfo.longitude,
        lat = app.globalData.locationInfo.latitude
    }
    util.kmRequest({
      data: {
        interfaceName: getCarwashUrl,
        param:{
          cityCode: app.globalData.cityCode,
          orderType: that.data.orderType,
          lon: lon,
          lat: lat,
          pageNum: that.data.page
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var stars = new Array();
            var count = item.evaluate1;
            for (var j = 0; j < count; j++) {
              stars[j] = j;
            }
            item.stars = stars;
            item.grade = item.evaluate1.toFixed(2)
            if (item.distance != -1) {
              item.distanceShow = item.distance.toFixed(2) + 'km';
            } else {
              item.distanceShow = '';
            }
          }
          if (that.data.page > 0 && list.length == 0) {
            that.setData({
              page: that.data.page - 1,
              loadmore: true
            });
          }
          if (that.data.list != null && that.data.page > 0) {
            var shoplist = that.data.list
            var list = shoplist.concat(list)
          }
          that.setData({
            list: list
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: ''
          })
        } else {
          that.setData({
            hiddenNone: 'true'
          })
        }
      }
    })
  },
  andmore() {
    wx.navigateTo({
      url: '/pages/map/map?type=' + 3 + '&scign=' + 0
    })
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/users/wash-details/wash-details?selectItem=' + JSON.stringify(selectItem)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.cityName != null) {
      this.setData({
        city: app.globalData.cityName
      })
    }
    this.vehicle()
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

  chooseCity: function () {
    wx.navigateTo({
      url: '/pages/address/province/provincelist?num=' + 1,
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
        that.vehicle();
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果仁车秘书',
      desc: '正品配件，专业保养',
      path: '/pages/index/index'
    }
  }
})