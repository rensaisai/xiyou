// const getUserByUserIdAndLevelUrl = require('../../../../config').getUserByUserIdAndLevelUrl
// const queryUserStatusUrl = require('../../../../config.js').queryUserStatusUrl
// const deliveryUrl = require('../../../../config.js').deliveryUrl
const getUsersByTenantIdUrl = require('../../../../config.js').getUsersByTenantIdUrl
var app = getApp()
console.log(app)
var util = require('../../../../utils/util')

Page({
  data: {
    listl:null,
    tenantId:'',
    active:false,
    // host:false,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏
    hiddenNone: 'true' ,
  },
  dataRequest:function(){
    var that = this;
    util.kmRequest({
      url: getUsersByTenantIdUrl,
      data: {
        tenantId: app.globalData.kmUserInfo.tenantId,
        // userType: app.globalData.kmUserInfo.userType
      },
     
      success: function (res) {
        // console.log(res.data);
        if (res.data.status == 1) {
            // console.log(JSON.parse(res.data.data)),
          var list = JSON.parse(res.data.data)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            var phone = list[i].phone;
            var tempstr = phone.slice(3, 7);
            var nick = phone.replace(tempstr, "****")
            list[i].phone = nick
          }
        //   that.setData({
        //     list: JSON.parse(res.data.data)
        //   });
        //   that.showNone();
        }
        // console.log(list)
        // var listl=[]
        // for(var i=0; i<list.length; i++){
         
        //   if(listl.active==undefined){
        //     that.setData({
        //       active:true
        //     })
        //   }
        //   // 价格
        //     var orderamount=list[i][2];
        //     // ID
        //     var order_id=list[i][3];
        //     // 订单号
        //     var order_no=list[i][4];
        //     // 下单时间
        //     var order_time=list[i][5];
        //     // 支付时间
        //     var pay_time=list[i][6];
        //     // 邮寄地址
        //     var remarks=list[i][7];
        //     // 会员地址
        //     var address=list[i][8];
        //     // 会员优惠券数量
        //     var coupon=list[i][9];
        //     // 会员电话
        //     var phone=list[i][10];
        //     // 会员名称
        //     var user_name=list[i][11];
        //     // 会员头像
        //     var head_img=list[i][12]
        //      if(list[i][0] == 0){
        //       var order_status = '未支付'
        //      } else if (list[i][0] == 1){
        //        var order_status = '已支付待发货'
        //        var active=1
        //      } else if (list[i][0] == 3){
        //       var order_status = '已支付待收货'
        //      }
        //      if(list[i][1] == 1){
        //        var buy_type = '快递'
        //      } else if (list[i][1] == 2){
        //       var buy_type = '自取'
        //      }  
        //   listl.push({ order_status, buy_type, orderamount, order_id, order_no, order_time, pay_time, remarks, address, coupon, phone, user_name, head_img,active})  
        // }
        // console.log(listl)
        // if(listl.buty_typr="自取"){
        //      host:false
        // } else (listl.buty_typr = "快递"){
        //   host:true
        // }
        that.setData({
         list:list,
        })
        that.showNone();
      },
      complete: function (res) {
        that.showNone();
      }
    })
  },
  showNone:function(){
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
  // default:function(ever){
  //   var thit=this
  //   console.log(app.globalData.kmUserInfo.tenantId)
  //   console.log(ever.currentTarget.dataset.id)
  //   util.kmRequest({
  //     url: deliveryUrl,
  //     data: {
  //       tenantId: app.globalData.kmUserInfo.tenantId,
  //       orderId: ever.currentTarget.dataset.id
  //     },
  //     success: function (res){
  //       console.log(res.data)
  //       if(res.data.status==1){
  //         thit.setData({
  //           active: true,  
  //         })
  //         thit.dataRequest()
  //         wx.showModal({
  //           title: '已发货',
  //           showCancel: false
  //         })
  //       }else if(res.data.status==0){
  //         wx.showModal({
  //           title: '商品数量不足请尽快联系总部...',
  //           showCancel: false
  //         })
  //       }else if(res.data.msg==6){
  //         wx.showModal({
  //           title: '网络状态不良',
  //           showCancel: false
  //         })
  //       }
  //       }
  //   })
  // },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    wx.showNavigationBarLoading()
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
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
    // var secondId = options.id;
    // this.setData({
    //   tenantId:app.globalData.kmUserInfo.tenantId
    // })
  },
  onShow:function(){
    console.log(6666666666)
    this.dataRequest();
  }
  // selectOver: function (event) {
  //   var selectItem = this.data.listl[event.currentTarget.dataset.index];
  //   app.globalData.fctInfo = selectItem;
  //   // wx.navigateTo({
  //   //   url: '/pages/address/city/citylist?id=' + selectItem.areaLevel
  //   // });
  // }
})

