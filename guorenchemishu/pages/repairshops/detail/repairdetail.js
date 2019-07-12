const config = require('../../../config')
const getRepairInfoUrl = config.getRepairInfoUrl
const getSetmealsUrl = config.getSetmealsUrl
const getCommentsUrl = config.getCommentsUrl
const getUserOBDUrl = config.getUserOBDUrl
const saveUserOBDUrl = config.saveUserOBDUrl

var app = getApp()
var util = require('../../../utils/util')

Page({
  data: {
    entity: {},
    list: [
    ],
    commentsList: [
    ],
    active:false,
    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    selected: true,
    selected1: false,
    selectSetmeal: null,
    hiddenObd:'true'
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
          console.log(res.data.data)
          var entity = JSON.parse(res.data.data)[0];
          console.log(entity)
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
        userId: app.globalData.kmUserInfo.id,
        cityCode: app.globalData.cityCode
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
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
    console.log(id)
    this.repairsRequest(id);
    if (app.globalData.carInfo == null){
      wx.showModal({
        title: "提示",
        content: "您还未绑定车辆，现在去绑定",
        showCancel: false,
        confirmText: "去绑定",
        confirmColor: "#fd4200",
        success:function(res){
          if(res.confirm == true){
            var url = '';
            if(app.globalData.kmUserInfo == null){
              url = '/pages/users/logins/logins';
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
    this.checkGetOBD();
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
    wx.openLocation({
      latitude: this.data.entity.lat,
      longitude: this.data.entity.lon,
      name: this.data.entity.repairName,
      address: this.data.entity.address
    })
    // wx.navigateTo({
    //   url: '/pages/maps/map/map?lon=' + this.data.entity.lon + '&lat=' + this.data.entity.lat
    // });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "4009925550",// this.data.entity.phone,
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
  checkGetOBD: function () {
    var that = this;
    util.kmRequest({
      url: getUserOBDUrl,
      data: {
        phone: app.globalData.kmUserInfo.phone
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            hiddenObd:''
          });
        }
      }
    })
  },
  confirmObd: function () {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "您确定到【" + that.data.entity.repairName + "】领取OBD吗？",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#fd4200",
      success: function (res) {
        if (res.confirm == true) {
          that.obdClick();
        }
      }
    })
  },
  obdClick: function () {
    var that = this;
    util.kmRequest({
      url: saveUserOBDUrl,
      data: {
        phone: app.globalData.kmUserInfo.phone,
        userId: app.globalData.kmUserInfo.id,
        repairId: this.data.entity.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            hiddenObd: 'true'
          });
        }
      }
    })
  },
  showFrom:function(){
     this.setData({
       active: (this.data.active?false: true)
     })
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
        confirmColor: "#fd4200",
        success: function (res) {
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/upgrade/order/order?cardType=' + 0 + '&ids=' + 1,
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

