const config = require('../../config')
const gaodeRegeoUrl = config.gaodeRegeoUrl
const getUserLoginUrl = config.getUserLoginUrl
const getFishInfoByCityUrl = config.getFishInfoByCityUrl
const getCityCodeUrl = config.getCityCodeUrl
const getOpenId = config.getOpenId
const getAllAdImgUrl = config.getAllAdImgUrl
const updateUserWXUrl = config.updateUserWXUrl

const getUserInfoByUserIdUrl = config.getUserInfoByUserIdUrl

var app = getApp()
var util = require('../../utils/util')
var md5 = require('../../utils/md5')

Page({
  data: {
    list: [
    ],
    sortname:'时间最新',
    sortList: ['时间最新'],
    carName:'快来添加你的爱车吧',

    orderType:0,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 15,      //返回数据的个数
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏

    qrString:'请输入钓场名称',
    keyword:'',
    adsList:[],
    hiddenNone:'true',
    starts: [0, 1, 2, 3, 4],
    listPage:0,
    refreshList:false
  },
  getOpenId:function(){
    var that = this;
    if (app.globalData.openid == null) {
      // 登录
      wx.login({
        success: function (loginCode) {
          //调用request请求api转换登录凭证
          util.kmRequest({
            url: getOpenId,
            data: {
              code: loginCode.code
            },
            success: function (res) {
              if (res.data.status == 1) {
                app.globalData.openid = JSON.parse(res.data.data).openid;
                that.userInfoRequest();
              }
            }
          })
        }        
      })
    }
  },
  userInfoRequest:function(){
    var that = this;
    util.kmRequest({
      url: getUserLoginUrl,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          if (app.globalData.userInfo != null){
            that.updateUserRequest(app.globalData.kmUserInfo.id)
          }
        }
      }
    })
  },
  updateUserRequest: function (userId) {
    var that = this;
    util.kmRequest({
      url: updateUserWXUrl,
      data: {
        "openId": app.globalData.openid,
        "userId": userId,
        "headImg": app.globalData.userInfo.avatarUrl,
        "nickName": app.globalData.userInfo.nickName,
        "contory": app.globalData.userInfo.country,
        "province": app.globalData.userInfo.province,
        "city": app.globalData.userInfo.city
      },
      success: function (res) {
        if (res.data.status == 1) {

        }
      }
    })
  },
  showCar: function () {
    this.setData({
      carName: app.globalData.carInfo.fctName + app.globalData.carInfo.brName + "(" + app.globalData.carInfo.year + ")" + app.globalData.carInfo.cc,
    })
  },
  repairsRequest: function () {
    var that = this;
    var lon = -1;
    var lat = -1;
    if (app.globalData.locationInfo != null){
      lon = app.globalData.locationInfo.longitude,
      lat = app.globalData.locationInfo.latitude
    }
    util.kmRequest({
      url: getFishInfoByCityUrl,
      data: {
        city: app.globalData.cityCode,
        page: this.data.listPage
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = new Array(0);
          if (res.data.data.length > 0) {
            that.setData({
              listPage: that.data.listPage + 1
            });
            list = JSON.parse(res.data.data);
            for (var i = 0; i < list.length; i++) {
              var item = list[i];
              var stars = new Array();
              var count = item.evaluate;
              for (var j = 0; j < count; j++) {
                stars[j] = j;
              }
              item.stars = stars;
              if (item.distance != -1) {
                item.distanceShow = item.distance + 'km';
              } else {
                item.distanceShow = '';
              }
              if (config.debug) {//>>>>>>
                for (var j = 0; j < item.img.length; j++) {
                  var imgurl = item.img[j];
                  item.img[j] = imgurl.replace('https://www.cmspq.xyz', 'http://101.201.232.125:8081')
                  console.log('---->>>' + item.img[j])
                }
              }
              item.closed = 'true'
              if (new Date() > new Date(item.endTime)){
                item.closed = ''
              }
            }
          }
          that.setData({
            list: that.data.list.concat(list)
          });
        }
        if (that.data.list == null || that.data.list.length == 0){
          that.setData({
             hiddenNone:''
          })
        }else{
          that.setData({
            hiddenNone: 'true'
          })
        }
      }
    })
  },
  cityCodeRequest: function () {
    var that = this;
    var city = '太原市';
    if (app.globalData.addressComponent != null){
      city = app.globalData.addressComponent.city;
      if (city == null || city.length == 0) {
        city = app.globalData.addressComponent.province;
      }
    }
    util.kmRequest({
      url: getCityCodeUrl,
      data: {
        regionName: city
      },
      success: function (res) {
        if (res.data.status == 1 || res.data.status == 6) {
          app.globalData.cityCode = JSON.parse(res.data.data)[0].areaLevel;
          app.globalData.cityName = JSON.parse(res.data.data)[0].regionName;
          that.setData({
            city: app.globalData.cityName
          });
          that.repairsRequest();
        }
      }
    })
  },
  actionSheetTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.sortList,
      success: function (e) {
        util.kmConsoleLog(e.tapIndex);

        that.setData({
          sortname: that.data.sortList[e.tapIndex],
          orderType:e.tapIndex
        });
        that.setData({
          list: []
        });
        that.data.listPage = 0;
        that.repairsRequest();
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.setData({
      list: []
    });
    this.data.listPage = 0;
    this.adsRequest();
    this.repairsRequest();
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
    this.repairsRequest();
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true
      })
    }, 1000)
  },
  userInfoReRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserLoginUrl,
      data: {
        openId: app.globalData.openid
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
        }
      }
    })
  },
  onShow: function () {
    if (app.globalData.cityName != null) {
      this.setData({
        city: app.globalData.cityName
      })
      if (app.globalData.cityCode != null && app.globalData.locationInfo != null){
        if (this.data.refreshList){
          this.setData({
            refreshList: false
          })
          this.setData({
            list: []
          });
          this.data.listPage = 0;
          this.adsRequest();
          this.repairsRequest();
        }
      }
    }
    if (app.globalData.openid != null){
      this.userInfoReRequest();
    }
  },
  onLoad: function (options) {
    this.getOpenId();
    this.getLocation();
    this.adsRequest();
    // util.kmConsoleLog('md5---' + md5.md5('123456'));
    // util.kmConsoleLog('guid---' + util.guid());
    // this.testRequest();

    var repairId = options.repairId;
    if (options.scene != null) {
      var scene = decodeURIComponent(options.scene);
      repairId = scene;
    }
    if (repairId != null){
      wx.navigateTo({
        url: '/pages/repairshops/detail/repairdetail?repairId=' + repairId
      });
    }
    this.newVersion();    
  },
  newVersion: function(){
    console.log('canIUse---getUpdateManager---' + wx.canIUse('getUpdateManager'));
    if (wx.canIUse('getUpdateManager')) {
      var updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('有新版本吗：' + res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '有新版本了，马上更新？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function () {
        console.log('新的版本下载失败')
      })
    }
  },
  positionRequest:function(lon, lat){//经度，维度
    var that = this;
    var province = '山西省';
    var city = '太原市';
    util.kmRequest({
      url: gaodeRegeoUrl + lon + ',' + lat,
      data: {},
      success: function (res) {
        if (res.data.status == 1){
          //province citycode city district
          app.globalData.addressComponent = res.data.regeocode.addressComponent;
          
          province = res.data.regeocode.addressComponent.province;
          city = res.data.regeocode.addressComponent.city;

          that.cityCodeRequest();
        }
      }
    })
  },
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        util.kmConsoleLog(res);
        app.globalData.locationInfo = res;
        that.positionRequest(res.longitude, res.latitude);
      },
      fail:function(res){
        util.kmConsoleLog(res);
        that.cityCodeRequest();
      }
    })
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        if(res.result != null && res.result.length > 0){
          var params = util.getUrlParam(res.result);
          if(params.kmcode != null && params.kmcode == 1){
            if(app.globalData.kmUserInfo == null){
              wx.navigateTo({
                url: '/pages/users/register/register?refereId=' + params.refereId
              });
            }else{
              wx.showToast({
                title: "您已经注册会员",
                icon: "none"
              })
            }
          }else{
            wx.showToast({
              title: "不支持",
              icon: "none"
            })
          }
        }
      },
      fail: function (res) {
      }
    })
  },
  chooseCity: function () {
    this.setData({
      refreshList:true
    })
    wx.navigateTo({
      url: '/pages/address/province/provincelist'
    });
  },
  adsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getAllAdImgUrl,
      data: {
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            adsList: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  keywordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  searchShop: function () {
    wx.navigateTo({
      url: '/pages/repairshops/search/repairsearch?keywords=' + this.data.keyword
    });
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    });
  },
  selectMyCar: function(){
    if (!util.checkUserInfo()) {
      return;
    }
    if(app.globalData.carInfo == null){
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
    }else{
      wx.navigateTo({
        url: '/pages/cars/mycar/carlist/carlist'
      });
    }
  },
  testRequest: function () {
    // var that = this;
    // util.kmRequest({
    //   url: getUserInfoByUserIdUrl,
    //   data: {
    //     userId: 1
    //   },
    //   success: function (res) {
    //     if (res.data.status == 1) {
          
    //     }
    //   }
    // })
  },
  onShareAppMessage: function () {
    return {
      title: '钓场天下',
      desc: '',
      path: '/pages/index/index'
    }
  }

})

