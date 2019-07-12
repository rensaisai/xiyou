const config = require('../../../config.js')
const getUserStatisticsUrl = config.getUserStatisticsUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    entity: null,
    setmeal: null,
    commission: 0,
    bean: 0,
    date: '',
    time: '',
    tile: '',
    pays: [
      { value: 'kmpay_bean', name: '车豆', checked: 'true' }
    ],
    payType: 'kmPay'
  },
  commitOrderUrl: function () {
    console.log(this.data.bean)
    console.log(this.data.setmeal.price)
    // var payType = 0;//wxpay
    var urlPayType = 3;//3余额或车豆 4微信
    if (parseFloat(this.data.bean) == 0) {
      wx.showToast({
        title: '你没有车豆',
        icon: "none"
      })
      return
    }
    if (parseFloat(this.data.bean) <  parseFloat(this.data.setmeal.price)){
      wx.showToast({
        title: '车豆不足',
        icon: "none"
      })
      return
    }
    var data = {
      userId: app.globalData.kmUserInfo.id,
      price: this.data.setmeal.price,
      userCarId: app.globalData.carInfo.id,
      setmealId: this.data.setmeal.id,
      carwashId: this.data.entity.id,
      payType: 3, //0微信 1支付宝 2佣金 3车豆
      payAmount: this.data.setmeal.price
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
          console.log(statistics)
          // var pays = that.data.pays;
          // if (statistics.amount > 0) {
          //   pays.push({ value: 'kmpay', name: '余额' });
          // }
          // if (statistics.bean > 0) {
          //   pays.push({ value: 'kmpay_bean', name: '车豆' });
          // }
          that.setData({
            // commission: statistics.amount,
            bean: statistics.bean,
            // pays: pays
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var entity = options.entity;
    console.log(JSON.parse(entity))
    var setmeal = options.setmeal;
    console.log(JSON.parse(setmeal))
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
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var time = util.formatTime(new Date());
    // time.toLocaleDateString()
    console.log(time)
    // 再通过setData更改Page()里面的data，动态更新页面的数

    this.setData({
      tile: time
    });

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
  },


  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
})

