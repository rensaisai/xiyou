const config = require('../../../../config')
// const getUserOrdersUrl = config.getUserOrdersUrl
const cancelOrderUrl = config.cancelOrderUrl
const receivedUrl = config.receivedUrl
const queryOrderByUserIdUrl = config.queryOrderByUserIdUrl
const getMailingAddressUrl = config.getMailingAddressUrl
var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [], //0-提交，待支付，1-已支付待保养 2-保养完成待评价 3-评价完成待结算，4-已结算 5-已取消
    // list1:[],
    // list2:[],
    // list3:[],
    hot:false,
    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    currentData: 0,
    keyword: '',
    hiddenNone: 'true',
    hiddenNones:true,
    page:0,
    pageCount: '', 
  },
  information:function(e){
    console.log(e)
    var list = this.data.list
    // var list1=this.data.list1
    // var list2 = this.data.list2
    // var list3 = this.data.list3
    var id = e.currentTarget.dataset.id
    console.log(id)
    var expressNo = e.currentTarget.dataset.expressno
    console.log(expressNo)
   
    for(var i=0; i<list.length; i++){
      if(list[i].id==id){
        console.log(list[i].id)
        list[i].activ=true
        list[i].acti=false
        list[i].active=false
      }
    }
    this.setData({
      list: list,
    })
    util.kmRequest({
      url: getMailingAddressUrl,
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var site = JSON.parse(res.data.data)[0]
          var arp = site.province + site.city + site.town + site.detailAddress
          console.log(arp)
        }
        wx.navigateTo({
          url: '/pages/logistics/logistics?expressNo=' + expressNo + '&arp=' + arp,
        })
      }
    })
    // for (var i = 0; i < list1.length; i++) {
    //   if (list1[i].id == id) {
    //     console.log(list[i].id)
    //     list1[i].activ = true
    //     list1[i].acti = false
    //     list1[i].active = false
    //   }
    //   console.log(list1)
    // }
    // for (var i = 0; i < list2.length; i++) {
    //   if (list2[i].id == id) {
    //     console.log(list[i].id)
    //     list2[i].activ = true
    //     list2[i].acti = false
    //     list2[i].active = false
    //   }
    //   console.log(list1)
    // }
    // for (var i = 0; i < list3.length; i++) {
    //   if (list3[i].id == id) {
    //     console.log(list[i].id)
    //     list3[i].activ = true
    //     list3[i].acti = false
    //     list3[i].active = false
    //   }
    //   console.log(list1)
    // }
    
    
   
  },
  retreat:function(e){
    var list = this.data.list
    // var list1 = this.data.list1
    // var list2 = this.data.list2
    // var list3 = this.data.list3
    var id = e.currentTarget.dataset.id
    console.log(id)
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        console.log(list[i].id)
        list[i].activ = false
        list[i].acti = true
        list[i].active = false
      }
    }
    console.log(list)
    // for (var i = 0; i < list1.length; i++) {
    //   if (list1[i].id == id) {
    //     console.log(list[i].id)
    //     list1[i].activ = false
    //     list1[i].acti = true
    //     list1[i].active = false
    //   }
    //   console.log(list)
    // }
    // for (var i = 0; i < list2.length; i++) {
    //   if (list2[i].id == id) {
    //     console.log(list[i].id)
    //     list2[i].activ = false
    //     list2[i].acti = true
    //     list2[i].active = false
    //   }
    //   console.log(list)
    // }
    // for (var i = 0; i < list3.length; i++) {
    //   if (list3[i].id == id) {
    //     console.log(list[i].id)
    //     list3[i].activ = false
    //     list3[i].acti = true
    //     list3[i].active = false
    //   }
    //   console.log(list)
    // }
    this.setData({
      list: list,
      // list1:list1,
      // list2:list2,
      // list3:list3
    })
  },
  payment: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var cashAmount = e.currentTarget.dataset.price
    var coupon = e.currentTarget.dataset.coupon
    console.log(coupon)
    var list = this.data.list
    // var list1= this.data.list1
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        console.log(list[i].id)
        list[i].activ = false
        list[i].acti = false
        list[i].active = true
      }
      console.log(list)
    }
    this.setData({
      list: list,
    })
    wx.navigateTo({
      url: '/pages/pay/payment/payment?id=' + id + '&cashAmount=' + cashAmount + '&coupon=' + coupon + '&install='+1,
    })
  },
  deliver: function (e) {
    console.log(1234)
    var id = e.currentTarget.dataset.id
    var list = this.data.list
    // var list2 = this.data.list2
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        console.log(list[i].id)
        list[i].activ = false
        list[i].acti = false
        list[i].active = true
      }
      console.log(list)
    }
    this.setData({
      list: list,
    })
  },
  take: function (e) {
    var that = this
    util.kmRequest({
      url: receivedUrl,
      data: {
        orderId: e.currentTarget.dataset.id
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.status == 1) {
          wx.showToast({
            title: '收货成功',
          })
          that.setData({
            page:0
          })
          that.ordersRequest()
        }
      }
    })
    var id = e.currentTarget.dataset.id
    var list = that.data.list
    // var list3 = that.data.list3
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        console.log(list[i].id)
        list[i].activ = false
        list[i].acti = false
        list[i].active = true
        list[i].activer = false
      }
    }
    var list = that.data.list
    this.setData({
      list: list,
    })  
  },
  off:function(e){
    var that = this
    var id = e.currentTarget.dataset.id
    console.log(id)
    var list = that.data.list
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        console.log(list[i].id)
        list[i].activ = false
        list[i].acti = false
        list[i].active = true
      }
    }
    that.setData({
      list:list
    })
  },
  ordersRequest: function (keywords) {
    var that = this;
    console.log(that.data.page)
    if (that.data.currentData == 0){
     var  orderStatus= ''
    }
    if (that.data.currentData == 1){
      var orderStatus = 0
    }
    if (that.data.currentData == 2) {
      var orderStatus = 1
    }
    if (that.data.currentData == 3) {
      var orderStatus = 3
    }
    util.kmRequest({
      url: queryOrderByUserIdUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        orderStatus: orderStatus,        
        orderSource:'wx',
        page:that.data.page
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(res.data.data)
          var list = JSON.parse(res.data.data);
          console.log(list)
          if (list.length == 0){
            var pageCount=''
          }else{
            var pageCount = list[0].pageCount
          }
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            var goodslist=item.goodsConfigName
            console.log(goodslist.length)
            var m = goodslist.split(",")
            var color=m[0]
            var sxit = m[1]
             item.color=color
             item.sxit=sxit
             item.logistics='物流信息'
             item.sales = '退换货'
            item.payment='待付款'
            item.deliver='待发货'
            item.take='确认收货'
            item.activ=false
            item.acti=false
            item.active=true
            item.activer=true
          }
          that.setData({
            list: list,
            pageCount: pageCount
          });
        }else if(res.data.status == 6){
          that.setData({
            list: [],
          });
        }
        that.showNone();
      },
      complete: function (res) {
        that.showNone();
      }
    })
  },
  ordersRequests: function (keywords) {
    var that = this
    if (that.data.currentData == 0) {
      var orderStatus = ''
    }
    if (that.data.currentData == 1) {
      var orderStatus = 0
    }
    if (that.data.currentData == 2) {
      var orderStatus = 1
    }
    if (that.data.currentData == 3) {
      var orderStatus = 3
    }
    util.kmRequest({
      url: queryOrderByUserIdUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        orderStatus: orderStatus,
        orderSource: 'wx',
        page: that.data.page
      },
      success: function (res) {
        var lists = that.data.list
        console.log(lists)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          var arrey = lists.concat(list)
          console.log(arrey)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            // item.hiddenCancel = 'true';
            // item.hiddenPay = 'true';
            // item.hiddenItem = 'true';
            var goodslist = item.goodsConfigName
            console.log(goodslist)
            var m = goodslist.split(",")
            var color = m[0]
            var sxit = m[1]
            item.color = color
            item.sxit = sxit
            item.logistics = '物流信息'
            item.sales = '退换货'
            item.payment = '待付款'
            item.deliver = '待发货'
            item.take = '确认收货'
            item.activ = false
            item.acti = false
            item.active = true
            item.activer = true
          }
          that.setData({
            list: arrey,
          });
        }
        that.showNone();
      },
      complete: function (res) {
        that.showNone();
      }
    })
  },
  checkCurrent: function (e) {
    console.log(e)
    var that = this;
    var goodstypeid = e.currentTarget.dataset.id
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        page:0
      })
      that.ordersRequest()
    }
  },
  checkCurrent1: function (e) {
    console.log(e)
    var that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        page: 0
      })
      that.ordersRequest()
    
        }
  },
  checkCurrent2: function (e) {
    var that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        page: 0
      })
      that.ordersRequest()
      
    }
  },
  checkCurrent3: function (e) {
    var that = this;
    var goodstypeid = e.currentTarget.dataset.id
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current,
        page: 0
      })
      that.ordersRequest()
     
    }
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
    // this.ordersRequest();
    wx.showNavigationBarLoading();

    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },
  //加载更多
  onReachBottom: function () {
   
    this.data.page = this.data.page +1
    console.log(this.data.page )
    console.log(this.data.pageCount)
    
    if (this.data.pageCount > this.data.page){
      console.log(88888888)
      this.ordersRequests()
      this.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        this.setData({
          isHideLoadMore: true,
          page: this.data.page
        })
      }, 500)
    }else{
      this.setData({
        hiddenNones: false,
      });
      setTimeout(() => {
        this.setData({
          hiddenNones: true,
          page: this.data.pageCount
        })
      }, 500)
    }
  },
  onShow: function () {
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
