const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getPayWaysUrl = config.getPayWaysUrl
const getToursInfoUrl = config.getToursInfoUrl
const getTouristAdditionalUrl = config.getTouristAdditionalUrl
const getTenantAddressAndPhoneUrl = config.getTenantAddressAndPhoneUrl
const saveTouristOrderUrl = config.saveTouristOrderUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
const isExistPayPassWordUrl = config.isExistPayPassWordUrl
const verifyPayPassWordUrl = config.verifyPayPassWordUrl
const balancePayUrl = config.balancePayUrl
// const document = config.document
// const visitorinformation = config.visitorinformation
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:'',
    order:null,
    checked: true,
    active: false,
    title: '确认付款',
    length: 6,
    isFocus: true,
    value: '',
    showModalStatus: false,//是否显示
    type:'',
    quantum:'', 
  introduce:null,
  schedule:null,
  addition:null,
  travelid: '',
  listbox: null,
  shop:null,
  loading:false
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
  details(id){
    var that = this
    util.kmRequest({
      url: getToursInfoUrl,
      data:{
        id:id
      },
      success:function(res){
      if(res.data.status == 1){
        var list = JSON.parse(res.data.data)
        that.setData({
          introduce: list[0].toursList[0]
        })
      }
      }
    })
  },
  addition(id){
  var that = this
   util.kmRequest({
     url: getTouristAdditionalUrl,
     data:{
       touristId:id
     },
     method: 'post',
     success:function(res){
       console.log(res.data)
       if(res.data.status == 1){
         var addition = JSON.parse(res.data.data)
         console.log(addition)
         for (var i = 0; i < addition.length; i++){
           addition[i].num = 1
           addition[i].cost = addition[i].price
         }
       } else if (res.data.status == 6){
         var addition = null
       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
       }
       that.setData({
         addition: addition
       })
       that.price()
     }
   })
  },
  add(e){
    var that = this
    var addition = that.data.addition
    var list = addition[e.currentTarget.dataset.index]
    console.log(list)
    for (var i = 0; i < addition.length; i++){
      if (addition[i].id == list.id){
        addition[i].num = addition[i].num+1
        addition[i].cost = addition[i].price * addition[i].num 
        that.setData({
          addition: addition
        })
        that.price()
      }
    }
  },
  subtract(e){
    var that = this
    var addition = that.data.addition
    var list = addition[e.currentTarget.dataset.index]
    for (var i = 0; i < addition.length; i++) {
      if (addition[i].id == list.id) {
        if (addition[i].num <=1){
          addition[i].num = 1
          addition[i].cost = addition[i].price * addition[i].num 
          that.setData({
            addition: addition
          })
          that.price()
        }else{
          addition[i].num = addition[i].num -1
          addition[i].cost = addition[i].price * addition[i].num 
            that.setData({
              addition: addition
            })
          that.price()
        }
      }
    }
  },
  selecttourism(){
    wx.navigateTo({
        url: '/pages/line/select/select'
    })
  },
  shop() {
    var that = this
    util.kmRequest({
      url: getTenantAddressAndPhoneUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var shop = JSON.parse(res.data.data)
          that.setData({
            shop: shop
          })
        }
      }
    })
  },
  phone(){
    var shops = this.data.shop[0].phone
    wx.makePhoneCall({
      phoneNumber: shops,
      success: function () {
        console.log("成功拨打电话")
      }
    })
  },
  formSubmit(e){
  var that = this
  var travelids = that.data.travelid
  console.log(e)
  var err = ''
  if (e.detail.value.name.length == 0){
    err = "请填写联系人姓名"
  } else if (e.detail.value.phone.length == 0){
    err = "请填写联系人手机号"
  } else if (travelids.length == '') {
    err = '请选择出游人'
  }else if (!util.checkPhone(e.detail.value.phone)) {
    err = '联系人手机号格式有误'
  }
  if(err.length >0 ){
    wx.showToast({
      title: err,
      icon: 'none'
    })
    return
  }
  var schedule = that.data.schedule
  var shops = that.data.shop[0]
  var arr=[]
  var additions = that.data.addition
  if (additions != undefined){
    for (var i = 0; i < additions.length; i++) {
      var additionalId = additions[i].id
      var price = additions[i].cost
      var num = additions[i].num
      arr.push({ additionalId, price, num })
    }  
    var arrs = JSON.stringify(arr)
  }else{
    var arrs = ''
  }
    if (e.detail.value.goflight.length != 0 && e.detail.value.getflight.length != 0){
      var go=e.detail.value.gotime +'-' + e.detail.value.goflight
    }else{
      var go = ''+'-'+''
    }
    if (e.detail.value.gotime.length != 0 || e.detail.value.gettime.length != 0){
      var gets = e.detail.value.gettime + '-' + e.detail.value.getflight
    }else{
      var gets = '' + '-' + ''
    }
    if (e.detail.value.remark.length != 0){
      var remark = e.detail.value.remark
    }else{
      var remark = ''
    }
  util.kmRequest({
    url: saveTouristOrderUrl,
    data:{
      userId: app.globalData.kmUserInfo.id,
      price: schedule.price,
      adultNum: schedule.adultnum,
      childrenNum: schedule.childrennum,
      phone: e.detail.value.phone,
      userName: e.detail.value.name,
      remarks: remark,
      tenantId: shops.id,
      adultPrice: schedule.adultprice,
      childrenPrice: schedule.childprice,
      adultOnePrice: schedule.nowPrice,
      userTouristStr: travelids,
      tripCarNo: go,
      couponPrice: schedule.deduction,
      returnTripCarNo:gets,
      touristId: schedule.touristId,
      scheduleId: schedule.id,
      additionalMap: arrs
    },
    method:'post',
    success:function(res){
      console.log(res.data)
      if(res.data.status == 1){
        var order = JSON.parse(res.data.data)[0]
        that.payment(order.id)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
        that.setData({
          loading:false
        })
      }
    }
  })
  },
  payment(orderid) {
    var that = this
    util.kmRequest({
      url: getPayWaysUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        orderId: orderid
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          var order = JSON.parse(res.data.data)
          order.forEach(i => {
            if (i.balance != undefined) {
              i.balance = '(' + '￥' + i.balance + ')'
            }
            if (i.status == 1) {
              i.active = true
            }
            if (i.payWayValue == "微信支付") {
              i.select = true
            } else {
              i.select = false
            }
          })
          that.showModal()
          that.setData({
            order: order,
            orderid: orderid,
            checked: true
          })
        }
      }
    })
  },
  select(e) {
    var that = this
    var order = that.data.order
    var sele = that.data.order[e.currentTarget.dataset.index]
    if (sele.status == 1 && sele.select == false) {
      order.forEach(i => {
        i.select = false
        if (i.payWayValue == sele.payWayValue) {
          i.select = true
        }
      })
      that.setData({
        order: order
      })
    }
  },
  button() {
    var that = this
    var order = that.data.order
    that.setData({
      loading: true
    })
    order.forEach(i => {
      if (i.active == true && i.select == true) {
        if (i.payWayValue == '微信支付') {
          that.wxPreOrder(that.data.orderid)
        } else if (i.payWayValue == '余额支付') {
          that.setData({
            loading: false
          })
          that.balance()
        }
      }
    })
  },
  balance() {
    var that = this
    util.kmRequest({
      url: isExistPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            checked: false,
            title: '输入密码'
          })
        } else if (res.data.status == 0) {
          wx.showModal({
            title: '请先设置支付密码',
            showCancel: false,
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
  forget() {
    wx.navigateTo({
      url: '/pages/user/patcode/paycode'
    })
  },
  paybalance() {
    var that = this
    if (that.data.value == '' && that.data.value.length != 6) {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none'
      })
      return
    }
    util.kmRequest({
      url: verifyPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        passWord: that.data.value
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          util.kmRequest({
            url: balancePayUrl,
            data: {
              orderId: that.data.orderid
            },
            method: "post",
            success(res) {
              if (res.data.status == 1) {
                wx.redirectTo({
                  url: '/pages/payment/payment?price=' + that.data.schedule.price
                })
              } else {
                setTimeout(() => {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }, 400)
              }
            }
          })
        } else {
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
   var data={
     openId: app.globalData.openid,
     orderId: orderid,
     ip: '127.0.0.1',
     source: 'wx'
   }
   util.kmRequest({
     url: wxCreateOrderUrl,
     data:data,
     success:function(res){
       if(res.data.status == 1){
         var order = JSON.parse(res.data.data)
         console.log(order)
         that.wxPay(JSON.parse(res.data.data)[0]);
       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
       }
     }
   })
  },
  wxPay: function (data) {
    var that = this;
    console.log(data)
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
            url: '/pages/payment/payment?price=' + that.data.schedule.price
          })
        } else {
          setTimeout(()=>{
            wx.showToast({
              title: res.errMsg,
              icon: "none"
            })
          },400)
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
  showSuccess: function () {
    wx.reLaunch({
      url: '/pages/travel/payment/payment?price=' + this.data.schedule.price 
    });
  },
  price(){
    var that = this
    var addition = that.data.addition
    var additionprice=0
    if (addition != undefined){
      for (var i = 0; i < addition.length; i++) {
        additionprice += addition[i].price * addition[i].num
      }
    }else{
  
    }
    that.setData({
      addition: addition
    })
    var schedule = that.data.schedule
    var gold = app.globalData.kmUserInfo.coupon//实际金币
    var type = that.data.type
    if(type == 0){
      var availablegold = schedule.couponPrice//一人可抵用金币
      var total = availablegold * schedule.adultnum//多个人可抵用的金币
      schedule.adultprice = schedule.nowPrice * schedule.adultnum//成人价
      schedule.childprice = schedule.childrenPrice * schedule.childrennum//儿童价
      if (gold > total) {
        var expense = schedule.adultprice - total
        schedule.price = expense + schedule.childprice + additionprice
        schedule.deduction = total
      } else if (gold <= total) {
        var expense = schedule.adultprice - gold
        schedule.price = expense + schedule.childprice + additionprice
        schedule.deduction = gold
      }
    }
    if (type == 1 && app.globalData.kmUserInfo.isApp <= 1){
      schedule.adultprice = schedule.noMemberPrice * schedule.adultnum//成人价
      schedule.childprice = schedule.childrenPrice * schedule.childrennum//儿童价
      schedule.price = schedule.adultprice + schedule.childprice + additionprice
      schedule.deduction = 0
    }
    if (type == 1 && app.globalData.kmUserInfo.isApp > 1 ){
      var availablegold = schedule.couponPrice//一人可抵用金币
      var total = availablegold * schedule.adultnum//多个人可抵用的金币
      schedule.adultprice = schedule.memberPrice * schedule.adultnum//成人价
      schedule.childprice = schedule.childrenPrice * schedule.childrennum//儿童价
      if (gold > total) {
        var expense = schedule.adultprice - total
        schedule.price = (expense + schedule.childprice + additionprice).toFixed(2)
        schedule.deduction = total
      } else if (gold <= total) {
        var expense = schedule.adultprice - gold
        schedule.price = (expense + schedule.childprice + additionprice).toFixed(2)
        schedule.deduction = gold
      }
    }
    this.setData({
      schedule: schedule
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
  hide() {
    this.hideModal()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    if (options.some != undefined){
      var schedule = JSON.parse(options.some)
      this.setData({
        schedule: schedule
      })
      this.details(schedule.touristId)
      this.addition(schedule.touristId)
      this.shop()
    }
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
    var that = this
    if (that.data.schedule == null){
      that.details(schedule.touristId)
      that.addition(schedule.touristId)
    }
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];
    console.log(prevPage)
    if (prevPage.data.listbox != null){
      var listbox = prevPage.data.listbox
      var travelid = ''
      for (let i = 0; i < listbox.length; i++) {
        travelid += listbox[i].id + ','
      }
      that.setData({
        travelid: travelid,
        listbox: listbox
      })
    }
    var time = util.formatTime(new Date());
    console.log(time)
    var times = time.slice(0, 10)
    var quantum = times.replace(/\//g, '\.')
    this.setData({
      quantum: quantum,
      loading:false
    })
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