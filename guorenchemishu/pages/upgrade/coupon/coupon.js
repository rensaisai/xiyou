const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getValidUserCardByUserIdUrl = config.getValidUserCardByUserIdUrl
const getCardTicketByUserIdNewUrl = config.getCardTicketByUserIdNewUrl
const getActivityCardByCityCodeUrl = config.getActivityCardByCityCodeUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  list:null,
  envelope:'',
  type:'',
  block:null,
  hiddenNone: 'true',
  // memberFlag:'',
  },
  xlblock(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getActivityCardByCityCodeUrl,
        param:{
          cityCode: app.globalData.cityCode
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          var block = JSON.parse(res.data.data)
          that.setData({
            block:block
          })
        }
      }
    })
  },
  cardbag(e){
    var that = this
    var card = that.data.block[e.currentTarget.dataset.current]
    console.log(e)
    wx.navigateTo({
      url: '/pages/upgrade/order/order?card=' + JSON.stringify(card) +'&cardType='+2,
    })
  },
  coupon:function(){
    var that = this
    util.kmRequest({
      url: getValidUserCardByUserIdUrl,
      data:{
        interfaceName: getValidUserCardByUserIdUrl,
        param:{
          type: '',
        }
      },
      success:function(res){
       if(res.data.status == 1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for(var i=0; i<list.length; i++){
           var begin = list[i].startTime.slice(0,10)
           console.log(begin)
           var time = list[i].dueTime.slice(0,10)
           list[i].begin = begin
           list[i].finish = time
         }
         that.setData({
           list:list
         })
       } else if (res.data.status == 6){
         if (that.data.list == null || that.data.list.length == 0) {
           that.setData({
             hiddenNone: ''
           })
         } else {
           that.setData({
             hiddenNone: 'true'
           })
         }
       }
      }
    })
  },
  use(e){
    var that = this
    if (that.data.envelope != '' && that.data.type){
      var list = that.data.list[e.currentTarget.dataset.index]
      var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      var prevPage = pages[pages.length - 2];
      prevPage.setData({
        voucher:list 
      })
      wx.navigateBack({
        delta: 1,
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    } 
  },
  membership(){
    wx.navigateTo({
      url: '/pages/upgrade/order/order?cardType=' + 0 + '&ids=' + 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      memberFlag: app.globalData.kmUserInfo.memberFlag
    })
    console.log(options.envelope)
    if (options.envelope == undefined){
      this.coupon()
      this.xlblock()
      this.setData({
        envelope:'',
        type:'',
      })
    }else{
      this.userStatisticsRequest(options.envelope, options.type)
      this.setData({
        envelope: options.envelope,
        type: options.type
      })
    }
  },
  userStatisticsRequest: function (price,type) {
    var that = this;
    util.kmRequest({
      url: getCardTicketByUserIdNewUrl,
      data: {
        interfaceName: getCardTicketByUserIdNewUrl,
        param:{
          type: type,
          price: price,
          cityCode:app.globalData.cityCode
        }
      },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          for (var i = 0; i < list.length; i++) {
            var begin = list[i].startTime.slice(0, 10)
            console.log(begin)
            list[i].begin = begin
            var time = list[i].deadTime.slice(0, 10)
            list[i].finish = time
          }
        } else if (res.data.status == 6) {
         
        }
        that.setData({
          list: list,
        });
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