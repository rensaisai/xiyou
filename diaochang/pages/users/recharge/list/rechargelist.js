const config = require('../../../../config')
const getRechargeListUrl = config.getRechargeListUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [
    ],

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    hiddenNone: 'true'
  },
  rechargesRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      url: getRechargeListUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
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
    this.rechargesRequest();
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
    // var keywords = options.keywords;
  },
  onShow:function(){
    this.rechargesRequest();
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    // wx.navigateTo({
    //   url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    // });
  },
  add: function () {
    if (!util.checkUserMemberFlag()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/recharge/add/rechargeadd'
    });
  }
})

