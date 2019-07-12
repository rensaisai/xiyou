const config = require('../../config.js')
const util = require('../../utils/util.js')
const saveStaffUrl = config.saveStaffUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:false,
    name:'',
    role:[
      {name:'老板'},
      {name:'店长'},
      {name:'接待'},
      {name:'技工'},
      ]
  },
  pulldown(){
    if (this.data.active == false){
      this.setData({
        active: true,
      })
    }else{
      this.setData({
        active: false,
      })
    }
  },
  select(e){
    var name = this.data.role[e.currentTarget.dataset.index].name
    this.setData({
      name:name,
      active:false
    })
  },
  formSubmit(e){
    console.log(e)
    var that = this
    var err= ''
    if (e.detail.value.name == ""){
      err='请输入姓名'
    } else if (that.data.name == ''){
      err = '请选择角色'
    } else if (e.detail.value.phone == ""){
      err = '请输入手机号'
    } else if (!util.checkPhone(e.detail.value.phone)){
      err = '手机号格式有误'
    }
    if(err.length>0){
      wx.showToast({
        title: err,
        icon:'none'
      })
      return
    }
    if(that.data.name == '老板'){
      var role = 1
    }
    if (that.data.name == '技工'){
      var role = 3
    }
    if (that.data.name == '店长') {
      var role = 4
    }
    if (that.data.name == '接待') {
      var role = 5
    }
    util.kmRequest({
      data: {
        interfaceName: saveStaffUrl,
        param:{
          repairId: app.globalData.kmUserInfo.repairId,
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          role: role,
        }
      },
      method: "post",
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          wx.navigateBack({
            delta: 1
          })
          setTimeout(function () {
            wx.showToast({
              title: '添加成功',
              icon: "none"
            })
          }, 500)
        }
      }
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