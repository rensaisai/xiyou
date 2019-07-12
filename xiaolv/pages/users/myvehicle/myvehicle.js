const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getAllUserCarsUrl = config.getAllUserCarsUrl
const updateUserChoiceCarUrl = config.updateUserChoiceCarUrl
const deleteUserCarUrl = config.deleteUserCarUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
  list:null,
  },
  vehicleinformation(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getAllUserCarsUrl,
        param:{}
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for(var i =0; i<list.length; i++){
            list[i].active=false
            if (list[i].isUse == 0){
            list[i].active = true
            }
            if (list[i].isUse == 1){
              app.globalData.carInfo = list[i];
            }
          }
          list.sort(function (x, y) {
            var li = x.isUse
            var ls = y.isUse
            return ls - li;
          });
          that.setData({
            list:list
          })
        }else if(res.data.status == 6){
          app.globalData.carInfo = null
          that.setData({
            list: null
          })
        }
      }
    })
  },
  defaultClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    util.kmRequest({
      data: {
        interfaceName: updateUserChoiceCarUrl,
        param:{
          userCarId: selectItem.id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          // if (JSON.parse(res.data.data)[0].isUse == 1) {
          //   app.globalData.carInfo = JSON.parse(res.data.data)[0];
          // }
          that.vehicleinformation();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  deleteClick: function (event) {
    var that = this;
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    wx.showModal({
      title: "提示",
      content: "确定删除 " + selectItem.carNo + " 吗?",
      showCancel: true,
      confirmText: "确定",
      confirmColor: "#fd4200",
      success: function (res) {
        if (res.confirm == true) {
          that.deleteCar(selectItem.id);
        }
      }
    })
  },
  deleteCar: function (carId) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: deleteUserCarUrl,
        param:{
          userCarId: carId
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.vehicleinformation();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  btn(){
   wx.navigateTo({
     url: '/pages/cars/carselect/fct/fctlist',
   })
  },
  details(e){
    var selectItem = this.data.list[e.currentTarget.dataset.index];
    console.log(selectItem)
    wx.navigateTo({
      url: '/pages/cars/mycar/cardetail/mycar?selectItem=' + JSON.stringify(selectItem),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
    this.vehicleinformation()
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