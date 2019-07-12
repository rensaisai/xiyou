const config = require('../../../../config')
const getUserStatisticsByUserIdUrl = config.getUserStatisticsByUserIdUrl
const isExistByNumberUrl = config.isExistByNumberUrl
const getTenantInfoByTenantIdUrl = config.getTenantInfoByTenantIdUrl
const isMemberUrl = config.isMemberUrl
const getProvicesUrl = config.getProvicesUrl
const getCitiesUrl = config.getCitiesUrl
const getCountiesUrl = config.getCountiesUrl
const checkInviteCodeUrl = config.checkInviteCodeUrl
var app = getApp()
console.log(app)
var util = require('../../../../utils/util')

Page({
  data: {
    selec: '请选择省市区',
    // region: ['请选择省市区'],
    showModalStatus: false,//是否显示
    city: null,
    citys: null,
    citysel:null,
    cityName: null,
    cityCode: null,
    datadel: null,
    citylse: true,
    cityls:false,
    cityl:false,
    entity: null,
    setmeal: null,
    commission: 0,
    bean: 0,
    hide:false,
    perdue:false,
    loading:false,
    pays: [
      { value: 'wxpay', name: '微信', checked: 'true' }
    ],
    payType: 'kmPay',
    senders: [
      { value: '1', name: '快递', checked: 'true' },
      { value: '2', name: '门店自取' }
    ],
    sendersl:[
      { value: '2', name: '门店自取', checked: 'true'}
    ],
    sendType:'1',
    name:'',
    address:'',
    phone:'',
    lat:'',
    lon:'',
    tenantNo:'',
    notEditTenantNo:true,
    notEdit:false
  },
  commitOrder: function (e) {
    var that = this;
    var user = that.data.entity
    var list = this.data.selec
    var listl = '请选择省市区'
    if (user.id == 1){
      var value = this.data.sendersl[0].value
      console.log(value)
    }else{
      var value = this.data.sendType
    }
    var err = '';
    if (e.detail.value.phone.length == 0) {
      err = '请输入手机号';
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '手机号格式错误';
    } else if (e.detail.value.name.length == 0) {
      err = '请输入姓名';
    } else if (e.detail.value.ancestor.length == 0) {
      err = '请输入推荐人编码';
    } else if (list == listl &&  value != 2) {
      err = '请选择省市区';
    }else if (e.detail.value.address.length == 0) {
      err = '请输入地址';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    that.setData({
      loading: true
    })
    var payType = 0;//wxpay
    var urlPayType = 4;//3余额或车豆 4微信
    var payAmount = this.data.entity.price;
    if (this.data.payType == 'kmpay') {
      payType = 2;
      urlPayType = 3;
      var value = parseFloat(this.data.entity.price) - parseFloat(this.data.commission);
      if (value > 0) {
        payAmount = this.data.commission;
      }
    } else if (this.data.payType == 'kmpay_bean') {
      payType = 3;
      urlPayType = 3;
      var value = parseFloat(this.data.entity.price) - parseFloat(this.data.bean);
      if (value > 0) {
        payAmount = this.data.bean;
      }
    }
    if(list == listl){
      var address="";
       this.setData({
         selec:''
       })
    }else{
      var address = this.data.selec;
      // var ress = address.join("");
      // console.log(ress)
    }
    var add = e.detail.value.address
    if (this.data.sendType == 1){
      var adds = address+add
    } else if (this.data.sendType == 2){
      var adds = add
    }
    if(app.globalData.kmUserInfo != null){
      var id = app.globalData.kmUserInfo.id
    }else{
      var id=''
    }
    var data = {
      orderAmount: this.data.entity.memberPrice,
      cashAmount: this.data.entity.memberPrice,
      tenantId: app.globalData.tenantId,
      goodsId: this.data.entity.id,
      skuId: this.data.setmeal,
      goodsNum: 1,
      address: adds,
      phone: e.detail.value.phone,
      userName: e.detail.value.name,
      ancestorNo: e.detail.value.ancestor,
      buyType: this.data.sendType,
      openId: app.globalData.openid,
      payType: '0', //0微信 1支付宝 2佣金 3车豆
      // payAmount: payAmount,
      // userId:id,
      orderSource:'wx',
      orderType:'0',
      region: this.data.cityCode,
      isDefault:'0',
      price: this.data.entity.memberPrice,
      userId:id,
      // regionCode:
    } 
    console.log(data);
    console.log(this.data.setmeal.skuId)
    urlPayType = 2
    var ancestor = e.detail.value.ancestor;
    console.log(ancestor);
    var phone = e.detail.value.phone
    console.log(phone)
      util.kmRequest({
        url: isMemberUrl,
        data: {
          phone: phone
        },
        success: function (res) {
          console.log(222222222)
          if (res.data.status == 1) {
            util.kmRequest({
              url: isExistByNumberUrl,
              data: {
                number: ancestor,
              },
              success: function (res) {
                if (res.data.status == 1) {
                  var list = JSON.parse(res.data.data)
                  console.log(list)
                  var sid = list[0].xyTenant.id
                    wx.navigateTo({
                      url: '/pages/pay/payment/payment?paytype=' + urlPayType + "&orderdata=" + JSON.stringify(data) + "&sid=" + sid
                    });
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: "none"
                  })
                  that.setData({
                    loading: false
                  })
                }
              }
            })
          }
          if (res.data.status == 3) {
            wx.showToast({
              title: '该手机号已购买过商品，请切换手机号',
              icon: 'none'
            })
            that.setData({
              loading: false
            })
          }
        }
      })
  },
  dataRequest: function () {
    var that = this;
    util.kmRequest({
      url: getProvicesUrl,
      data: {
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            city: JSON.parse(res.data.data),
          });
        }
      },
    })
  },
  Request: function () {
    var that = this;
    util.kmRequest({
      url: getCitiesUrl,
      data: {
        proviceCode: this.data.tItem
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            citys: JSON.parse(res.data.data)
          });
        }
      },
    })
  },
  county:function(){
    var that = this
    util.kmRequest({
      url: getCountiesUrl,
      data:{
        cityCode: that.data.cityCode
      },
      success:function(res){
        if(res.data.status == 1){
          that.setData({
            citysel:JSON.parse(res.data.data)
          })
        }
      }
    })
  },
  selectOver: function (event) {
    var selectItem = this.data.city[event.currentTarget.dataset.index];
    console.log(selectItem)
    var selec = selectItem.regionName;
    console.log(selec)
    var tItem = selectItem.areaLevel;
    console.log(tItem)
    var citylse = this.data.citylse
    this.setData({
      selec: selec,
      tItem: tItem,
      citylse: false,
      cityls:true,
      cityl:false
    })
    this.Request()
  },
  selectOverss: function (event) {
    var selectItems = this.data.citys[event.currentTarget.dataset.index];
    console.log(selectItems)
    var cityName = selectItems.regionName;
    console.log(cityName)
    var cityCode = selectItems.areaLevel;
    console.log(cityCode)
    var selecs = this.data.selec
    var selecd = selecs + cityName
    this.setData({
      selec: selecd,
      cityName: cityName,
      cityCode: cityCode,
      citylse: false,
      cityls: false,
      cityl:true,
    })
    this.county()
  },
  selectOvercity: function (event){
    var selectItems = this.data.citysel[event.currentTarget.dataset.index];
    console.log(selectItems)
    var cityName = selectItems.regionName;
    console.log(cityName)
    var cityCode = selectItems.areaLevel;
    console.log(cityCode)
    var selecs = this.data.selec
    var selecd = selecs + cityName
    this.setData({
      selec: selecd,
      cityName: cityName,
      cityCode: cityCode,
      citylse: false,
      cityls: false,
      cityl: false,
    })
    this.hideModal()
  },
  resgiter: function () {
    this.showModal()
    this.dataRequest()
    this.setData({
      citylse: true,
      cityls: false,
      cityl: false,
    })
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
  coding:function (e) {
    var that=this
    var num = e.detail.value
    this.setData({
         tenantNo: num
          })
    // util.kmRequest({
    //   url: checkInviteCodeUrl,
    //   data:{
    //     inviteCode: num
    //   },
    //   success:function(res){
    //     console.log(res.data)
    //     if(res.data.status==1){
    //       
    //     }else{
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: "none"
    //       })
    //     }
    //   }
    // })
    
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getUserStatisticsByUserIdUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        isVip: app.globalData.kmUserInfo.isVip
      },
      success: function (res) {
        if (res.data.status == 1) {
          var statistics = JSON.parse(res.data.data)[0];
          var pays = that.data.pays;
          // if (statistics.amount > 0){
          //   pays.push({ value: 'kmpay', name: '余额' });
          // }
          // if (statistics.bean > 0) {
          //   pays.push({ value: 'kmpay_bean', name: '车豆' });
          // }
          that.setData({
            // commission: statistics.coupon,
            // bean: statistics.coupon,
            pays:pays
          });
        }
      }
    })
  },
 
  recommend:function(){
    if (app.globalData.tenantId==''){
      this.setData({
        notEditTenantNo: false
      })
    }
  },
  onLoad: function (options){
    var sendType = this.data.sendType
    this.setData({
      sendType:1,
    })
    this.recommend();
    var entity = options.entity;
    console.log(entity)
    var setmeal = options.setmeal;
    console.log(setmeal)
    this.setData({
      setmeal: setmeal
    })
    console.log(setmeal);
    if (entity != null) {
      this.setData({
        entity: JSON.parse(entity)
      })
    };
    if (setmeal != null) {
      this.setData({
        setmeal: JSON.parse(setmeal)
      });
    };    
    if (app.globalData.kmUserInfo != null){
      this.userStatisticsRequest();
      this.setData({
        name: app.globalData.kmUserInfo.userName,
        // address: app.globalData.kmUserInfo.address,
        phone: app.globalData.kmUserInfo.phone
      });
    }
    if (app.globalData.tenantId != ''){
      this.setData({
        notEditTenantNo: true
      });
      this.setData({
        tenantNo: app.globalData.tenantNo,
      });
    }
    if (app.globalData.kmUserInfo != null){
      if (app.globalData.kmUserInfo.inviteCode != '' && app.globalData.kmUserInfo.inviteCode != undefined){
      this.setData({
        notEditTenantNo: true
      });
      this.setData({
        tenantNo: app.globalData.kmUserInfo.inviteCode
      })
    }
    }
    if (app.globalData.kmUserInfo != null) {
      if (app.globalData.kmUserInfo.tenantNo != '' && app.globalData.kmUserInfo.tenantNo != undefined) {
        this.setData({
          notEditTenantNo: true
        });
        this.setData({
          tenantNo: app.globalData.kmUserInfo.tenantNo
        })
      }
    }

  },
  onShow:function(){
    var that = this
      // var phone = this.data.phone;
      // var name = this.data.name;
      // var address = this.data.address
    // if (this.data.selec == '请选择省市区'){
    //   var selects = '请选择省市区'
    // }else{
    //   var selects = this.data.selec
    // }
    var user = this.data.entity
    if (user.id == 1 && app.globalData.kmUserInfo != null){
      if (app.globalData.tenantId != ''){
        var tenantId = app.globalData.tenantId;
      }else{
        var tenantId = app.globalData.kmUserInfo.tenantId;
      }
     
      util.kmRequest({
        url: getTenantInfoByTenantIdUrl,
        data: {
          tenantId: tenantId
        },
        success: function (res) {
          var listsm = JSON.parse(res.data.data)
          console.log(listsm)
          var address = listsm[0].address
          that.setData({
            address: address,
            notEdit: true,
            perdue: true
          })
        }
      })
    }
      that.setData({
        selec: '请选择省市区',
        loading: false,
      })
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
    }.bind(this), 200)
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
    }.bind(this), 200)
  },
  radioChange: function (e) {
    var pays = this.data.pays;
    for (var i = 0, len = pays.length; i < len; ++i) {
      pays[i].checked = pays[i].value == e.detail.value
    }
    this.setData({
      pays: pays,
      payType: e.detail.value
    });
  },
  radioChange2: function (e) {
    var that = this
    var senders = that.data.senders;
    var tenantNo = that.data.tenantNo
    for (var i = 0, len = senders.length; i < len; ++i) {
      senders[i].checked = senders[i].value == e.detail.value
    }
    that.setData({
      senders: senders,
      sendType: e.detail.value,
      perdue:false
    });
    if (app.globalData.tenantId != '' && e.detail.value == 2){
      var tenantId = app.globalData.tenantId;
       util.kmRequest({
         url: getTenantInfoByTenantIdUrl,
         data:{
           tenantId: tenantId
         }, 
         success:function(res){
           var listsm=JSON.parse(res.data.data)
           console.log(listsm)
           var address = listsm[0].address
           that.setData({
             address: address,
             notEdit: true,
             perdue:true
           })
         }
       })
    }else{
      that.setData({
        address: '',
        notEdit: false,
        perdue: false
      })
    }
    if (e.detail.value == 2 && app.globalData.tenantId == ''){
      util.kmRequest({
        url: isExistByNumberUrl,
        data: {
          number: tenantNo
        },
        success: function (res) { 
          if (res.data.status == 1) {
            var site = JSON.parse(res.data.data)
            console.log(site)
            var address = site[0].xyTenant.address
            console.log(address)
            var cityCode = site[0].xyTenant.city
            that.setData({
              address: address,
              notEdit: true,
              perdue: true,
              selec: '请选择省市区',
              cityCode: cityCode
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
    }else{
      that.setData({
        address: '',
        notEdit: false,
        perdue: false,
         selec: '请选择省市区'
      })
    }
   
  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          address: res.address,
          lat: res.latitude,
          lon: res.longitude
        })
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }

})

