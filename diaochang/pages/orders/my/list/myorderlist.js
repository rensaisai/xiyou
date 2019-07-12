const config = require('../../../../config')
const getFishInfoByUserIdUrl = config.getFishInfoByUserIdUrl
const delFishInfoByIdUrl = config.delFishInfoByIdUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [], //0-提交，待支付，1-已支付待保养 2-保养完成待评价 3-评价完成待结算，4-已结算 5-已取消

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏

    keyword: '',
    listPage: 0,
    hiddenNone: 'true'
  },
  ordersRequest: function (keywords) {
    var that = this;
    util.kmRequest({
      url: getFishInfoByUserIdUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        page: this.data.listPage
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = new Array(0);
          if (res.data.data.length > 0) {
            list = JSON.parse(res.data.data);
            that.setData({
              listPage: that.data.listPage + 1
            });
            that.setData({
              list: that.data.list.concat(list)
            });
          }
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
    this.setData({
      list: []
    });
    this.data.listPage = 0;
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
    this.ordersRequest();
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
      url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    });
  },
  payClick: function (event){
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/infomation/addinfo/addinfo?entity=' + JSON.stringify(selectItem)
    });
  },
  deleteOrder: function (id) {
    var that = this;
    util.kmRequest({
      url: delFishInfoByIdUrl,
      data: {
        id: id
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
  deleteClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定删除活动 " + selectItem.fishName +" 吗?",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          that.deleteOrder(selectItem.id);
        }
      }
    })
  }
})
