const config = require('../../../../config')
const saveBankInfoUrl = config.saveBankInfoUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    
  },
  saveBankRequest:function(e){
    var that = this;

    var err = '';
    if (e.detail.value.cardno.length == 0){
      err = '请输入银行卡号';
    } else if (!util.checkBankNo(e.detail.value.cardno)) {
      err = '银行卡号格式错误';
    } else if (e.detail.value.username.length == 0) {
      err = '请输入持卡人姓名';
    } else if (e.detail.value.bankName.length == 0) {
      err = '请输入开户行名称';
    }
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }

    util.kmRequest({
      url: saveBankInfoUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        bankNo: e.detail.value.cardno,
        userName: e.detail.value.username,
        bankName: e.detail.value.bankName,
      },
      success: function (res) {
        if(res.data.status == 1){
          wx.showToast({
            title: "绑定成功",
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
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
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    getApp().globalData.fctInfo = selectItem;
    wx.navigateTo({
      url: '/pages/cars/carsselect/br/list?fctid=' + selectItem.id
    });
  },
  register: function () {
    wx.redirectTo({//关闭当前页跳转
      url: '/pages/users/register/register'
    });
  }
})

