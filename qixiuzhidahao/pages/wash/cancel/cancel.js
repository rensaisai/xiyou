const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const getAllCarwashOrderUrl = config.getAllCarwashOrderUrl
const cancellationOrderUrl = config.cancellationOrderUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiidenNone:true,
    list:null,
  },
  card() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getAllCarwashOrderUrl,
        param: {
          repairId: app.globalData.kmUserInfo.repairId
        }
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          that.setData({
            list: list
          })
        } else if (res.data.status == 6) {
          that.setData({
            list: null
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiidenNone: ''
          })
        } else {
          that.setData({
            hiidenNone: true
          })
        }
      }
    })
  },
  accomplish(e){
   var that = this 
   util.kmRequest({
     data: {
       interfaceName: cancellationOrderUrl,
       param: {
         orderId: that.data.list[e.currentTarget.dataset.index].orderId
       }
     },
     success:(res)=>{
       if(res.data.status == 1){
         wx.showToast({
           title: '核销成功',
         })
         setTimeout(()=>{
           that.card()
         },300)
       }
     }
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.card()
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