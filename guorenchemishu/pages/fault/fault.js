const config = require('../../config.js')
const util = require('../../utils/util.js')
const chenkUserObdDeviceUrl = config.chenkUserObdDeviceUrl
const saveUserObdDeviceUrl = config.saveUserObdDeviceUrl
const untyingUserObdDeviceUrl = config.untyingUserObdDeviceUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    details:null,
    obdmark:'',
    btnstatus:'',
    obd:'',
  },
  obdinformation(){
    var that = this
    util.kmRequestobd({
      data:{
        interfaceName: chenkUserObdDeviceUrl,
        param:{}
      },
      success:(res)=>{
        if(res.data.status == 1){
          var details = JSON.parse(res.data.data)[0]
          that.data.details = details
          that.setData({
            obdmark: details.deviceNumber,
            btnstatus:'解绑'
          })
        } else if (res.data.status == 6){
          that.setData({
            obdmark: '暂无设备',
            btnstatus:'绑定'
          })
        }else{
          that.setData({
            obdmark: '暂无设备',
            btnstatus: '绑定'
          })
        }
      }
    })
  },
  block(e){
   this.data.obd = e.detail.value
  },
  binding(e){
    var that = this
    // if (!util.checkUserInfo()) {
    //   return;
    // }
    if (e.currentTarget.dataset.value == '绑定'){
      that.showModal()
    }
    if (e.currentTarget.dataset.value == '解绑'){
      wx.showModal({
        title: '提示',
        confirmColor:'#fd4200',
        content: '是否要解除与该设备的绑定？',
        success(res) {
          if (res.confirm) {
            util.kmRequestobd({
              data:{
                interfaceName: untyingUserObdDeviceUrl,
                param:{}
              },
              success:(res)=>{
                console.log(res)
                if(res.data.status == 1){
                  that.obdinformation()
                  setTimeout(()=>{
                    wx.showToast({
                      title: '解绑成功',
                      icon: 'success'
                    })
                  },200)
                }
              }
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }
  },
  confirm(){
   var that = this 
   if(that.data.obd == ''){
     wx.showToast({
       title: '请输入OBD设备号',
       icon:'none'
     })
     return
   }
    util.kmRequestobd({
      data:{
        interfaceName: saveUserObdDeviceUrl,
        param:{
          deviceNumber:that.data.obd
        }
      },
      success:(res)=>{
         console.log(res)
         if(res.data.status == 1){
           that.hideModal()
           that.obdinformation()
           setTimeout(()=>{
             wx.showToast({
               title: '绑定成功',
               icon: 'success'
             })
           },200)
         }else{
           wx.showToast({
             title: res.data.msg,
             icon: 'none'
           })
         }
      }
    })
  },
  cancel(){
    this.hideModal()
  },
  detection(){
    var that = this
    if (!util.checkUserInfo()) {
      return;
    }
    if (that.data.obdmark == '暂无设备' && that.data.btnstatus == '绑定'){
      wx.showToast({
        title: '请先绑定设备',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/detection/malfunction/malfunction',
    })
  },
  history(){
    var that = this
    // if (!util.checkUserInfo()) {
    //   return;
    // }
    // if (that.data.obdmark == '暂无设备' && that.data.btnstatus == '绑定') {
    //   wx.showToast({
    //     title: '请先绑定设备',
    //     icon: 'none'
    //   })
    //   return
    // }
    wx.navigateTo({
      url: '/pages/detection/history/history',
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.obdinformation()
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