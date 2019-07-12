const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getToursInfoUrl = config.getToursInfoUrl
const getTouristAdditionalUrl = config.getTouristAdditionalUrl
const getTenantAddressAndPhoneUrl = config.getTenantAddressAndPhoneUrl
const saveTouristOrderUrl = config.saveTouristOrderUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
// const document = config.document
const visitorinformation = config.visitorinformation
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
         console.log(addition)
       } else if (res.data.status == 6){

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
        url: '/pages/travel/select/select'
    })
  },
  shop(){
    var that = this
   util.kmRequest({
     url: getTenantAddressAndPhoneUrl,
     data:{
       userId: app.globalData.kmUserInfo.id
     },
     success:function(res){
       if(res.data.status == 1){
         var shop = JSON.parse(res.data.data)
         that.setData({
           shop:shop
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
  that.setData({
    loading:true
  })
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
        console.log(order)
        that.wxPreOrder(order.id)
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
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        // util.kmConsoleLog(res);
        if (res.errMsg == 'requestPayment:ok') {
            that.showSuccess();
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
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
   
    console.log(additionprice)
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
    if (type == 1 && app.globalData.kmUserInfo.isVip == 0){
      schedule.adultprice = schedule.noMemberPrice * schedule.adultnum//成人价
      schedule.childprice = schedule.childrenPrice * schedule.childrennum//儿童价
      schedule.price = schedule.adultprice + schedule.childprice + additionprice
      schedule.deduction = 0
    }
    if (type == 1 && app.globalData.kmUserInfo.isVip != 0){
      var availablegold = schedule.couponPrice//一人可抵用金币
      var total = availablegold * schedule.adultnum//多个人可抵用的金币
      schedule.adultprice = schedule.memberPrice * schedule.adultnum//成人价
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
    this.setData({
      schedule: schedule
    })
    // wx.setStorage({
    //   key: document,
    //   data: schedule,
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    this.setData({
      type:options.type
    })
    this.shop()
    // wx.removeStorage({
    //   key: visitorinformation,
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })
    if (options.some != undefined){
      var schedule = JSON.parse(options.some)
      this.setData({
        schedule: schedule
      })
      this.details(schedule.touristId)
      this.addition(schedule.touristId)
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]
    console.log(currPage)
    if (currPage.data.listbox != null){
      var listbox = currPage.data.listbox
      var travelid = ''
      for (let i = 0; i < listbox.length; i++) {
        travelid += listbox[i].id + ','
      }
      that.setData({
        travelid: travelid,
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