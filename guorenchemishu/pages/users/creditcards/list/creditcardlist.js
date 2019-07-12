const config = require('../../../../config')
const getUserBanksUrl = config.getUserBanksUrl
const deleteUserBankUrl = config.deleteUserBankUrl
var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [
    ],
    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    hiddenNone: 'true',
    hiddenAddButton:'true'
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
          var list = JSON.parse(res.data.data)
          console.log(list)  
          for(var i=0; i<list.length; i++){
            var name = list[i].bankName
            var cardname = name.indexOf('银行')
            console.log(cardname)
            var arr = list[i].bankNo
            var bankNo = arr.slice(0,15)
            var card = arr.replace(bankNo,'**** **** **** **** ')
            list[i].card = card
          }          
          that.setData({
            list: list,
          });
          if (that.data.list == null || that.data.list.length == 0) {
            that.setData({
              hiddenNone: '',
              hiddenAddButton:''
            })
          } else {
            that.setData({
              hiddenNone: 'true',
              hiddenAddButton:'true'
            })
          }
        }
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.banksRequest();
    wx.showNavigationBarLoading();

    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },
  //加载更多
  onReachBottom: function () {
    this.setData({
      isHideLoadMore: false,
    });
    setTimeout(() => {
      var list = this.data.list;
      this.setData({
        isHideLoadMore: true,
        list:list
      })
    }, 1000)
  },
  onLoad: function (options) {
    // var keywords = options.keywords;
  },
  onShow:function(){
    this.banksRequest();
  },
  deleteClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定解绑 " + selectItem.bankNo + " 吗?",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#fd4200",
      success: function (res) {
        if (res.confirm == true) {
          that.deleteBankRequest(selectItem.bankNo);
          wx.showToast({
            title: '解绑成功',
            icon: 'none'
          })
        }
      }
    })
  },
  deleteBankRequest: function (bankno) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: deleteUserBankUrl,
        param:{
          bankNo: bankno,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: "解绑成功",
          })
          that.banksRequest();
        }
      }
    })
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    // wx.navigateTo({
    //   url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    // });
  },
  add:function(){
    if (!util.checkUserMemberFlag()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/creditcards/add/creditcardadd'
    });
  }

})

