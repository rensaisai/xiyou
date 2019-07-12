const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCarwashSetmealsUrl = config.getCarwashSetmealsUrl
const getCarwashInfoUrl = config.getCarwashInfoUrl
const getCarwashCommentsUrl = config.getCarwashCommentsUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    price: null,
    selectSetmeal: null,
    active: false,
    selected: true,
    selected1: false,
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    commentsList: null,
  },
  detal: function (id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarwashInfoUrl,
        param:{
          id: id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          var stars = new Array();
          var count = list.evaluate;
          for (var j = 0; j < count; j++) {
            stars[j] = j;
          }
          list.stars = stars;
          console.log(list)
          that.setData({
            list: list
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
  vehicle: function (id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarwashSetmealsUrl,
        param:{
          carwashId: id,
        }
        // userId: app.globalData.kmUserInfo.id,
      
      },
      success: function (res) {
        if (res.data.status == 1) {
          var price = JSON.parse(res.data.data)
          console.log(price)
          price[0].checked = true
          that.setData({
            price: price,
            selectSetmeal: price[0]
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
  evaluate: function (id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarwashCommentsUrl,
        param:{
          id: id
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var commentsList = JSON.parse(res.data.data)
          console.log(commentsList)
          for (var i = 0; i < commentsList.length; i++) {
            var item = commentsList[i];
            if (item.nickName != null && item.nickName.length != 0) {
              item.title = item.nickName;
            } else {
              var phone = "";
              if (item.phone != null && item.phone.length == 11) {
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
            commentsList: commentsList
          })
        }
      }
    })
  },
  mapShow: function () {
    wx.openLocation({
      latitude: this.data.list.lat,
      longitude: this.data.list.lon,
      name: this.data.list.carwashName,
      address: this.data.list.address
    })
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "4009925550",// this.data.entity.phone,
      success: function () {
        util.kmConsoleLog("成功拨打电话")
      }
    })
  },
  showFrom: function () {
    this.setData({
      active: (this.data.active ? false : true)
    })
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
  radioChange: function (e) {
    var items = this.data.price;
    for (var i = 0; i < items.length; i++) {
      if (i == e.detail.value) {
        items[i].checked = true;
        this.setData({
          selectSetmeal: items[i]
        });
      } else {
        items[i].checked = false;
      }
    }
    this.setData({
      price: items
    });
  },
  checkOrder: function () {
    if (this.data.selectSetmeal == null) {
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
            wx.switchTab({
              url: '/pages/proxy/proxy',
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/users/confirm/confirm?entity=' + JSON.stringify(this.data.list) + '&setmeal=' + JSON.stringify(this.data.selectSetmeal)
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.repairId
    console.log(id)
    this.detal(id)
    this.vehicle(id)
    this.evaluate(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})