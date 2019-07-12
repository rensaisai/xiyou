const config = require('../../../../config')
const getUserAmountUrl = config.getUserAmountUrl

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
  amountRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserAmountUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            var title = '';
            switch(item.amountType){
              case '1':title = '成为会员赠送';
                break;
              case '2': title = '发展会员赠送';
                break;
              case '3': title = '保养消费花费';
                break;
              case '4': title = '提现花费余额';
                break;
              case '5': title = '充值';
                break;
            }
            item.title = title;
          }
          that.setData({
            list: list
          })
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
    this.amountRequest();
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
    this.amountRequest();
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    
  }
})

