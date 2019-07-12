const config = require('../../../../config')
const getAllUserCarsUrl = config.getAllUserCarsUrl
const updateUserChoiceCarUrl = config.updateUserChoiceCarUrl
const deleteUserCarUrl = config.deleteUserCarUrl

var util = require('../../../../utils/util')

var app = getApp()
Page({
  data: {
    list: [],

    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    id: null,
    titleName: '',
    logo: '',
    hiddenNone: 'true',
    cantAdd: 'true'
  },
  dataRequest: function () {
    var that = this;
    util.kmRequest({
      url: getAllUserCarsUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.hiddenDefault = 'true';
            item.hiddenDelete = 'true';
            switch (item.isUse) {
              case 0://未使用
                item.hiddenDefault = '';
                item.hiddenDelete = '';
                break;
            }
          }
          that.setData({
            list: list
          });
          if (list == null || list.length == 0) {
            that.setData({
              hiddenNone: ''
            })
          } else {
            that.setData({
              hiddenNone: 'true'
            })
            if(list.length < 5){
              that.setData({
                cantAdd: ''
              })
            }else{
              that.setData({
                cantAdd: 'true'
              })
            }
          }
        }
      }
    })
  },
  defaultClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    util.kmRequest({
      url: updateUserChoiceCarUrl,
      data: {
        userId:app.globalData.kmUserInfo.id,
        userCarId: selectItem.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          if (JSON.parse(res.data.data)[0].isUse == 1) {
            app.globalData.carInfo = JSON.parse(res.data.data)[0];
          }
          that.dataRequest();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  deleteClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定删除 " + selectItem.carNo + " 吗?",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          that.deleteCar(selectItem.id);
        }
      }
    })
  },
  deleteCar: function (carId) {
    var that = this;
    util.kmRequest({
      url: deleteUserCarUrl,
      data: {
        userCarId: carId
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.dataRequest();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
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
    this.dataRequest();
    wx.showNavigationBarLoading()

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
        list: list
      })
    }, 1000)
  },
  onLoad: function (options) {
    
  },
  onShow: function () {
    this.dataRequest();
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];

    app.globalData.brInfo = selectItem;
    wx.navigateTo({
      url: '/pages/cars/mycar/cardetail/mycar?canChangeCar=true&carInfo=' + JSON.stringify(selectItem)
    });
  }
})

