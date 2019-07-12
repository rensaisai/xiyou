const config = require('../../../../config')
const getUserOrdersUrl = config.getUserOrdersUrl
const cancelOrderUrl = config.cancelOrderUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [
    ], //0-提交，待支付，1-已支付待保养 2-保养完成待评价 3-评价完成待结算，4-已结算 5-已取消

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏

    keyword: '',
    hiddenNone: 'true'
  },
  ordersRequest: function (keywords) {
    var that = this;
    util.kmRequest({
      url: getUserOrdersUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            item.hiddenCancel = 'true';
            item.hiddenPay = 'true';
            item.hiddenItem = 'true';
            switch (item.status) {
              case 0://未支付
                item.hiddenCancel = '';
                item.hiddenPay = '';
                break;
              case 1://已支付待保养
                item.hiddenItem = '';
                break;
              case 2://已保养待评价
                item.hiddenItem = '';
                break;
              case 3://已评价待结算
                break;
              case 4://已结算
                break;
              case 5://已取消
                break;
            }
          }
          that.setData({
            list: list
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
  actionSheetTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.sortList,
      success: function (e) {
        that.setData({
          sortname: that.data.sortList[e.tapIndex],
          orderType:e.tapIndex
        });
        that.repairsRequest();
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.ordersRequest();
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
  onShow: function (options) {
    this.ordersRequest();
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/orders/my/evaluate/orderevaluate?entity=' + JSON.stringify(selectItem)
    });
  },
  payClick: function (event){
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    var urlPayType = 4;
    if (selectItem.payType == 0){
      urlPayType = 4;
    }
    var orderdata = { id: selectItem.orderId, price:selectItem.price};
    wx.navigateTo({
      url: '/pages/pay/payment/payment?payagain=1&paytype=' + urlPayType + "&orderdata=" + JSON.stringify(orderdata)
    });
  },
  cancelOrder: function (orderid) {
    var that = this;
    util.kmRequest({
      url: cancelOrderUrl,
      data: {
        orderId: orderid
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.ordersRequest();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  cancelClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定取消订单 " + selectItem.orderNo +" 吗?",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          that.cancelOrder(selectItem.orderId);
        }
      }
    })
  }
})
