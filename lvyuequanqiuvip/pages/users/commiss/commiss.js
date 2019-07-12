const config = require('../../../config')
// const getCouponFlowByUserIdUrl = config.getCouponFlowByUserIdUrl
// const getTenantAmountFlowByTenantIdUrl = config.getTenantAmountFlowByTenantIdUrl
// const getVipUserCouponDetailUrl = config.getVipUserCouponDetailUrl
const getUserCouponDetail1Url = config.getUserCouponDetail1Url
var app = getApp()
console.log(app);
var util = require('../../../utils/util')

Page({
  data: {
    list: [
    ],
    listl: [],
    active: true,
    orderType: 1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 15,      //返回数据的个数
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    hiddenNone: 'true'
  },
  // amountRequest: function () {
  //   // console.log(app.globalData.kmUserInfo.userType)
  //   if (app.globalData.kmUserInfo.userType == 0) {
  //     var that = this
  //     util.kmRequest({
  //       url: getTenantAmountFlowByTenantIdUrl,
  //       data: {
  //         tenantId: app.globalData.kmUserInfo.tenantId
  //       },
  //       success: function (res) {
  //         var listl = JSON.parse(res.data.data)
  //         for (var i = 0; i < listl.length; i++) {
  //           var item = listl[i];
  //           var title = ''
  //           switch (item.flowType) {
  //             case 0: title = '资格订单';
  //               break;
  //           }
  //           item.flowType = title;
  //         }
  //         that.setData({
  //           listl: listl,
  //           active: true
  //         })
  //       }
  //     })
  //   } else if (app.globalData.kmUserInfo.userType == 1) {
  //     var that = this
  //     util.kmRequest({
  //       url: getCouponFlowByUserIdUrl,
  //       data: {
  //         userId: app.globalData.kmUserInfo.id
  //       },
  //       success: function (res) {
  //         if (res.data.status == 1) {
  //           var list = JSON.parse(res.data.data);
  //           for (var i = 0; i < list.length; i++) {
  //             var item = list[i];
  //             var title = '';
  //             switch (item.flowType) {
  //               case 0: title = '推荐获得';
  //                 break;
  //               case 1: title = '消费';
  //                 break;
  //             }
  //             item.title = title;
  //           }
  //           that.setData({
  //             list: list,
  //             active: false
  //           })
  //           that.showNone();
  //         }
  //       },
  //       complete: function (res) {
  //         that.showNone();
  //       }
  //     })
  //   }
  // },


  amountRequest: function () {
    var that = this;
    util.kmRequest({
      // url: getCouponFlowByUserIdUrl,
      url: getUserCouponDetail1Url,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            var title = '';
            switch(item.flowType){
              case 1: title = '消费';
                break;
              case 2: title = '商品差价';
                break;
              case 3: title = '消费者利润';
                break;
              case 4: title = '推荐人利润';
                break;
              case 5: title = '店主利润';
                break;
              case 6: title = '店主一代利润';
                break;
              case 7: title = '店主二代利润';
                break;
              case 8: title = '店主三代利润';
                break;
              case 9: title = '经理利润';
                break;
              case 10: title = '合伙人利润';
                break;
              case 11: title = '高级合伙人利润';
                break;
              case 12: title = '资深合伙人利润';
                break;
              case 13: title = '一代育成利润';
                break;
              case 14: title = '二代育成利润';
                break;
              case 15: title = '分公司利润';
                break;
              case 16: title = '城市负责人利润';
                break;
            }
            item.title = title;
          }
          that.setData({
            list: list
          })
          that.showNone();
        }
      },
      complete: function (res) {
        that.showNone();
      }
    })
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    // this.amountRequest();
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
      this.setData({
        isHideLoadMore: true,
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

