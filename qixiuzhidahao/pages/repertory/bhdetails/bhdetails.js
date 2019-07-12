const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getPurchaseByInfoUrl = config.getPurchaseByInfoUrl
const getReplenishInfoUrl = config.getReplenishInfoUrl
const createStockOrderByAmountUrl = config.createStockOrderByAmountUrl
const createStockOrderUrl = config.createStockOrderUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false,
    goods:null,
    list:null,
    name:'微信',
    items: [
      { name: '微信', value: '微信支付', checked: 'true'},
      { name: '余额', value: '余额支付',  },
    ]
  },
  details(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getPurchaseByInfoUrl,
        param:{
          id: that.data.goods.id
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          list.forEach((i)=>{
              i.totprice = i.price * i.shouldSum
          })
          that.setData({
            list:list
          })
        }
      }
    })
  },
  superior(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getReplenishInfoUrl,
        param: {
          id: that.data.goods.id
        }
      },
      success: (res) => {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          list.forEach((i) => {
            i.totprice = i.price * i.shouldSum
          })
          that.setData({
            list: list
          })
        }
      }
    })
  },
  add(e){
   var that = this
   var list = that.data.list
   var id = e.currentTarget.dataset.id
   list.forEach((i)=>{
     if(i.id == id){
       i.shouldSum = i.shouldSum+1
       i.totprice = i.shouldSum * i.price
     }
   })
   that.setData({
     list:list
   })
  },
  subtract(e){
    var that = this
    var list = that.data.list
    var id = e.currentTarget.dataset.id
    list.forEach((i) => { 
      if (i.id == id) {
        if(i.shouldSum > 1){
          i.shouldSum = i.shouldSum - 1
          i.totprice = i.shouldSum * i.price
        }else{
          i.shouldSum = 1
          i.totprice = i.shouldSum * i.price
        }
      }
    })
    that.setData({
      list: list
    })
  },
  paybtn(){
   var that = this 
    if (that.data.name == '微信'){
      that.setData({
        loading: true
      })
     util.kmRequest({
       data:{
         interfaceName: createStockOrderUrl,
         param:{
           openId: app.globalData.openid,
           orderId:that.data.goods.id,
           ip:'127.0.0.1'
         }  
       },
       success:(res)=>{
         if(res.data.status == 1){
           console.log(res.data.data)
           that.wxpay(JSON.parse(res.data.data)[0])
         }else{
           that.setData({
             loading: false
           })
           wx.showToast({
             title: res.data.msg,
             icon:'none'
           })
         }
       }
     })
    }else{
      that.setData({
        loading: true
      })
      util.kmRequest({
        data: {
          interfaceName: createStockOrderByAmountUrl,
          param: {
            mechanismId: app.globalData.kmUserInfo.mechanismId,
            orderId: that.data.goods.id,
          }
        },
        success: (res) => {
          if(res.data.status == 1){
            wx.redirectTo({
              url:'/pages/repertory/repertory/repertory'
            })
          }else{
            that.setData({
              loading: false
            })
            wx.showToast({
              title: 'res.data.mag',
              icon:'none'
            })
          }
        }
      })
    }
  },
  wxpay(data){
    console.log(data)
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success(res){
        console.log(res)
        if (res.errMsg == 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/repertory/repertory/repertory'
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
      fail(res){
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          that.setData({
            loading: false
          })
          res.err_code = "取消支付";
        }
        wx.showToast({
          title: res.err_code,
          icon: "none"
        })  
      }
    })
  },
  addition(){
   wx.navigateTo({
     url: '/pages/repertory/come/come',
   })
  },
  radioChange(e){
   this.setData({
     name: e.detail.value
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     goods: JSON.parse(options.goods)
   })
    console.log(options.type)
    if (options.type == 'true'){
      this.details()
    } else {
      this.superior()
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