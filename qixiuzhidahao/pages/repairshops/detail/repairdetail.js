const config = require('../../../config')
const getRepairInfoUrl = config.getRepairInfoUrl
const getSetmealsUrl = config.getSetmealsUrl
const getCommentsUrl = config.getCommentsUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    entity: {},
    list: [
    ],
    commentsList: [
    ],

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏

    selected: true,
    selected1: false,
    selectSetmeal: null
  },
  repairsRequest: function (repairId) {
    var that = this;
    util.kmRequest({
      url: getRepairInfoUrl,
      data: {
        repairId: repairId
      },
      success: function (res) {
        if (res.data.status == 1) {
          var entity = JSON.parse(res.data.data)[0];
          var stars = new Array();
          var count = entity.evaluate;
          for (var j = 0; j < count; j++) {
            stars[j] = j;
          }
          entity.stars = stars;
          
          that.setData({
            entity: entity
          });
        }
      }
    })
  },
  setmealsRequest: function (repairId) {
    var that = this;
    util.kmRequest({
      url: getSetmealsUrl,
      data: {
        yearId: app.globalData.carInfo.yearId,
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.chose == 1) {
              item.checked = true;
              that.setData({
                selectSetmeal: item
              });
              break;
            } else {
              item.checked = false;
            }
          }
          that.setData({
            list: list
          });
        }
      }
    })
  },
  commentsRequest: function(repairId) {
    var that = this;
    util.kmRequest({
      url: getCommentsUrl,
      data: {
        repairId: repairId
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          for(var i = 0; i < list.length; i++){
            var item = list[i];
            if (item.nickName != null && item.nickName.length != 0) {
              item.title = item.nickName;
            }else{
              var phone = "";
              if(item.phone != null && item.phone.length == 11){
                var tempStr = item.phone.slice(3, 8);
                phone = item.phone.replace(tempStr, "*****");
              }
              item.title = phone;
            }
            var stars = new Array();
            var count = item.evaluate;
            for (var j = 0; j < count; j++) {
              stars[j] = j;
            }
            item.stars = stars;
          }
          that.setData({
            commentsList: list
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var id = options.repairId
    this.repairsRequest(id);
    if (app.globalData.carInfo == null){
      wx.showModal({
        title: "提示",
        content: "您还未绑定车辆，现在去绑定",
        showCancel: false,
        confirmText: "去绑定",
        confirmColor: "#1296db",
        success:function(res){
          if(res.confirm == true){
            var url = '';
            if(app.globalData.kmUserInfo == null){
              url = '/pages/users/login/login';
            }else{
              url = '/pages/cars/carselect/fct/fctlist';
            }
            wx.redirectTo({
              url: url
            });
          }
        }
      })
    }else{
      this.setmealsRequest(id);
    }
    this.commentsRequest(id);
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  mapShow: function () {
    wx.navigateTo({
      url: '/pages/maps/map/map?lon=' + this.data.entity.lon + '&lat=' + this.data.entity.lat
    });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "4008972221",// this.data.entity.phone,
      success: function () {
        util.kmConsoleLog("成功拨打电话")
      }
    })
  },
  radioChange: function (e) {
    var items = this.data.list;
    for (var i = 0; i < items.length; i++) {
      if (i == e.detail.value){        
        items[i].checked = true;
        this.setData({
          selectSetmeal: items[i]
        });
      }else{
        items[i].checked = false;
      }
    }
    this.setData({
      list: items
    });
  },
  checkOrder:function(){
    if (this.data.selectSetmeal == null){
      wx.showToast({
        title: "请选择保养套餐",
        icon: "none"
      })
      return;
    }
    if (app.globalData.kmUserInfo.memberFlag == 0) {
      wx.showModal({
        title: "提示",
        content: "您还未加入VIP会员，现在加入",
        showCancel: false,
        confirmText: "马上加入",
        confirmColor: "#1296db",
        success: function (res) {
          if (res.confirm == true) {
            wx.switchTab({
              url: '/pages/proxy/proxy',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/orders/my/check/ordercheck?entity=' + JSON.stringify(this.data.entity) + '&setmeal=' + JSON.stringify(this.data.selectSetmeal)
      });
    }
  }
})

