const config = require('../../config')
const getUserStatisticsUrl = config.getUserStatisticsUrl
const getRepairOpenId = config.getRepairOpenId
// const getUserInfoByOpenIdUrl = config.getUserInfoByOpenIdUrl
const getStaffInfoByOpenIdUrl = config.getStaffInfoByOpenIdUrl

var app = getApp()
console.log(app)
var util = require('../../utils/util')

Page({
  data: {
    headimg:'',
    nickname:'',
    membercount:0,
    commission:0,
    bean:0,
    list: [
      // {
      //   id:1,
      //   title: '我的订单',
      //   img:'/image/orders.png',
      //   url: '/pages/orders/my/list/myorderlist'
      // }, {
      //   id: 2,
      //   title: '我的银行卡',
      //   img: '/image/bankcard.png',
      //   url: '/pages/users/creditcards/list/creditcardlist'
      // }, {
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
        id: 7,
        title: '修改密码',
        img: '/image/password.png',
        url: '/pages/users/password/password'
        // url:'/pages/users/login/login'
      }, 
      {
        id: 6,
        title: '修理厂订单',
        img: '/image/orders2.png',
        url: '/pages/orders/repair/list/repairorderlist'
      },
      {
        id: 9,
        title: '查询配件',
        img: '/image/car.png',
        url: '/pages/users/searchparts/searchparts/partlist'
      },
      {
        id: 8,
        title: '车况检测(接车服务)',
        img: '/image/br.png',
        url: '/pages/infomation/addinfo/addinfo'
      },
       {
        id: 9,
        title: '查看技师',
        img: '/image/jishi.png',
         url: '/pages/technician/technician'
      }
    ]
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserStatisticsUrl,
      data: {
        userId:app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var statistics = JSON.parse(res.data.data)[0];
          that.setData({
            membercount: statistics.memberCount,
            commission: statistics.amount,
            bean: statistics.bean
          });
        }
      }
    })
  },
  getOpenId: function () {
    console.log(app.globalData.openid)
    var that = this;
    if (app.globalData.openid == null) {
      // 登录
      wx.login({
        success: function (loginCode) {
          console.log(loginCode)
          //调用request请求api转换登录凭证
          util.kmRequest({
            url: getRepairOpenId,
            data: {
              code: loginCode.code
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.status == 1) {
                app.globalData.openid = JSON.parse(res.data.data).openid;
              }
              that.userInfoRequest();
            }
          })
        }
      })
    }
  },
  userInfoRequest: function () {
    var that = this;
    util.kmRequest({
      url: getStaffInfoByOpenIdUrl,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data);
          // that.carInfoRequest();
          that.showUserInfo();
        }else{
          if (!util.checkUserInfo()) {
            return;
          }
        }
      }
    })
  },
  showUserInfo: function () {
    var headimg = '/image/logo.png';
    var nickname = '';
    if (app.globalData.userInfo != null) {
      headimg = app.globalData.userInfo.avatarUrl
      nickname = app.globalData.userInfo.nickName
    }
    if (app.globalData.kmUserInfo != null) {
      nickname = app.globalData.kmUserInfo.phone;      
    }
    this.setData({
      headimg: headimg,
      nickname: nickname
    });
  },
  onLoad: function (options) {
    console.log(44444444)
    this.getOpenId();
    this.newVersion();
    // if (app.globalData.openid != null){
    //   this.userInfoRequest()
    // }
  },
  newVersion: function () {
    console.log('canIUse---getUpdateManager---' + wx.canIUse('getUpdateManager'));
    if (wx.canIUse('getUpdateManager')) {
      var updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('有新版本吗：' + res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '有新版本了，马上更新？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        console.log('新的版本下载失败')
      })
    }
  },
  onShow:function(){
    var kmUserInfo = app.globalData.kmUserInfo;
    this.showUserInfo();
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
      title: '汽修直达号',
      desc: '正品配件，专业保养',
      path: '/pages/mine/mine'
    }
  },
})

