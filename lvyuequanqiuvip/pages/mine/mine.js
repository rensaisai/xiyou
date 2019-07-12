const config = require('../../config.js')
const getUserStatisticsByUserIdUrl = config.getUserStatisticsByUserIdUrl
var app = getApp()
console.log(app)
var util = require('../../utils/util')

Page({
  data: {
    headimg:'',
    nickname:'',
    membercount:0,
    commission:0,
    // bean:0,
    membername:'非会员',
    memberno:'',
    allsumle:0,
    sum: 0,
    amount: 0,
    balance: 0,
    allsum: 0,
    list: [
      {
        id:1,
        title: '我的订单',
        img:'/image/orders.png',
        url: '/pages/orders/my/list/myorderlist'
      },
      //  {
      //   id: 2,
      //   title: '卡券',
      //   img: '/image/bankcard.png',
      //   // url: '/pages/users/creditcards/list/creditcardlist'
      //    url: '/pages/card/card'
      // }, 
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
      {
        id: 5,
        title: '添加收货地址',
        img: '/image/shouhuo.png',
        url: '/pages/location/location'
        // url:'/pages/users/login/login'
      }, 
      // {
      //   id: 4,
      //   title: '手机号登录',
      //   img: '/image/qiehuan.png',
      //   url: '/pages/users/login/login'
      // }, 
      // {
      //   id: 2,
      //   title: '修改密码',
      //   img: '/image/password.png',
      //   url: '/pages/users/password/password'
      //   // url:'/pages/users/login/login'
      // }, 
  
      {
        id: 6,
        title: '银行卡信息',
        img: '/image/back.png',
        url: '/pages/addback/addback'
      },
     
      // {
      //   id: 8,
      //   title: '车辆检测',
      //   img: '/image/br.png',
      //   url: '/pages/infomation/addinfo/addinfo'
      // }
      
    ]
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserStatisticsByUserIdUrl,
      data: {
        userId:app.globalData.kmUserInfo.id,
        isVip: app.globalData.kmUserInfo.isVip
      },
      success: function (res) {
        if (res.data.status == 1) {
          var statistics = JSON.parse(res.data.data)[0];
          console.log(statistics)
          // 团队人数
          if (statistics != undefined){
          var sum = statistics.countTeam
          // 待入账
          var amount = statistics.norecord;
          // 余额
          var balance = statistics.balance;
          // 金币
          var allsum = statistics.coupon;
            that.setData({
              sum: sum,
              amount: amount,
              balance: balance,
              allsum: allsum
            });
          }
        }
      }
    })
  },
  showUserInfo: function () {
    var headimg = '/image/logo.png';
    var memname = '非会员';
    var memno = '';
    var nickname = '';
    if (app.globalData.userInfo != null) {
      headimg = app.globalData.userInfo.avatarUrl
      nickname = app.globalData.userInfo.nickName
    }
    if (app.globalData.kmUserInfo != null) {
      var phone = app.globalData.kmUserInfo.phone;
      if (phone != null && phone.length == 11) {
        var tempStr = phone.slice(3, 8);
        nickname = phone.replace(tempStr, "*****");
      }
      if (app.globalData.kmUserInfo.isVip == 0){
        memno = app.globalData.kmUserInfo.userNo
      }
      if (app.globalData.kmUserInfo.isVip == 2){
        memname = '商户';
        memno = app.globalData.kmUserInfo.tenantNo
      } else if (app.globalData.kmUserInfo.isVip == 1){
          memname = '会员';
          memno = app.globalData.kmUserInfo.userNo
      }
    }
    this.setData({
      headimg: headimg,
      nickname: nickname,
      membername: memname,
      memberno: memno
    });
  },
  imges:function(){
    if (!util.checkUserInfo()) {
      return;
    }
  },
  // commercial:function(){
  //   var list=this.data.list;
  //   if (app.globalData.kmUserInfo.userType == 0 && app.globalData.kmUserInfo !=null){
  //     list.push({
  //         id: 9,
  //         title: '搜索',
  //         img: '/image/sousuo.png',
  //         url: '/pages/users/search/search'
  //     })
  //   }
  //   this.setData({
  //     list:list
  //   })
  // },
  onShow: function () {
    var kmUserInfo = app.globalData.kmUserInfo;
    this.showUserInfo();
    if (app.globalData.kmUserInfo != null) {
      this.userStatisticsRequest();
    }
    var list = this.data.list;
    // var kmUserInfo = app.globalData.kmUserInfo
    // console.log(kmUserInfo)
    // console.log(kmUserInfo.userType)
    // console.log(list.length)
    if (kmUserInfo != null && kmUserInfo.isVip == 2) {
      if(list.length <= 2){
      list.push({
        id: 3,
        title: '我的二维码',
        img: '/image/ma.png',
        url: '/pages/users/yards/yards'
      })
      list.push({
        id: 4,
        title: '订单查询',
        img: '/image/sousuo.png',
        url: '/pages/users/search/search'
      })
      this.setData({
        list: list
      })
    }
    }
  },
  onLoad: function (options) {
    
  
  },
  
  membersClick:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/members/list/memberlist'
    });
  },
  bersClick:function (){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/members/berlist/berlist'
    });
  },
  // amountClick: function () {
  //   if (!util.checkUserInfo()) {
  //     return;
  //   }
  //   wx.navigateTo({
  //     url: '/pages/users/commissions/list/commissionslist'
  //   });
  // },
  amount: function () {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/commiss/commiss'
    });
  },
  account:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/account/account'
    });
  },
  balance:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/balance/balance'
    });
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    console.log(selectItem)
    if (selectItem.id  == 4){
      wx.navigateTo({
        url: selectItem.url
      });
    }else{
      if (!util.checkUserInfo()) {
        return;
      }
      wx.navigateTo({
        url: selectItem.url
      });
    } 
  },
  onShareAppMessage: function () {
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)){
      tenantId = app.globalData.kmUserInfo.tenantId;
      tenantNo = app.globalData.kmUserInfo.userNo;
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  },
})

