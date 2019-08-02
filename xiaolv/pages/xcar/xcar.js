const config = require('../../config.js')
const util =require('../../utils/util.js')
const gaodeRegeoUrl = config.gaodeRegeoUrl
const chenkUserObdDeviceUrl = config.chenkUserObdDeviceUrl
const saveUserObdDeviceUrl = config.saveUserObdDeviceUrl
const untyingUserObdDeviceUrl = config.untyingUserObdDeviceUrl
const OBDLatestCarConditionUrl = config.OBDLatestCarConditionUrl
const getUserAndGpsInfoByIDsUtcUrl = config.getUserAndGpsInfoByIDsUtcUrl
const getUserFinalStrokeUrl = config.getUserFinalStrokeUrl
const getUserStrokeTrajectoryByIdUrl = config.getUserStrokeTrajectoryByIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    polyline:null,
    markers:null,
    width:'',
    height:'',
    src:'',
    obdmark: '',
    btnstatus: '',
    showModaler:false,
    obd:'',
    vehicle:null,
    journey:null,
  },
  obdinformation() {
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: chenkUserObdDeviceUrl,
        param: {}
      },
      success: (res) => {
        if (res.data.status == 1) {
          var details = JSON.parse(res.data.data)[0]
          that.data.details = details
          that.setData({
            obdmark: details.deviceNumber,
            btnstatus: '解绑'
          })
        } else if (res.data.status == 6) {
          that.setData({
            obdmark: '暂无设备',
            btnstatus: '绑定'
          })
        } else {
          that.setData({
            obdmark: '暂无设备',
            btnstatus: '绑定'
          })
        }
      }
    })
  },
  binding(e) {
    var that = this
    if (!util.checkUserInfo()) {
      return;
    }
    if (e.currentTarget.dataset.value == '绑定') {
      that.setData({
        showModaler:true
      })
    }
    if (e.currentTarget.dataset.value == '解绑') {
      wx.showModal({
        title: '提示',
        confirmColor: '#fd4200',
        content: '是否要解除与该设备的绑定？',
        success(res) {
          if (res.confirm) {
            util.kmRequestobd({
              data: {
                interfaceName: untyingUserObdDeviceUrl,
                param: {}
              },
              success: (res) => {
                console.log(res)
                if (res.data.status == 1) {
                  that.obdinformation()
                  setTimeout(() => {
                    wx.showToast({
                      title: '解绑成功',
                      icon: 'success'
                    })
                  }, 200)
                }
              }
            })
          } else if (res.cancel) {

          }
        }
      })
    }
  },
  confirm() {
    var that = this
    if (that.data.obd == '') {
      wx.showToast({
        title: '请输入OBD设备号',
        icon: 'none'
      })
      return
    }
    util.kmRequestobd({
      data: {
        interfaceName: saveUserObdDeviceUrl,
        param: {
          deviceNumber: that.data.obd
        }
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            showModaler:false,
          })
          that.obdinformation()
          setTimeout(() => {
            wx.showToast({
              title: '绑定成功',
              icon: 'success'
            })
          }, 200)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  block(e) {
    this.data.obd = e.detail.value
  },
  cancel(){
    this.setData({
      showModaler:false
    })
  },
  vehicle(){
    var that = this
    util.kmRequestobd({
     data:{
       interfaceName: OBDLatestCarConditionUrl,
       param: {}
     },
     success:(res)=>{
       if(res.data.status == 1){
         var vehicle = JSON.parse(res.data.data)[0]
         vehicle.carSpeeds = vehicle.carSpeed.slice(0, vehicle.carSpeed.length - 4)
         vehicle.speeds = vehicle.speed.slice(0, vehicle.speed.length - 3)
         that.setData({
           vehicle: vehicle
         })
       }
     }
    })
  },
  journey(){
    var that = this
    util.kmRequestobd({
      data:{
        interfaceName: getUserFinalStrokeUrl,
        param:{}
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          that.track(list.id)
          list.date = list.endTime.slice(0,10)
          list.speeds = parseInt(list.speed)
          list.time = (list.duration / 3600).toFixed(6)
          var dates = list.time
          if (dates > 0.01){
            list.time = (list.duration / 3600).toFixed(2)
         }
          that.setData({
            journey:list
          })
        }
      }
    })
  },
  track(id){
   var that = this
   util.kmRequestobd({
      data:{
        interfaceName: getUserStrokeTrajectoryByIdUrl,
        param:{
          id:id
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          var  arr = []
          var addres = res.data.data.split(';')
          for (var i = 0; i < addres.length; i++){
            var addre = addres[i]
            var list = addre.split(',')
            arr.push({ longitude: list[0], latitude:list[1]})
          }
         var arrs = arr.slice(0, arr.length-1)
         var polyline = [{points:arrs,
           color: "#DC143C",
            width: 2,
            dottedLine: false
          }]
          var markers = [{
            iconPath: "/image/address3.png",
            id: 0,
            latitude: arrs[0].latitude,
            longitude: arrs[0].longitude,
            width: 8,
            height: 8
          }, {
              iconPath: "/image/address4.png",
              id: 0,
              latitude: arrs[arrs.length-1].latitude,
              longitude: arrs[arrs.length - 1].longitude,
              width: 8,
              height: 8
            }]
          that.setData({
            polyline: polyline,
            markers: markers
          })
        }
      }
   })
  },
  recently(){
    var that = this
    if (!util.checkUserInfo()) {
      return;
    }
    if (that.data.journey != null){
      wx.navigateTo({
        url: '/pages/faultlist/track-detail/detail?list=' + JSON.stringify(that.data.journey),
      })
    }
  },
  cardetection(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (this.data.obdmark == '暂无设备'){
      wx.showToast({
        title: '请先绑定OBD设备',
        icon:'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/faultlist/fault/fault',
    })
  },
  jchistory(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/faultlist/history/history',
    })
  },
  maintenance(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.showToast({
      title: '敬请期待. . .',
      icon:'none'
    })
  },
  carlocation() {
    if (!util.checkUserInfo()) {
      return;
    }
    util.kmRequestobd({
      data:{
        interfaceName: getUserAndGpsInfoByIDsUtcUrl,
        param:{}
      },
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var data = JSON.parse(res.data.data)[0]
          console.log(data)
          wx.request({
            url: gaodeRegeoUrl + data.lon + ',' + data.lat,
            data: {},
            success: function (res) {
              console.log(res)
              if (res.data.status == 1) {
                var addres = res.data.regeocode.formatted_address
                  wx.openLocation({
                    latitude:data.lat,
                    longitude:data.lon,
                    scale: 18,
                    name: addres
                  })
              }
            }
          })
        }
      }
    })
  },
  trajectory(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/faultlist/track/track',
    })
  },
  habit() {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.showToast({
      title: '敬请期待. . .',
      icon: 'none'
    })
  },
  police() {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/faultlist/police/police',
    })
  },
  control() {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.showToast({
      title: '敬请期待. . .',
      icon: 'none'
    })
  },
  fence() {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.showToast({
      title: '敬请期待. . .',
      icon: 'none'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (data) {
        that.setData({
          width: data.windowWidth,
          height: data.windowHeight
        })
      }
    })
    if (app.globalData.carInfo != null) {
      wx.setNavigationBarTitle({
        title: app.globalData.carInfo.fctName + '—' + app.globalData.carInfo.carNo
      })
    }
    that.obdinformation()
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
    this.vehicle()
    this.journey()
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