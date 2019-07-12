const config = require('../../config')
const getByUserIdUrl = config.getByUserIdUrl

var app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    headimg:'',
    nickname:'',
    phone:'',
    membercount:0,
    commission:0,
    bean:0,
    list: [
      {
        id:1,
        title: '我发布的活动',
        img:'/image/orders.png',
        url: '/pages/orders/my/list/myorderlist'
      }, {
        id: 2,
        title: '发布活动',
        img: '/image/bankcard.png',
        url: '/pages/infomation/addinfo/addinfo'
      },
      // {
      //   id: 3,
      //   title: '充值',
      //   img: '/image/recharge.png',
      //   url: '/pages/users/recharge/list/rechargelist'
      // }, {
      //   id: 4,
      //   title: '提现',
      //   img: '/image/takemoney.png',
      //   url: '/pages/users/withdrawcash/list/withdrawcashlist'
      // }, 
      // {
      //   id: 7,
      //   title: '修改密码',
      //   img: '/image/password.png',
      //   url: '/pages/users/password/password'
      // }, 
      // {
      //   id: 8,
      //   title: '保养顾问',
      //   img: '/image/adviser.png',
      //   url: '/pages/users/adviser/adviser'
      // },
      // {
      //   id: 9,
      //   title: '我的车辆',
      //   img: '/image/br.png',
      //   url: '/pages/cars/mycar/carlist/carlist'
      // }
    ]
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getByUserIdUrl,
      data: {
        userId:app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          // var statistics = JSON.parse(res.data.data)[0];
          // that.setData({
          //   membercount: statistics.memberCount,
          //   commission: statistics.amount,
          //   bean: statistics.bean
          // });
        }
      }
    })
  },
  onLoad:function (options){

  },
  onShow:function(){
    var kmUserInfo = app.globalData.kmUserInfo;
    if (kmUserInfo != null){
      this.userStatisticsRequest();
      var list = this.data.list;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.id == 5 || item.id == 6){
          list.splice(i--, 1);
        }
      }
      var phone = '';
      if (kmUserInfo.phone != null && kmUserInfo.phone.length == 11) {
        var tempStr = kmUserInfo.phone.slice(3, 8);
        phone = kmUserInfo.phone.replace(tempStr, "*****");
      }
      if (kmUserInfo.memberType == 2){//配件店
        // list.push({
        //   id: 5,
        //   title: '配件店订单',
        //   img: '/image/orders2.png',
        //   url: '/pages/orders/autoshop/list/autoshoporderlist'
        // });
      } else if (kmUserInfo.memberType == 1){//修理厂
        // list.push({
        //   id: 6,
        //   title: '修理厂订单',
        //   img: '/image/orders2.png',
        //   url: '/pages/orders/repair/list/repairorderlist'
        // });
      }
      this.setData({
        list: list,
        phone: phone
      });
    }
    this.refreshUserInfo();
  },
  refreshUserInfo: function(){
    var user = app.globalData.userInfo;
    if (user != null) {
      var headimg = '/image/logo.png';
      if (user.avatarUrl != null && user.avatarUrl.length > 0) {
        headimg = user.avatarUrl;
      }
      var nickname = user.nickName      
      this.setData({
        headimg: headimg,
        nickname: nickname
      });
    }
  },
  membersClick:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/members/list/memberlist'
    });
  },
  amountClick: function () {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/commissions/list/commissionslist'
    });
  },
  itemClick: function (event) {
    if (!util.checkUserInfo()){
      return;
    }
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: selectItem.url
    });
  },
  onShareAppMessage: function () {
    return {
      title: '钓场天下',
      desc: '',
      path: '/pages/index/index'
    }
  }
})

