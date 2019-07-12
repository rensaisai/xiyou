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
    date:'',
    time:'',
    tile:'',
    pays: [
      { value: 'wxpay', name: '微信', checked: 'true' }
    ],
    payType:'kmPay'
  },
  commitOrderUrl: function () {
    var payType = 0;//wxpay
    var urlPayType = 4;//3余额或车豆 4微信
    var payAmount = this.data.setmeal.priceMember;
    // var total = this.data.setmeal.priceMember
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
    if(this.data.date=='' || this.data.time == ''){
      wx.showToast({
        title: '选择日期时间',
        icon: "none"
      })
      if (this.data.date != '' && this.data.time == ''){
        wx.showToast({
          title: '选择保养时间',
          icon: "none"
        })
      }
      if (this.data.date == '' && this.data.time != ''){
        wx.showToast({
          title: '选择保养日期',
          icon: "none"
        })
      }
    } else if (this.data.date <= this.data.tile){
      wx.showModal({
        title: '预约时间应一天后',
       showCancel:false
      })
    } else if (this.data.date > this.data.tile){
      var therl = this.data.date
      var ther = this.data.time
      var array=""
      var arrler=""
      array = therl.split("-");
       var year = array[0];
      var month = array[1];
      var day = array[2];
      arrler = ther.split(":")
      var ye = arrler[0];
      var mon = arrler[1];
      var arr=(year+month+day+ye+mon+'00')
      console.log(arr)
      wx.navigateTo({
        url: '/pages/pay/payment/payment?paytype=' + urlPayType + "&orderdata=" + JSON.stringify(data)+"&time="+arr
      });
    }
  
    // if(this.data.date==this.data.tile){
    //   wx.showToast({
    //     title: '择保养日期不可以为当天',
    //     icon: "none"
    //   })
    // } else if(this.data.date > this.data.tile){
     
    // }
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
    console.log(entity)
    var setmeal = options.setmeal;
    console.log(setmeal)
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
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
})

