const config = require('../../../../config')
const getRepairOrdersUrl = config.getRepairOrdersUrl
const setOrderStatusTo2Url = config.setOrderStatusTo2Url

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
  ordersRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      url: getRepairOrdersUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
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
    this.banksRequest();
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
    this.ordersRequest();
  },
  completeClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定完成保养吗?" + selectItem.orderNo,
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#fd4200",
      success: function (res) {
        if (res.confirm == true) {
          that.completeRequest(selectItem.id);
        }
      }
    })
  },
  completeRequest: function (id) {
    var that = this;
    util.kmRequest({
      url: setOrderStatusTo2Url,
      data: {
        orderId: id,
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: "保养成功",
          })
          that.ordersRequest();
        }else{
          wx.showToast({
            title: "操作失败",
            icon:"none"
          })
        }
      }
    })
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    // wx.navigateTo({
    //   url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    // });
  }

})

