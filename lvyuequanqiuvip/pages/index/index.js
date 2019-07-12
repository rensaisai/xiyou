const config = require('../../config')
const getAllToursUrl = config.getAllToursUrl
const getAllPopularFromHiUrl = config.getAllPopularFromHiUrl
const document = config.document
const visitorinformation = config.visitorinformation
const gaodeRegeoUrl = config.gaodeRegeoUrl
// const getUserCarInfoUrl = config.getUserCarInfoUrl
// const getRepairsUrl = config.getRepairsUrl
const getCityCodeUrl = config.getCityCodeUrl
const getXYOpenIdUrl = config.getXYOpenIdUrl
const getAdsUrl = config.getAdsUrl
// const getGoodsInfoByGoodsIdUrl = config.getGoodsInfoByGoodsIdUrl
const updateUserUrl = config.updateUserUrl
// const getAllGoodsUrl = config.getAllGoodsUrl
const getTenantInfoByTenantIdUrl = config.getTenantInfoByTenantIdUrl
const loginVipByOpenIdUrl = config.loginVipByOpenIdUrl
// const getAllVipZGGoodsUrl = config.getAllVipZGGoodsUrl
// const getUserInfoUrl = config.getUserInfoUrl
var app = getApp()
console.log(app)
var util = require('../../utils/util')

Page({
  data: {
    circuit:null,
    img:null,
    page:0,
    pop:null,
    showModalStatus: false,//是否显示
    list: [
    ],
    sortname:'评分最高',
    sortList: ['评分最高'],
    carName:'马上登陆',

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    hiddenNones: true,
    qrString:'查找',
    keyword:'',
    adsList:[],
    hiddenNone:'true',
    starts: [0, 1, 2, 3, 4],
  },
  getOpenId:function(){
    var that = this;
    if (app.globalData.openid == null) {
      // 登录
      wx.login({
        success: function (loginCode){
          console.log(loginCode)
          // 调用request请求api转换登录凭证
          util.kmRequest({
            url: getXYOpenIdUrl,
            data: {
              code: loginCode.code,
              source:'wx'
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.status == 1) {
                console.log(JSON.parse(res.data.data))
                app.globalData.openid = JSON.parse(res.data.data).openid;
                console.log(app.globalData.openid)
                that.userInfoRequest();
              }
            }
          })
        }
      })
    }
  },
  
  //根据openID获取用户信息
  userInfoRequest:function(){
    console.log(123455666)
    var that = this
      util.kmRequest({
        url: loginVipByOpenIdUrl,
        data: {
          openId: app.globalData.openid
        },
        success: function (res) {
          if (res.data.status == 1) {
            console.log(JSON.parse(res.data.data)[0])
            app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
            console.log(app.globalData.kmUserInfo)
            if (app.globalData.userInfo != null && app.globalData.kmUserInfo != null) {
              that.updateUserRequest(app.globalData.kmUserInfo.id)
            }
          }
        }
      })
    // }
  },
  // 跟新用户信息
  updateUserRequest: function (userId) {
    var that = this;
    util.kmRequest({
      url: updateUserUrl,
      data: {
        "openId": app.globalData.openid,
        "userId": userId,
        "headImg": app.globalData.userInfo.avatarUrl,
        "nickName": app.globalData.userInfo.nickName,
        "contory": app.globalData.userInfo.country,
        "province": app.globalData.userInfo.province,
        "city": app.globalData.userInfo.city,
        "isVip": app.globalData.kmUserInfo.isVip,
      },
      success: function (res) {
        if (res.data.status == 1) {
           console.log(res.data)
        }
      }
    })
  },
  onGotUserInfo(e){
   console.log(e)
  },
  //获取热门自嗨团 
  pop(){
   var that =this
   util.kmRequest({
     url: getAllPopularFromHiUrl,
     data:{},
     success:function(res){
     if(res.data.status==1){
       var pop = JSON.parse(res.data.data)
       console.log(pop)
       that.setData({
         pop:pop
       })
     } else if (res.data.status == 6){

     }else{
       wx.showToast({
         title: res.data.msg,
         icon: "none"
       })
     }
     }
   })
  },
//自嗨团线路列表 
  circuit:function(){
    var that=this
     util.kmRequest({
       url: getAllToursUrl,
       data:{
         type:0,
         pageNumber:that.data.page,
       },
       success:function(res){
         if(res.data.status==1){
           var circuit=JSON.parse(res.data.data)
           console.log(circuit)
           for (var i = 0; i < circuit.length; i++){
             circuit[i].lineName = '<' + circuit[i].lineName+'>'
             var bargain = (circuit[i].memberPrice) - (circuit[i].nowPrice)
             circuit[i].bargain = bargain
             var times = circuit[i].scheduleDate
             circuit[i].time = times.substring(5,10)
             if (circuit[i].status==0){
               circuit[i].star='未成团'
             } else if (circuit[i].status == 1){
               circuit[i].star = '已成团'
             }
           }
           if (that.data.circuit == null){
             var circuitlist = circuit
           }else{
             var circuits = that.data.circuit
             var circuitlist = circuits.concat(circuit)
           }
           that.setData({
             circuit: circuitlist
           })
         }else if(res.data.status == 6){
           if(that.data.page >0){
             that.setData({
               isHideLoadMore: true,
               hiddenNones: false,
             });
             setTimeout(() => {
               that.setData({
                 hiddenNones: true,
                 page: that.data.page - 1
               })
             }, 500)
           }
         }else{
           wx.showToast({
             title: res.data.msg,
             icon: "none"
           })
         }
       }
     })
  },
  //点击热门自嗨团图片跳转详情页面 
  circuitdetails(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/travel/hi-details/hi-details?id='+id,
    })
  },
  phone(){
    this.showModal()
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  dial(){
    wx.makePhoneCall({
      phoneNumber: '400-0098-365',
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.hideModal()
  },
  cancel(){
    this.hideModal()
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  search(){
    wx.navigateTo({
      url: '/pages/travel/search/search',
    })
  },
  showCar: function () {
    this.setData({
      carName: app.globalData.carInfo.fctName + app.globalData.carInfo.brName + "(" + app.globalData.carInfo.year + ")" + app.globalData.carInfo.cc,
    })
  },
  imgs:function(){
    wx.navigateTo({
      url: '/pages/suber/goods/goods?id='+this.data.img.adUrl,
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
  vip: function () {
    // if (app.globalData.tenantId  == "" && app.globalData.kmUserInfo ==null ) {
    //   wx.showToast({
    //     title: "您不是会员分享进入",
    //     icon: "none"
    //   })
    // }
    // if (app.globalData.tenantId != "" ) {
    //     wx.navigateTo({
    //       url: '/pages/thesuper/thesuper'
    //     });
    // }
    // if (app.globalData.kmUserInfo != null){
    wx.switchTab({
        url: '/pages/thesuper/thesuper'
      });
    // }
  },
  shops:function(){
    wx.switchTab({
      url: '/pages/suber/shops/shops'
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    // this.repairsRequest();
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
    var page = that.data.page+1
    that.setData({
      isHideLoadMore: false,
      page:page
    });
    setTimeout(function () {
      that.circuit()
    }, 600)
    setTimeout(() => {
      that.setData({
        isHideLoadMore: true,
      })
    }, 1000)
  },
  //根据openid获取用户信息
  userInfoReRequest: function () {
    var that = this;
    util.kmRequest({
      url: loginVipByOpenIdUrl,
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
    wx.removeStorage({
      key: document,
      success(res) {
        console.log(res.data)
      }
    })
    wx.removeStorage({
      key: visitorinformation,
      success(res) {
        console.log(res.data)
      }
    })
    if (app.globalData.userInfo != null && app.globalData.kmUserInfo != null) {
      this.updateUserRequest(app.globalData.kmUserInfo.id)
    }
    if (app.globalData.carInfo != null){
      this.showCar();
    }
    if (app.globalData.cityName != null) {
      this.setData({
        city: app.globalData.cityName
      })
      if (app.globalData.cityCode != null && app.globalData.locationInfo != null){
        this.repairsRequest();
      }
    }
    if (app.globalData.openid != null){
      this.userInfoReRequest();
    }
  },
  onLoad: function (options) {
    this.setData({
      page: 0,
    })
    this.getOpenId();
    this.newVersion();
    if (options.scene != null){
      var scene = decodeURIComponent(options.scene);
      // var scene = 1
      util.kmRequest({
        url: getTenantInfoByTenantIdUrl,
        data:{
          tenantId: scene,
        },
        success:function(res){
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          var tenantNo = list.tenantNo
          app.globalData.tenantId = scene;
          app.globalData.tenantNo = tenantNo;
        }
      })
     
      // console.log('scene:' + scene);
      // var index = scene.indexOf('_');
      // app.globalData.tenantId = scene.substring(0, index);
      // app.globalData.tenantId = 1;
    console.log(app.globalData.tenantId)
    console.log(app.globalData.tenantNo)
      // app.globalData.tenantNo = scene.substring(index + 1);
      // console.log('scenetenantId:' + app.globalData.tenantId);
      // console.log('scenetenantNo:' + app.globalData.kmUserInfo.tenantNo);
    }
    if (options.tenantId != null) {
      console.log('tenantId:' + options.tenantId);
      app.globalData.tenantId = options.tenantId;
    }
    if (options.tenantNo != null) {
      console.log('tenantNo:' + options.tenantNo);
      app.globalData.tenantNo = options.tenantNo;
    }
    this.adsRequest();
    this.picture();
    this.circuit()
    this.pop()
    // this.getLocation();
    // if (wx.openBluetoothAdapter) {
    //   wx.openBluetoothAdapter()
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
    //   })
    // }
    // wx.redirectTo({
    //   url: '/pages/repairshops/detail/repairdetail'
    // });
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
          success: function (res) {
            if (res.confirm) {
              // var qrPath = null;
              // try {
              //   qrPath = wx.getStorageSync(config.qrFilePath);
              //   if (qrPath != null) {
              //     qrPath = wx.removeStorageSync(config.qrFilePath);
              //   }
              //   console.log(qrPath);
              // } catch (e) {
              //   console.log(e);
              // } 
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
  // positionRequest:function(lon, lat){//经度，维度
  //   var that = this;
  //   var province = '山西省';
  //   var city = '太原市';
  //   util.kmRequest({
  //     url: gaodeRegeoUrl + lon + ',' + lat,
  //     data: {},
  //     success: function (res) {
  //       if (res.data.status == 1){
  //         //province citycode city district
  //         app.globalData.addressComponent = res.data.regeocode.addressComponent;
          
  //         province = res.data.regeocode.addressComponent.province;
  //         city = res.data.regeocode.addressComponent.city;

  //         // that.cityCodeRequest();
  //       }
  //     }
  //   })
  // },
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
    wx.navigateTo({
      url: '/pages/address/province/provincelist?goodsId=' + '1'
    });
  },
  adsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type:1
      },
      success: function (res) {
        console.log(JSON.parse(res.data.data))
        if (res.data.status == 1) {
          that.setData({
            adsList: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  picture:function(){
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type: 3
      },
      success: function (res) {
        console.log(JSON.parse(res.data.data)[0])
        if (res.data.status == 1) {
          that.setData({
            img: JSON.parse(res.data.data)[0]
            
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
      // if (app.globalData.tenantId == "" && app.globalData.kmUserInfo == null) {
      //   wx.showToast({
      //     title: "您不是会员分享进入",
      //     icon: "none"
      //   })
      // }
      // if (app.globalData.tenantId != "") {
      //   wx.navigateTo({
      //     url: '/pages/repairshops/detail/repairdetail?goodsId=' + '2'
      //   });
      // }
      // if (app.globalData.kmUserInfo != null) {
        wx.navigateTo({
          url: '/pages/repairshops/detail/repairdetail?goodsId=' + '2'
        });
      // }
    
  },
  selectMyCar: function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/cars/carselect/fct/fctlist'
    });
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
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)){
      tenantId = app.globalData.kmUserInfo.tenantId;
      tenantNo = app.globalData.kmUserInfo.userNo;
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  },
})

