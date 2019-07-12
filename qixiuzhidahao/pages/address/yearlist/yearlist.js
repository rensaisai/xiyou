const getYearInfoUrl = require('../../../config').getYearInfoUrl

var util = require('../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    sid:null,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏
    id: null,

    titleName: '',
    logo: '',
    hiddenNone: 'true',
    addCar: 0
  },
  dataRequest: function () {
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
        list: list
      })
    }, 1000)
  },
  onLoad: function (options) {
    var id = options.brid;
    var sid = options.userId;
    console.log(sid)
    this.setData({
      sid:sid
    })
    if (id != null) {
      this.setData({
        id: id,
        titleName: app.globalData.fctInfo.fctName + app.globalData.brInfo.brName,
        logo: app.globalData.fctInfo.img
      })
    }
    var addCar = options.addCar;
    if (addCar != null) {
      this.setData({
        addCar: addCar
      });
    }
    this.dataRequest();
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];

    app.globalData.yearInfo = selectItem;
    if (app.globalData.carInfo == null || this.data.addCar == 1) {
      wx.navigateTo({
        url: '/pages/address/submit/submit?userId='+this.data.sid
        // url: '/pages/cars/carselect/cc/cclist?yearid=' + selectItem.id
      });
    } else {
      wx.navigateBack({
        delta: 3
      })
    }
  }
})

