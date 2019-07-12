const config = require('../../config.js')
const util = require('../../utils/util.js')
const getAllUserCardUrl = config.getAllUserCardUrl
const writeOffCardTicketByUserCardIdUrl = config.writeOffCardTicketByUserCardIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
   list:null,
   hiidenNone:true,
  },
  usercad(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getAllUserCardUrl,
        param: {
          customerId:that.data.id
        }
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          for (var i = 0; i < list.length; i++) {
            var begin = list[i].startTime.slice(0, 10)
            console.log(begin)
            var time = list[i].dueTime.slice(0, 10)
            list[i].begin = begin
            list[i].finish = time
          }
          that.setData({
            list:list
          })
        }else if(res.data.status == 6){
          that.setData({
            list: null
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        if (that.data.list == null || that.data.list.length == 0){
          that.setData({
            hiidenNone:''
          })
        }else{
          that.setData({
            hiidenNone:true
          })
        }
      }
    })
  },
  btn(e){
    console.log(e)
    var that = this
    var cad = that.data.list[e.currentTarget.dataset.index]
    util.kmRequest({
      data:{
        interfaceName: writeOffCardTicketByUserCardIdUrl,
        param:{
          userCardId: cad.id
        }
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          setTimeout(()=>{
            wx.showToast({
              title: '成功',
            })
          },400)
          that.usercad()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.userid
    })
    this.usercad()
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