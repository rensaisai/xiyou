const config = require('../../config')
const token = config.token
const gaodeRegeoUrl = config.gaodeRegeoUrl
const getUserInfoByOpenIdUrl = config.getUserInfoByOpenIdUrl
const getUserCarInfoUrl = config.getUserCarInfoUrl
const getRepairsUrl = config.getRepairsUrl
const getCityCodeUrl = config.getCityCodeUrl
const getGROpenIdUrl = config.getGROpenIdUrl
const getAdsUrl = config.getAdsUrl
const updateUserUrl = config.updateUserUrl
const vehiclemessage = config.vehiclemessage
const getUserInfoByUserIdUrl = config.getUserInfoByUserIdUrl
const checkQrCodeByUserIdUrl = config.checkQrCodeByUserIdUrl
// const dateUrl = config.dateUrl
var app = getApp()
console.log(app)
var util = require('../../utils/util')
// var md5 = require('../../utils/md5')
Page({
  data: {
    list: null,
    city:'',
    // sortname:'评分最高',
    // sortList: ['距离优先', '评分最高'],
    carName:'快来添加您的爱车吧',
    license: '',
    caruser:'',
    carInfoimg:'',
    orderType:0,// 0 - 距离优先，1-评价优先
    // searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    // callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    loadmore:false,
    qrString:'搜索修理厂',
    keyword:'',
    adsList:[],
    page:0,
    hiddenNone:'true',
    showModalStatus: false,
  },
  getOpenId:function(){
    var that = this;
    if (app.globalData.openid == null) {  
      // 登录
      wx.login({
        success: function (loginCode) {
          //调用request请求api转换登录凭证
          util.kmRequest({
            data: {
              token:'',
              interfaceName: getGROpenIdUrl,
              param:{
                code: loginCode.code
              }
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
      data: {
        interfaceName: getUserInfoByOpenIdUrl,
        param:{
          openId: app.globalData.openid,
          // token: app.globalData.token
        } 
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          that.carInfoRequest();
          if (app.globalData.userInfo != null){
            that.updateUserRequest(app.globalData.kmUserInfo.id)
          }
          if (app.globalData.content != '' && app.globalData.content != null && app.globalData.kmUserInfo != null) {
            util.kmRequest({
              data: {
                interfaceName: checkQrCodeByUserIdUrl,
                param: {
                  content: app.globalData.content
                }
              },
              success: function (res) {
                app.globalData.content = null
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel:false,
                  success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            })
          }
        }else{
          if (app.globalData.userId != null){
            wx.navigateTo({
              url: '/pages/users/logins/logins',
            })
          }
        }
      }
    })
  },
  updateUserRequest: function (userId) {
    var that = this;
    if (app.globalData.userId != null){
      var user = app.globalData.userId
    }else{
      var user = ''
    }
    util.kmRequest({
      data: {
        interfaceName: updateUserUrl,
        param:{
          "openId": app.globalData.openid,
          // "userId": userId,
          // "headImg": app.globalData.userInfo.avatarUrl,
          "nickName": app.globalData.userInfo.nickName,
          "contory": app.globalData.userInfo.country,
          "province": app.globalData.userInfo.province,
          "city": app.globalData.userInfo.city,
          "ancestor": user,
        }
      },
      method:"post",
      success: function (res) {
        if (res.data.status == 1) {

        }
      }
    })
  },
  showCar: function () {
    this.setData({
      carName:app.globalData.carInfo.fctName + app.globalData.carInfo.brName,
      license: app.globalData.carInfo.carNo,
      caruser:"(" + app.globalData.carInfo.year + ")" + app.globalData.carInfo.cc,
      carInfoimg: app.globalData.carInfo.img
    })
  },
  carInfoRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getUserCarInfoUrl,
        param:{
          // token: app.globalData.token
        },
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.carInfo = JSON.parse(res.data.data)[0];
          that.showCar();
        }else{
          that.setData({
            carName: '快来添加您的爱车吧',
            license: '',
            caruser: '',
            carInfoimg: ''
          })
        }
      }
    })
  },
  //获取当前经度纬度
  getLocation: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        app.globalData.locationInfo = res;
        that.positionRequest(res.longitude, res.latitude);
      },
      fail:function(res){
        that.cityCodeRequest();
      }
    })
  }, 
  confirm(){
    this.setData({
      list:null
    })
    wx.openSetting()
  },
  cancel(){
    this.getLocation();
    this.hideModal();
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  //根据经度纬度获取当前位置信息
  positionRequest: function (lon, lat) {//经度，维度
    var that = this;
    wx.request({
      url: gaodeRegeoUrl + lon + ',' + lat,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          if (app.globalData.addressComponent != undefined &&  app.globalData.addressComponent.city != res.data.regeocode.addressComponent.city){
           that.setData({
             list:null
           })
          }
          app.globalData.addressComponent = res.data.regeocode.addressComponent;
          that.cityCodeRequest();
        }
      }
    })
  },
  //根据定位城市获取城市code 
  cityCodeRequest: function () {
    var that = this;
    var city = '太原市';
    if (app.globalData.addressComponent != null) {
      city = app.globalData.addressComponent.city;
    }
      util.kmRequest({
        data: {
          interfaceName: getCityCodeUrl,
          param:{
            regionName: city
          }
        },
        success: function (res) {
          if (res.data.status == 1 || res.data.status == 6) {
            app.globalData.cityCode = JSON.parse(res.data.data)[0].areaLevel;
            app.globalData.cityName = JSON.parse(res.data.data)[0].regionName;
            that.setData({
              city: app.globalData.cityName,
              page: 0,
              loadmore: false,
            });
            that.repairsRequest();
          }
        }
      })
    },
  //根据经度纬度获取保养列表 
  repairsRequest: function () {
    var that = this;
    var lon = -1;
    var lat = -1;
    if (app.globalData.locationInfo != null){
      lon = app.globalData.locationInfo.longitude,
      lat = app.globalData.locationInfo.latitude
    }
    util.kmRequest({
      data: {
        interfaceName: getRepairsUrl,
        param:{
          cityCode: app.globalData.cityCode,
          orderType: that.data.orderType,
          lon: lon,
          lat: lat,
          pageNum: that.data.page
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
            for (var i = 0; i < list.length; i++) {
              delete list[i].repairDesc;
              var item = list[i];
              var stars = new Array();
              var count = parseInt(Math.round(item.evaluate));
              for (var j = 0; j < count; j++) {
                stars[j] = j;
              }
              item.stars = stars;
              item.grade = item.evaluate.toFixed(2)
              if (item.distance != -1) {
                item.distanceShow = item.distance.toFixed(2) + 'km';
              } else {
                item.distanceShow = '';
              }
            }
            if (app.globalData.page == 1){
              
            }else{
              if (that.data.list != null && that.data.page > 0) {
                var shoplist = that.data.list
                var list = shoplist.concat(list)
              }
            }
          app.globalData.page = 0
          that.setData({
            list: list
          });
        }else if(res.data.status == 6){
          if(that.data.page > 0){
            that.setData({
              page: that.data.page - 1,
              loadmore:true
            });
          }
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
        that.repairsRequest();
      }
    })
  },
  andmore(){
  if (!util.checkUserInfo()) {
      return;
    }
  if (app.globalData.carInfo == null) {
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
      return
  }
   wx.navigateTo({
     url: '/pages/map/map?type=' + 1 +'&scign='+0
  })
  },
  selfdriving(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/driving/drivingimg',
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    wx.showNavigationBarLoading();
    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },
  //加载更多
  onReachBottom: function () {
   var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true){
      that.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page:that.data.page+1
        })
        that.repairsRequest();
      }, 1000)
    }
  },
  onShow: function () { 
    var that = this
    if (app.globalData.openid != null) {
      wx.getStorage({
          key: token,
          success(res) {
            app.globalData.token = res.data
            that.userInfoRequest();
          }
        })
    }
    if (app.globalData.cityName != null) {
      that.setData({
        city: app.globalData.cityName
      })
    if (app.globalData.cityCode != null && app.globalData.locationInfo != null){
      if (that.data.list == null){
        that.repairsRequest();
       }
      }
    }
    if (app.globalData.page == 1){
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userLocation'] == false) {
            that.showModal()
          } else {
            that.getLocation();
          }
        }
      })
    }
    this.hideModal()
  },
  onLoad: function (options) {
    console.log(options)
    var that = this
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocation'] == false) {
          that.showModal()
        } else {
          that.getLocation();
        }
      }
    })
    // app.globalData.userId = "2c91e4ba6b793c44016b7cbbfa2c0019";
    if (options.scene != undefined) {
      app.globalData.userId = options.scene
    }
    this.getOpenId();  
    this.adsRequest();
    this.newVersion();
    this.setData({
      page: 0,
    })
  },
  newVersion: function () {
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
          showCancel: false,
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
  mdriving:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.carInfo == null) {
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
      return
    }
    wx.showToast({
      title: '开发中敬请期待...',
      icon:'none'
    })
  },
  vehicle:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.carInfo == null) {
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
      return
    }
    wx.navigateTo({
      url: '/pages/users/vehicle/vehicle',
    })
  },
  wash:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.carInfo == null) {
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
      return
    }
    wx.navigateTo({
      url: '/pages/users/wash/wash',
    })
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        console.log(res)
        // var params = util.getUrlParam(res.result);
        console.log(params)
        // if(res.result != null && res.result.length > 0){
        //  
        //   if(params.kmcode != null && params.kmcode == 1){
        //     if(app.globalData.kmUserInfo == null){
        //       wx.navigateTo({
        //         url: '/pages/users/register/register?refereId=' + params.refereId
        //       });
        //     }else{
        //       wx.showToast({
        //         title: "您已经注册会员",
        //         icon: "none"
        //       })
        //     }
        //   }else{
        //     wx.showToast({
        //       title: "不支持",
        //       icon: "none"
        //     })
        //   }
        // }
      },
      fail: function (res) {
      }
    })
  },
  chooseCity: function () {
    this.setData({
      page: 0,
      loadmore: false,
      list:null,
    })
    wx.navigateTo({
      url: '/pages/address/province/provincelist'
    });
  },
  adsRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getAdsUrl,
        param:{}
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
  keywordInput(){
   wx.navigateTo({
     url: '/pages/repairshops/search/repairsearch',
   })
  },
  searchShop: function () {
    wx.navigateTo({
      url: '/pages/repairshops/search/repairsearch?keywords=' + this.data.keyword
    });
  },
  itemClick: function (event) {
    if (!util.checkUserInfo()) {
      return;
    }
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    if (app.globalData.carInfo == null){
      wx.navigateTo({
        url: '/pages/cars/carselect/fct/fctlist'
      });
    }else{
      wx.navigateTo({
        url: '/pages/progect/project?selectItem=' + JSON.stringify(selectItem)
      });
    }
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
        url: '/pages/users/myvehicle/myvehicle'
      });
    }
  },
  vip(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.memberFlag != 1){
      wx.navigateTo({
        url: '/pages/upgrade/order/order?cardType=' + 0 + '&ids=' + 1,
      })
    }else{
      wx.showToast({
        title: '您已是超级会员',
        icon:'none'
      })
    }
  },
  testRequest: function () {
  
  },
  onShareAppMessage: function () {
    return {
      title: '果仁车秘书',
      desc: '正品配件，专业保养',
      path: '/pages/index/index'
    }
  }
})

