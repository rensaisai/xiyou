const config = require('../../../config')
const saveUserCarUrl = config.saveUserCarUrl
const updateUserCarUrl = config.updateUserCarUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    carName: '',
    date: '',
    logo:'',
    maxDate: ''
  },
  saveUserCarRequest:function(e){
    var that = this;

    var err = '';
    if (e.detail.value.carno.length == 0) {
      err = '请输入车牌号码';
    } else if (!util.checkCarNo(e.detail.value.carno)) {
      err = '车牌号码格式错误';
    } else if (e.detail.value.km.length == 0) {
      err = '请输入行驶里程';
    } else if (e.detail.value.km == 0) {
      err = '行驶里程必须大于0';
    } else if (this.data.date.length == 0) {
      err = '请输入上路时间';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }

    var url = '';
    var data = {
      userId: app.globalData.kmUserInfo.id,
      fctId: app.globalData.fctInfo.id,
      brId: app.globalData.brInfo.id,
      yearId: app.globalData.yearInfo.id,
      carNo: e.detail.value.carno.toUpperCase(),
      km: e.detail.value.km,
      startDate: this.data.date
    };
    if(app.globalData.carInfo == null){
      url = saveUserCarUrl;
    }else{
      url = updateUserCarUrl;
      data.userCarId = app.globalData.carInfo.id;
    }
    util.kmRequest({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.carInfo = JSON.parse(res.data.data)[0];
          wx.showToast({
            title: "保存成功",
          })
          wx.switchTab({
            url: '/pages/index/index'
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  onLoad: function (options) {
    // var secondId = options.id;
    this.setData({
      carName: app.globalData.fctInfo.fctName + app.globalData.brInfo.brName + "(" + app.globalData.yearInfo.year + ")" + app.globalData.yearInfo.cc,
      logo: app.globalData.fctInfo.img,
      date: util.getNowFormatDate(false),
      maxDate: util.getNowFormatDate(false)
    })    
  },
  binderrorimg: function (e) {
    var img = "/image/car.png";
    this.setData({
      logo: img
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
})

