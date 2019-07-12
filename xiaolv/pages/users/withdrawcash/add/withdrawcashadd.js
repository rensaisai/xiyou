const config = require('../../../../config')
const applyCashUrl = config.applyCashUrl
const getUserBanksUrl = config.getUserBanksUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list:[],
    bankno:'',
    busy:false,//是否正在请求网络，防止重复提交
    selectPerson: true,
    firstPerson: '请选择银行卡号',
    selectArea: false,
  },
  applyCashRequest:function(e){
    var that = this;
    if(this.data.busy == true){
      return;
    }
    var err = '';
    if (this.data.firstPerson == '请选择银行卡号'){
      err = '请选择银行卡号';
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
      data: {
        interfaceName: applyCashUrl,
        param:{
          bankNo: this.data.firstPerson,
          amount: e.detail.value.amount
        }
      },
      method:"post",
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
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  //点击切换
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
    })
  },
  onLoad: function (options) {
    // var secondId = options.id;
    this.banksRequest();
  },
  banksRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getUserBanksUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          // var bankno = '';
          if(list.length > 0){
            // bankno = list[0].bankNo;
          }else{
            wx.showModal({
              title: "提示",
              content: "您还未绑定银行卡，现在去绑定",
              showCancel: false,
              confirmText: "去绑定",
              confirmColor: "#fd4200",
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
          });
        }
      }
    })
  }
})

