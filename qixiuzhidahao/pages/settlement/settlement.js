const config = require('../../config.js')
const util = require('../../utils/util.js')
const getRepairOrderAndPriceUrl = config.getRepairOrderAndPriceUrl
const getRepairMonthOrderUrl = config.getRepairMonthOrderUrl
const getRepairMonthOrderPriceUrl = config.getRepairMonthOrderPriceUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:false,
    dayprice: 0,
    daynum: 0,
    content:null,
    list:null,
  },
  bill(){
    var that = this
    that.setData({
      active:true
    })
    setTimeout(()=>{
      that.setData({
        active: false
      })
    },2000)
  },
  day(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getRepairOrderAndPriceUrl,
        param: {
          repairId: app.globalData.kmUserInfo.repairId,
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var content = JSON.parse(res.data.data)[0]
          that.setData({
            dayprice: content.price,
            daynum: content.num
          })
          console.log(content)
        }else{

        }
      }
    })
  },
  month(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getRepairMonthOrderUrl,
        param: {
          repairId: app.globalData.kmUserInfo.repairId,
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
           var content = JSON.parse(res.data.data)
          content.reverse();
          content.forEach((i)=>{
            i.active = false
          })
          that.setData({
            content: content
          })
        } else {

        }
      }
    })
  },
  monthbtn(e){
    console.log(e)
    var that = this
    var content = that.data.content
    for (var i = 0; i < content.length; i++){
      if (i == e.currentTarget.dataset.index){
        if (content[i].active){
          content[i].active = false
        }else{
          content[i].active = true
        }
      }else{
        content[i].active = false
      }
    }
    // content.forEach((i) => {
    //   if(i == )
    //   i.active = false
    // })
    // if (content[e.currentTarget.dataset.index].active == true){
    //   content[e.currentTarget.dataset.index].active = false
    // }else{
      // content[e.currentTarget.dataset.index].active = true
    // }
    var cente = content[e.currentTarget.dataset.index]
    util.kmRequest({
      data: {
        interfaceName: getRepairMonthOrderPriceUrl,
        param: {
          repairId: app.globalData.kmUserInfo.repairId,
          year: cente.year,
          month: cente.month
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          that.setData({
            list: list,
            content: content
          })
        } else {
          wx.showToast({
            title: '此月没有订单信息',
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.day()
    this.month()
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