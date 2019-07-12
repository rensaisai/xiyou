const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCurCodeUrl = config.getCurCodeUrl 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  detection(){
   var that = this
    util.kmRequestobd({
      data:{
        interfaceName: getCurCodeUrl,
        param:{}
      },
      success:(res)=>{
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          list.car = list.wods.substring(0, list.wods.lastIndexOf(";"));
          list.plate = list.wods.substring(list.wods.lastIndexOf(";")+1);
          list.date = list.createTime.slice(0,16)
          that.setData({
            list:list
          })
        }
      }
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.detection()
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