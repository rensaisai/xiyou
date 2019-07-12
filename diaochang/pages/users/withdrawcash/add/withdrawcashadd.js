const config = require('../../../../config')
const applyCashUrl = config.applyCashUrl
const getUserBanksUrl = config.getUserBanksUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list:[],
    bankno:'',
    busy:false//是否正在请求网络，防止重复提交
  },
  applyCashRequest:function(e){
    var that = this;
    if(this.data.busy == true){
      return;
    }
    var err = '';
    if (e.detail.value.bankno.length == 0){
      err = '请输入银行卡';
    } else if (e.detail.value.amount.length == 0) {
      err = '请输入金额';
    }
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }
    this.setData({
      busy:true
    });
    util.kmRequest({
      url: applyCashUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        bankNo: e.detail.value.bankno,
        amount: e.detail.value.amount
      },
      success: function (res) {
        that.setData({
          busy: false
        });
        if(res.data.status == 1){
          wx.showToast({
            title: "申请成功",
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
    this.banksRequest();
  },
  banksRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      url: getUserBanksUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          var bankno = '';
          if(list.length > 0){
            bankno = list[0].bankNo;
          }else{
            wx.showModal({
              title: "提示",
              content: "您还未绑定银行卡，现在去绑定",
              showCancel: false,
              confirmText: "去绑定",
              confirmColor: "#1296db",
              success: function (res) {
                if (res.confirm == true) {
                  wx.redirectTo({
                    url: '/pages/users/creditcards/add/creditcardadd'
                  });
                }
              }
            })
          }
          that.setData({
            list: list,
            bankno: bankno
          });
        }
      }
    })
  }
})

