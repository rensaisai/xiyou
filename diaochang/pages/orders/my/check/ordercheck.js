const config = require('../../../../config')
const getUserStatisticsUrl = config.getUserStatisticsUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    entity: null,
    setmeal: null,
    commission: 0,
    bean: 0,
    pays: [
      { value: 'wxpay', name: '微信', checked: 'true' }
    ],
    payType:'kmPay'
  },
  commitOrderUrl: function () {
    var payType = 0;//wxpay
    var urlPayType = 4;//3余额或车豆 4微信
    var payAmount = this.data.setmeal.priceMember;
    if (this.data.payType == 'kmpay'){
      payType = 2;
      urlPayType = 3;
      var value = parseFloat(this.data.setmeal.priceMember) - parseFloat(this.data.commission);
      if (value > 0){
        payAmount = this.data.commission;
      }
    } else if (this.data.payType == 'kmpay_bean') {
      payType = 3;
      urlPayType = 3;
      var value = parseFloat(this.data.setmeal.priceMember) - parseFloat(this.data.bean);
      if (value > 0) {
        payAmount = this.data.bean;
      }
    }
    var data = {
      userId: app.globalData.kmUserInfo.id,
      price: this.data.setmeal.priceMember,
      userCarId: app.globalData.carInfo.id,
      setmealId: this.data.setmeal.id,
      repairId: this.data.entity.id,
      payType: payType, //0微信 1支付宝 2佣金 3车豆
      payAmount: payAmount
    }
    wx.navigateTo({
      url: '/pages/pay/payment/payment?paytype=' + urlPayType + "&orderdata=" + JSON.stringify(data)
    });
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserStatisticsUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var statistics = JSON.parse(res.data.data)[0];
          var pays = that.data.pays;
          if (statistics.amount > 0){
            pays.push({ value: 'kmpay', name: '余额' });
          }
          if (statistics.bean > 0) {
            pays.push({ value: 'kmpay_bean', name: '车豆' });
          }
          that.setData({
            commission: statistics.amount,
            bean: statistics.bean,
            pays:pays
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var entity = options.entity;
    var setmeal = options.setmeal;
    if (entity != null) {
      this.setData({
        entity: JSON.parse(entity)
      });
    };
    if (setmeal != null) {
      this.setData({
        setmeal: JSON.parse(setmeal)
      });
    };
    this.userStatisticsRequest();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  radioChange: function (e) {
    var pays = this.data.pays;
    for (var i = 0, len = pays.length; i < len; ++i) {
      pays[i].checked = pays[i].value == e.detail.value
    }
    this.setData({
      pays: pays,
      payType: e.detail.value
    });
  }
})

