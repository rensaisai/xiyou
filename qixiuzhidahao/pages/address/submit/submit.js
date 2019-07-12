const config = require('../../../config')
const saveUserCarUrl = config.saveUserCarUrl
const updateUserCarUrl = config.updateUserCarUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    carName: '',
    date: '',
    logo: '',
    maxDate: '',
    carInfo: null,
    carno: '',
    km: '',
    changeFct: false,
    hiddenChangeCar: 'true',
    sid:null
  },
  saveUserCarRequest: function (e) {
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
      userId: this.data.sid,
      carNo: e.detail.value.carno.toUpperCase(),
      km: e.detail.value.km,
      startDate: this.data.date

    };
    if (this.data.carInfo == null) {
      data.fctId = app.globalData.fctInfo.id;
      data.brId = app.globalData.brInfo.id;
      data.yearId = app.globalData.yearInfo.id;
      url = saveUserCarUrl;
    } else {
      if (this.data.changeFct && app.globalData.yearInfo != null) {
        data.fctId = app.globalData.fctInfo.id;
        data.brId = app.globalData.brInfo.id;
        data.yearId = app.globalData.yearInfo.id;
      } else {
        data.fctId = this.data.carInfo.fctId;
        data.brId = this.data.carInfo.brId;
        data.yearId = this.data.carInfo.yearId;
      }
      url = updateUserCarUrl;
      data.userCarId = this.data.carInfo.id;
    }
    util.kmRequest({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          if (JSON.parse(res.data.data)[0].isUse == 1) {
            app.globalData.carInfo = JSON.parse(res.data.data)[0];
          }
          if (that.data.carInfo == null) {
            wx.navigateBack({
              delta: 4
            })
          } else {
            wx.navigateBack({
              delta: 1
            })
          }
          wx.showToast({
            title: "保存成功",
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  selectMyCar: function () {
    this.setData({
      changeFct: true
    });
    wx.navigateTo({
      url: '/pages/cars/carselect/fct/fctlist'
    });
  },
  onLoad: function (options) {
    var carInfoStr = options.carInfo;
    var sid = options.userId;
    console.log(sid)
    this.setData({
      sid:sid
    })
    if (carInfoStr != null) {
      var carInfo = JSON.parse(carInfoStr);
      this.setData({
        carInfo: carInfo,
        date: carInfo.startDate,
        logo: carInfo.img,
        carno: carInfo.carNo,
        km: carInfo.km
      });
    } else {
      this.setData({
        date: util.getNowFormatDate(false)
      })
    }
    this.setData({
      maxDate: util.getNowFormatDate(false)
    })
    if (options.canChangeCar == 'true') {
      this.setData({
        hiddenChangeCar: ''
      });
    }
  },
  onShow: function () {
    var carName = '';
    var carLogo = '';
    if (this.data.carInfo == null || (this.data.changeFct && app.globalData.yearInfo != null)) {
      carName = app.globalData.fctInfo.fctName + app.globalData.brInfo.brName + "(" + app.globalData.yearInfo.year + ")" + app.globalData.yearInfo.cc;
      carLogo = app.globalData.fctInfo.img;
    } else {
      carName = this.data.carInfo.fctName + this.data.carInfo.brName + "(" + this.data.carInfo.year + ")" + this.data.carInfo.cc;
      carLogo = this.data.carInfo.fctImg;
    }
    this.setData({
      carName: carName,
      logo: carLogo
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

