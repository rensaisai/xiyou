const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const getObdTestingByCheckIdUrl = config.getObdTestingByCheckIdUrl
const getOBDTestingTimeUrl = config.getOBDTestingTimeUrl
const getObdTestingInfoByCheckIdUrl = config.getObdTestingInfoByCheckIdUrl
const getRepairCheckByIdUrl = config.getRepairCheckByIdUrl
const getRepairTestingTimeUrl = config.getRepairTestingTimeUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   information:null,
    repairlist:null,
   id:'',
  },
  obddetail(id){
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getObdTestingByCheckIdUrl,
        param: {
          obdCheckId:id
        }
      },
      success: (res) => {
        if(res.data.status == 1){
          var obdlist = JSON.parse(res.data.data)
          that.setData({
            list: obdlist
          })
        }
      }
    })
  },
  obdinformation(id){
    var that = this
    util.kmRequestobd({
      data:{
        interfaceName: getOBDTestingTimeUrl,
        param: {
          obdCheckId: id
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          var information = JSON.parse(res.data.data)[0]
          that.setData({
            information:information
          })
        }
      }
    })
  },
  fault(e) {
    var that = this
    var lists = that.data.list[e.currentTarget.dataset.index]
    if (lists.obdCount != 0 && lists.sysId != undefined) {
      util.kmRequestobd({
        data: {
          interfaceName: getObdTestingInfoByCheckIdUrl,
          param: {
            obdCheckId: that.data.id,
            sysId: lists.sysId
          }
        },
        success: (res) => {
          if (res.data.status == 1) {
            var fault = JSON.parse(res.data.data)
            console.log(fault)
            var arr = []
            fault.forEach((i) => {
              arr.push(i.obdDescription)
            })
            wx.showActionSheet({
              itemList: arr,
              success(res) {

              },
              fail(res) {

              }
            })
          }
        }
      })
    }
  },
  repairdetail(id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getRepairCheckByIdUrl,
        param: {
          id: id
        }
      },
      success: (res) => {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0].projects
          list.forEach(i => {
            i.obdTitle = i.name
            
          })
          that.setData({
            list: list
          })
        }
      }
    })
  },
  repairinformation(id){
     var that = this
     util.kmRequest({
       data: {
         interfaceName: getRepairTestingTimeUrl,
         param: {
           repairCheckId: id
         }
       },
       success: (res) => {
         if (res.data.status == 1) {
           var information = JSON.parse(res.data.data)[0]
           that.setData({
             information: information
           })
         }
       }
     })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 1){
      this.obddetail(options.id)
      this.obdinformation(options.id)
    }else{
      this.repairdetail(options.id)
      this.repairinformation(options.id)
    }
    this.data.id = options.id
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