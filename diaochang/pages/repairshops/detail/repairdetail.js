const config = require('../../../config')
const getFishInfoByIdUrl = config.getFishInfoByIdUrl

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
    selectSetmeal: null, 
    hiddenObd:'true'
  },
  repairsRequest: function (repairId) {
    var that = this;
    util.kmRequest({
      url: getFishInfoByIdUrl,
      data: {
        fishInfoId: repairId
      },
      success: function (res) {
        if (res.data.status == 1) {
          var entity = JSON.parse(res.data.data)[0];
          wx.setNavigationBarTitle({
            title: entity.fishName
          });
          var stars = new Array();
          var count = entity.evaluate;
          for (var j = 0; j < count; j++) {
            stars[j] = j;
          }
          entity.stars = stars;
          if (config.debug) {//>>>>>>
            for (var i = 0; i < entity.img.length; i++) {
              var imgurl = entity.img[i];
              entity.img[i] = imgurl.replace('https://www.cmspq.xyz', 'http://101.201.232.125:8081')
            }
          }
          that.setData({
            entity: entity
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var id = options.repairId
    this.repairsRequest(id);
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
      name: this.data.entity.fishName,
      address: this.data.entity.locationAddress
    })
    // wx.navigateTo({
    //   url: '/pages/maps/map/map?lon=' + this.data.entity.lon + '&lat=' + this.data.entity.lat
    // });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.entity.tele,
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
      confirmColor: "#1296db",
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
  },
  previewImage: function (e) {
    var current = e.target.dataset.src
    console.log(e.target.dataset)
    wx.previewImage({
      current: current,
      urls: this.data.entity.img
    })
  },
  onShareAppMessage: function () {
    return {
      title: '钓场天下',
      desc: this.data.entity.fishName,
      path: '/pages/index/index?repairId=' + this.data.entity.id
    }
  },
  shareFriend: function(){
    wx.navigateTo({
      url: '/pages/sharefriend/sharefriend?repairId=' + this.data.entity.id + '&name=' + this.data.entity.fishName
    });
  }
})

