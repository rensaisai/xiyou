// pages/cars/mycar/team/team.js
const config = require('../../../../config.js')
const getUserTeamUrl = config.getUserTeamUrl

var app = getApp()
console.log(app);
var util = require('../../../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    hiddenNone: 'true',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  Togetbusiness:function(){
    var that=this
    util.kmRequest({
      data:{
        interfaceName: getUserTeamUrl,
        param:{}
      },
      success:function(res){
        if(res.data.status==1){
          var list=JSON.parse(res.data.data);
          console.log(list)
          // for(var i=0; i<list.length; i++){
          //   var phone = list[i].phone;
          //   var tempstr = phone.slice(3, 7);
          //   var nick = phone.replace(tempstr, "****")
          //   list[i].phone = nick;
          // }
        }
        that.setData({
          list:list
        }) 
        that.showNone()
      },
       complete: function (res) {
        that.showNone();
      }
    })
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  phone(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  onLoad: function (options) {

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
    this.Togetbusiness();
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