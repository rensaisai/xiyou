const config = require('../../config.js')
const util = require('../../utils/util.js')
const commitOrderUrl = config.commitOrderUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
// const getCardTicketByUserIdUrl = config.getCardTicketByUserIdUrl
const getCardTicketByUserIdNewUrl = config.getCardTicketByUserIdNewUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  orderid:'',
  list:null,
  money:'',//减去优惠券的价格
  price:'',//实际支付的价格优惠券+车豆
  // orderprice:'',//车豆优惠后的价格
  // member:'',
  num:0,
  bean:0,
  index:0,
  preferential:0,//减去的优惠券
  entity:null,
  loading:false,
  voucher:null,
  type:'',
  },
  address(){
   wx.navigateTo({
     url: '/pages/map/map?scign='+1+'&type=1',
   })
  },
  envelope(e){
     console.log(e)
     var that = this
     var list = that.data.list
     var order = list[e.currentTarget.dataset.index]
     that.setData({
       index: e.currentTarget.dataset.index,
     })
    var price = 0
    for (var i = 0; i < order.carGoods.length; i++){
      price += order.carGoods[i].sellingPrice * order.carGoods[i].num
    }
    console.log(price)
    that.userStatisticsRequest(price, order.type)
  },
  btn(){
    var that = this  
    var list = that.data.list
    var itemIds=[]
    var cardId = []
    var ttalprice = 0
    for(var i=0; i<list.length; i++){
      var length = list[i].carGoods.length
      ttalprice += list[i].carGoods[length - 1].sellingPrice
      if (list[i].cardId != undefined){
        cardId.push({cardId: list[i].cardId, itemId: list[i].id})
      }
      for (var j = 0; j < list[i].carGoods.length; j++){
        itemIds.push({ itemId: list[i].id, goodsId: list[i].carGoods[j].id, itemName: list[i].itemName, num: list[i].carGoods[j].num, price: list[i].carGoods[j].sellingPrice,})
      }
    }
    // for (var i = 0; i < itemIds.length;  i++){
    //   for (var key in itemIds[i]){
    //     var value = itemIds[i][key]+''
    //     itemIds[i][key] = value
    //     // var  s = {}
    //     // s = itemIds[i]
    //   }
    // }
    var itemId = JSON.stringify(itemIds)
    console.log(itemIds)
    if (cardId == [] && cardId.length==0){
      var cardIds = ''
    }else{
      var cardIds = JSON.stringify(cardId)
    }
    that.setData({
      loading:true
    })
    util.kmRequest({
      data:{
        interfaceName: commitOrderUrl,
        param:{
          price: that.data.money,
          userCarId: app.globalData.carInfo.id,
          itemIds: itemId,
          repairId: that.data.entity.id,
          payType: 0,
          hourlyRates: ttalprice,
          cardId: cardIds,
          beanPrice: that.data.bean,
          payAmount: that.data.price,
        }
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          var orders= JSON.parse(res.data.data)[0]
          console.log(orders)
          that.setData({
            orderid: orders.id
          })
          if (orders.userStatus == 1){
            wx.redirectTo({
              url: '/pages/success/success?orderid=' + orders.id
            })
          }else{
            that.wechatorder(orders.id)
          }
        }else{
          that.setData({
            loading:false
          })
        }
      }
    })
  },
  wechatorder(orderid){
    var that = this;
    var data = {
      interfaceName: wxGRCreateOrderUrl,
      param:{
        openId: app.globalData.openid,
        orderId: orderid,
        ip: '127.0.0.1'
      }
    };
    util.kmRequest({
      data:data,
      success:function(res){
        if(res.data.status == 1){
          that.wxPay(JSON.parse(res.data.data)[0]) 
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
    console.log(data)
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
            url: '/pages/success/success?orderid=' + that.data.orderid
          })
        } else {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          that.setData({
            loading: false
          })
          res.errMsg = "取消支付";
        }
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var name = ''
    var phone = app.globalData.kmUserInfo.phone
    var bean = app.globalData.kmUserInfo.bean
    if (app.globalData.kmUserInfo.userName == ''){
      name = app.globalData.kmUserInfo.nickName
    }else{
      name = app.globalData.kmUserInfo.userName
    }
    var price=0;
    // var type='';
    var list = JSON.parse(options.order)
    for(var i=0; i<list.length; i++){
      // type += list[i].type + ','
      // console.log(type) 
      list[i].cardNum = '请选择优惠券'
      for (var j = 0; j < list[i].carGoods.length; j++) {
        price += list[i].carGoods[j].sellingPrice * list[i].carGoods[j].num 
    }
    }
    // price = price1 +price2
    if (bean < price){
      var privilegeprice = (price - bean).toFixed(2)
    } else if (bean >= price){
      var privilegeprice = (price - price).toFixed(2)
      var bean = price.toFixed(2)
    }
    this.setData({
      list: list,
      money: price,//商品总价
      bean: bean,//优惠的车豆
      price: privilegeprice,//车豆优惠后的价格
      // orderprice: privilegeprice,//车豆优惠后的价格
      name:name,
      phone: phone,
      entity: JSON.parse(options.entity),
      // type:type.substr(0, type.length - 1)
    })
    // this.userStatisticsRequest(type)
  },
  // userStatisticsRequest: function (type) {
  //   var that = this;
  //   util.kmRequest({
  //     url: getCardTicketByUserIdUrl,
  //     data: {
  //       userId: app.globalData.kmUserInfo.id,
  //       type:type,
  //       price: that.data.money
  //     },
  //     method:"post",
  //     success: function (res) {
  //       if (res.data.status == 1) {
  //         var statistics = JSON.parse(res.data.data)
  //         var cardNum = statistics.length + '张可用'
  //         var num = statistics.length
  //       }else if(res.data.status == 6){
  //         var cardNum = '无可用优惠券'
  //         var num = 0
  //       }
  //        that.setData({
  //           member: cardNum,
  //           num:num
  //         });
  //     }
  //   })
  // },
  userStatisticsRequest(price,type){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getCardTicketByUserIdNewUrl,
        param:{
          type: type,
          price: price,
        }
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          wx.navigateTo({
            url: '/pages/upgrade/coupon/coupon?envelope=' + price+'&type='+type,
          })
        }else if(res.data.status == 6){
          var list = that.data.list
          list[that.data.index].cardNum = '无可用优惠券'
          that.setData({
            list:list
          })
        }
      }
    })
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
    var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[pages.length - 1];
    console.log(prevPage)
    if (this.data.voucher != null){
      var list = this.data.list
      var deductionAmount = 0
      list[this.data.index].cardNum = '-' + this.data.voucher.deductionAmount
      list[this.data.index].cardprice = this.data.voucher.deductionAmount
      list[this.data.index].cardId = this.data.voucher.cardId
      for(var i=0; i<list.length; i++){
        if (list[i].cardprice != undefined){
          deductionAmount += list[i].cardprice
        }
      }
      if (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean > 0){
        var price = (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean).toFixed(2)
        var bean = app.globalData.kmUserInfo.bean
      } else if (this.data.money - deductionAmount - app.globalData.kmUserInfo.bean <= 0){
        var price = '0.00'
        var bean = (this.data.money - deductionAmount).toFixed(2)
      }
      this.setData({
        price:price,//实际支付价格
        list:list,
        bean:bean,//减去的车豆
        preferential: deductionAmount,//优惠的价格
      })
    }
    this.setData({
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