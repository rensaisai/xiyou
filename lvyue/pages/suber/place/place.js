const config = require('../../../config.js')
var util = require('../../../utils/util.js')
const saveAppScOrderUrl = config.saveAppScOrderUrl
const getPayWaysUrl = config.getPayWaysUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
const isExistPayPassWordUrl = config.isExistPayPassWordUrl
const verifyPayPassWordUrl = config.verifyPayPassWordUrl
const balancePayUrl = config.balancePayUrl
const isRunUrl = config.isRunUrl
const saveAppRunTimeOrderUrl = config.saveAppRunTimeOrderUrl
const saveAppGoodsNumGoodsUrl = config.saveAppGoodsNumGoodsUrl
// const isExistByNumberUrl = config.isExistByNumberUrl
// const getTenantInfoByTenantIdUrl = config.getTenantInfoByTenantIdUrl
const getUserAllMailingAddressUrl = config.getUserAllMailingAddressUrl
// const isMemberUrl = config.isMemberUrl
var app = getApp()
console.log(app)

Page({
  data: {
    checked:true,
    active:false,
    title: '确认付款',
    length: 6,
    isFocus: true,
    value: '',
    showModalStatus: false,//是否显示
    site:null,
    loading:false,
    runType:'',
    runTimeId:'',
    pays: [
      { value: 'wxpay', name: '微信', checked: 'true' }
    ],
    order:null,
    orderid:'',
    address:'',
    sendType: null,
    goodsdard: null,
    goodsprice: 0,
    goodsName: '',
    subtotal: '',
    supplier: '',
    num: 1,
    pay: 0,
    coupon: 0,
    goodsid:'',
    disabled:false,
    actives:true,
    active1:true,
    select:true,
    payType:'',
    payWayValue:1,
  },
  focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue.length == 6) {
      that.setData({
        active: true,
        isFocus: false,
      })
    } else {
      that.setData({
        active: false,
        isFocus: true
      })
    }
    that.setData({
      value: inputValue,
    })
  },
  tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  commitOrder: function (e) {
    var that = this;
    if ((that.data.site == undefined) || (that.data.site.province == '')){
      wx.showToast({
        title: '请添加收货地址',
        icon: "none"
      })
      return
    }
    if (that.data.runType != ''){
      if (that.data.runType == 1){
        var data = {
          goodsId: that.data.goodsid,
          runType: that.data.runType,
          runTimeId: that.data.runTimeId
        }
      }else{
        var data = {
          goodsId: that.data.goodsid,
          runType: that.data.runType
        }
      }
      util.kmRequest({
        url: isRunUrl,
        data:data,
        success:(res)=>{
          if(res.data.status == 1){
            if (that.data.runType == 1){
              util.kmRequest({
                url: saveAppRunTimeOrderUrl,
                data:{
                  userId: app.globalData.kmUserInfo.id,
                  userAddress: that.data.site.id,
                  goodsId: that.data.goodsid,
                  skuId: that.data.sendType.skuId,
                  goodsNum: that.data.num,
                  buyType:1,
                  orderSource: 'app',
                  price: that.data.sendType.memberPrice,
                  runTimeId: that.data.runTimeId
                },
                method:"post",
                success:(res)=>{
                  if (res.data.status == 1) {
                    var order = JSON.parse(res.data.data)[0]
                    that.payment(order.payType, order.id)
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                    })
                    that.setData({
                      loading: false
                    })
                  }
                }
              })
            }else{
              util.kmRequest({
                url: saveAppGoodsNumGoodsUrl,
                data: {
                  userId: app.globalData.kmUserInfo.id,
                  userAddress: that.data.site.id,
                  goodsId: that.data.goodsid,
                  skuId: that.data.sendType.skuId,
                  goodsNum: that.data.num,
                  buyType: 1,
                  orderSource: 'app',
                  price: that.data.sendType.memberPrice
                },
                method: "post",
                success: (res) => {
                  if (res.data.status == 1) {
                    var order = JSON.parse(res.data.data)[0]
                    that.payment(order.payType, order.id)
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                    })
                    that.setData({
                      loading: false
                    })
                  }
                }
              })
            }
          }else{
            wx.showToast({
              title: '活动已结束',
              icon:'none'
            })
          }
        }
      })
    }else{
      util.kmRequest({
        url: saveAppScOrderUrl,
        data: {
          cashAmount: that.data.pay,
          price: that.data.sendType.memberPrice,
          userAddress: that.data.site.id,
          goodsId: that.data.goodsid,
          skuId: that.data.sendType.skuId,
          phone: that.data.site.phone,
          openId: app.globalData.openid,
          userName: that.data.site.receiver,
          orderSource: 'app',
          buyType: 1,
          orderType: 5,
          userId: app.globalData.kmUserInfo.id,
          coupon: that.data.coupon,
          orderAmount: that.data.sendType.fansPrice,
          goodsNum: that.data.num,
          isDefault: that.data.site.isDefault,
          isApp: app.globalData.kmUserInfo.isApp
        },
        method: "post",
        success(res) {
          if (res.data.status == 1) {
            var order = JSON.parse(res.data.data)[0]
            console.log(order)
            that.payment(order.payType,order.id)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
            })
            that.setData({
              loading: false,
            })
          }
        }
      })
    }
  },
  payment(payType,id){
    console.log(payType, id)
    var that = this
    if (app.globalData.kmUserInfo.appBalance >= that.data.pay) {
      var active1 = true
    } else {
      var active1 = false;
    }
    if (payType == 0 || payType == 1){
      var payWayValue = 1
      var select = true
    } else if (payType == 2){
      var payWayValue = 2
      var select = false
    }
    that.setData({
      payType: payType,
      payWayValue: payWayValue,
      active1: active1,
      select: select,
      orderid:id,
      checked:true
    })
    that.showModal()
  },
  select(e){
   var that = this
    if (e.currentTarget.dataset.text === "weixin" ){
       that.setData({
         select:true,
         payWayValue:1
       })
    } else if (e.currentTarget.dataset.text === "yve" && that.data.active1 == true ){
      that.setData({
        select: false,
        payWayValue: 2
      })
    }
  },
  forget(){
    wx.navigateTo({
      url: '/pages/user/patcode/paycode'
    })
  },
  button(){
   var that = this
    if (that.data.payWayValue == 1 && that.data.actives == true && that.data.select == true){
      that.wxPreOrder(that.data.orderid)
      that.setData({
        loading: true
      })
    } else if (that.data.payWayValue == 2 && that.data.active1 == true && that.data.select == false){
      that.balance()
      that.setData({
        loading: true
      })
    } else if (that.data.payType == 2 && that.data.active1 == false){
      wx.showToast({
        title: '余额不足',
        icon:'none'
      })
    }
  },
  balance(){
    var that = this
    util.kmRequest({
      url: isExistPayPassWordUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          that.setData({
            checked: false,
            title:'输入密码'
          })
        }else if(res.data.status == 0){
          wx.showModal({
            title: '请先设置支付密码',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/patcode/paycode'
                })
              } 
            }
          })
        }
      }
    })
  },
  paybalance(){
    var that =this
    if (that.data.value == '' && that.data.value.length != 6){
      wx.showToast({
        title: '请输入支付密码',
        icon:'none'
      })
      return
    }
    util.kmRequest({
      url: verifyPayPassWordUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        passWord:that.data.value
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          util.kmRequest({
            url:balancePayUrl,
            data:{
              orderId: that.data.orderid
            },
            method:"post",
            success(res){
              if(res.data.status == 1){
                wx.redirectTo({
                  url:'/pages/payment/payment?price='+that.data.pay
                })
              }else{
                setTimeout(()=>{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                },400)
              }
            }
          })
        }else{
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }, 400)
        }
      }
    })
  },
  wxPreOrder(orderid){
    var that = this
    var data = {
      openId: app.globalData.openid,
      orderId: orderid,
      ip: '127.0.0.1',
    }
    util.kmRequest({
      url: wxCreateOrderUrl,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          var order = JSON.parse(res.data.data)
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  wxPay: function (data) {
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        if (res.errMsg == 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/payment/payment?price=' + that.data.pay
          })
        } else {
          setTimeout(()=>{
            wx.showToast({
              title: res.errMsg,
              icon: "none"
            })
          },200)
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          res.errMsg = "取消支付";
        }
        that.setData({
          loading: false
        })
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
 
  location:function(){
    var that = this
    util.kmRequest({
      url: getUserAllMailingAddressUrl,
      data:{
        userId:app.globalData.kmUserInfo.id,
      },
      success:function(res){
        if(res.data.status == 1){
          var site = JSON.parse(res.data.data)
          console.log(site)
          for(var i=0; i<site.length; i++){
            if (site[i].isDefault == 1){
              var sites = site[i]
            } else if (site != [] && site[i].isDefault != 1){
              var sites=site[0]
            }
          }
          that.setData({
            site:sites,
            address: sites.province+sites.city+sites.town+sites.detailAddress
          })
        }
      }
    })
  },
  //显示对话框
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
  hide(){
    this.hideModal()
  },
  sitels:function(){
    var that = this
    wx.navigateTo({
      url: '/pages/user/addre/addre'
    })
  },
  sitel:function(){
    var that = this
    var sendType = JSON.stringify(that.data.sendType)
    wx.navigateTo({
      url:'/pages/user/location/location'
    })
  },
  onLoad: function (options) {
    var data =JSON.parse(options.data)
    console.log(data)
    var num = data.num
    var price = data.price
    var coupon = app.globalData.kmUserInfo.coupon
    var subtotal = (price * num).toFixed(2)
    if (data.goodsdetails.couponPrice != undefined){
      if (coupon > data.goodsdetails.couponPrice) {
        var pay = ((price * num) - data.goodsdetails.couponPrice).toFixed(2)
        var bean = data.goodsdetails.couponPrice
      } else {
        var bean = coupon
        var pay = ((price * num) - bean).toFixed(2)
      }
    }else{
      var bean = 0
      var pay = price * num
    }
    this.setData({
      runType: options.runType,
      runTimeId: options.runTimeId,
      sendType: data.goodsdetails,
      goodsdard:data.goodsdard,
      goodsprice:price,
      goodsName: data.goodsName,
      subtotal: subtotal,
      supplier: data.supplier,
      num:num,
      pay:pay,
      goodsid:data.goodsid,
      coupon: bean
    })
  },
  onShow: function () {
    this.location();
    this.setData({
      loading:false
    })
  },
})

