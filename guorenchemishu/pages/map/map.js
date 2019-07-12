const config = require('../../config.js')
const util = require('../../utils/util.js')
const getRepairsUrl = config.getRepairsUrl
const getDetectionLineUrl = config.getDetectionLineUrl
const getCarwashUrl = config.getCarwashUrl
var app = getApp()
Page({
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    windowHeight: '',
    orderType: 0,
    markers:null,
    marlist:null,
    list:null,
    // active:true,
    // id:'',
    type:'',
    scign:'',
  },
  repairsRequest: function () {
    var that = this;
    var lon = -1;
    var lat = -1;
    if (app.globalData.locationInfo != null) {
      lon = app.globalData.locationInfo.longitude,
      lat = app.globalData.locationInfo.latitude
    }
    if(that.data.type == 1){
      var url = getRepairsUrl
    } else if (that.data.type == 2){
      var url = getDetectionLineUrl
    } else if (that.data.type == 3){
      var url = getCarwashUrl
    }
    util.kmRequest({
      data: {
        interfaceName:url,
        param:{
          cityCode: app.globalData.cityCode,
          orderType: that.data.orderType,
          lon: lon,
          lat: lat
        } 
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          var markers = []
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            // var stars = new Array();
            // var count = item.evaluate;
            // for (var j = 0; j < count; j++) {
            //   stars[j] = j;
            // }
            // item.stars = stars;
            if (that.data.type == 3){
              item.grade = item.evaluate1.toFixed(2)
            }else{
              item.grade = item.evaluate.toFixed(2)
            }
            if (item.distance != -1) {
              item.distanceShow = item.distance.toFixed(2) + 'km';
            } else {
              item.distanceShow = '';
            }
            if (item.zdhFlag == 1){
              item.img = '/image/ding.png'
              item.width = 40
              item.height = 40
            }else{
              item.img = '/image/wei.png'
              item.width = 30
              item.height = 30
            }
            markers.push({
              id:item.id,
              iconPath: item.img,
              width: item.width,
              height: item.height,
              latitude: item.lat,
              longitude: item.lon,
            })
          }
          that.setData({
            marlist: list,
            markers: markers
          });
        }
      }
    })
  },
  controltap(e){
  var that = this
  var marlist = that.data.marlist
    for (var i = 0; i < marlist.length; i++){
      if (marlist[i].id == e.markerId){
        that.setData({
          list: marlist[i],
          active:false,
          id: e.markerId
        })
      }
    }
  },
  map(){
    delete this.data.list.repairDesc
    if (this.data.type == 1 && this.data.scign == 0){
      wx.navigateTo({
        url: '/pages/progect/project?selectItem=' + JSON.stringify(this.data.list),
      })
    } else if (this.data.type == 1 && this.data.scign == 1){
      var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        entity: this.data.list
      })
      wx.navigateBack({
        delta: 1
      })
    }
    if (this.data.type == 2 && this.data.scign == 0){
      wx.redirectTo({
        url: '/pages/users/vehicle-details/vehicle-details?selectItem=' + JSON.stringify(this.data.list),
      })
    } else if (this.data.type == 2 && this.data.scign == 1){
      wx.redirectTo({
        url: '/pages/users/vehicle-details/vehicle-details?selectItem=' + JSON.stringify(this.data.list),
      })
      // var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      // var prevPage = pages[pages.length - 2];
      // console.log(prevPage)
      // prevPage.setData({
      //   entity: this.data.list
      // })
      // wx.navigateBack({
      //   delta: 1
      // })
    } 
    if (this.data.type == 3 && this.data.scign == 0) {
      // wx.navigateTo({
      //   url: '/pages/users/wash-details/wash-details?selectItem=' + JSON.stringify(this.data.list),
      // })
      wx.redirectTo({
        url: '/pages/users/wash-details/wash-details?selectItem=' + JSON.stringify(this.data.list)
      })
    } else if (this.data.type == 3 && this.data.scign == 1) {
      wx.redirectTo({
        url: '/pages/users/wash-details/wash-details?selectItem=' + JSON.stringify(this.data.list)
      })
      // var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      // var prevPage = pages[pages.length - 2];
      // console.log(prevPage)
      // prevPage.setData({
      //   entity: this.data.list
      // })
      // wx.navigateBack({
      //   delta: 1
      // })
    } 
  },
  onLoad: function (options) {
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight;
      }
    })
    this.setData({
      windowHeight: windowHeight,
      // latitude: app.globalData.locationInfo.latitude,
      // longitude: app.globalData.locationInfo.longitude,
      // active:true,
      type: options.type,
      scign: options.scign
    })
    this.repairsRequest()
  }
})
