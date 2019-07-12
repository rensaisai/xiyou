const config = require('../../config')
var util = require('../../utils/util')
const token = config.token
const getRepairOpenId = config.getRepairOpenId
const getStaffInfoByOpenIdUrl = config.getStaffInfoByOpenIdUrl
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleCode:'',
  },
  getOpenId: function () {
    var that = this;
    if (app.globalData.openid == null) {
      // 登录
      wx.login({
        success: function (loginCode) {
          console.log(loginCode)
          //调用request请求api转换登录凭证
          util.kmRequest({
            data: {
              token: '',
              interfaceName: getRepairOpenId,
              param:{
                code: loginCode.code
              }
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.status == 1) {
                app.globalData.openid = JSON.parse(res.data.data).openid;
              }
              that.userInfoRequest();
            }
          })
        }
      })
    }else{
      that.userInfoRequest();
    }
  },
  userInfoRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getStaffInfoByOpenIdUrl,
        param:{
          openId: app.globalData.openid
        } 
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          that.setData({
            roleCode: app.globalData.kmUserInfo.roleCode
          })
          // if (app.globalData.kmUserInfo.roleCode == 1 || app.globalData.kmUserInfo.roleCode == 4){
          //   that.setData({
          //     roleCode: app.globalData.kmUserInfo.roleCode
          //   })
          // }
          // if (app.globalData.kmUserInfo.roleCode == 3){
          //   that.setData({
          //     roleCode: app.globalData.kmUserInfo.roleCode
          //   })
          // }
          // if (app.globalData.kmUserInfo.roleCode == 5) {
          //   that.setData({
          //     roleCode: app.globalData.kmUserInfo.roleCode
          //   })
          // }
        } else {
          if (!util.checkUserInfo()) {
            return;
          }
        }
      }
    })
  },
  maintain(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/maintenance/maintenance',
    })
  },
  wash(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/wash/wash',
    })
  },
make(){
   if (!util.checkUserInfo()) {
        return;
      }
  wx.navigateTo({
    url: '/pages/make/make',
  })
},
order(){
  if (!util.checkUserInfo()) {
      return;
    }
  wx.navigateTo({
    url: '/pages/order/orderlist/orderlist',
  })
},
construct(){
  if (!util.checkUserInfo()) {
        return;
      }
  wx.navigateTo({
    url: '/pages/construct/constructlist/constructlist',
  })
},
employees(){
  if (!util.checkUserInfo()) {
      return;
    }
  wx.navigateTo({
    url: '/pages/technician/technician',
  })
},
orderlist(){
  if (!util.checkUserInfo()) {
    return;
  }
  wx.navigateTo({
    url: '/pages/orders/repair/list/repairorderlist',
  })
},
detection(){
  if (!util.checkUserInfo()) {
    return;
  }
  wx.navigateTo({
    url: '/pages/infomation/addinfo/addinfo',
  })
},
repertory(){
  if (!util.checkUserInfo()) {
    return;
  }
  wx.navigateTo({
    url: '/pages/repertory/repertory/repertory',
  })
},
settlement(){
  if (!util.checkUserInfo()) {
    return;
  }
  wx.navigateTo({
    url: '/pages/settlement/settlement',
  })
},
scan(){
  if (!util.checkUserInfo()) {
    return;
  }
  wx.showLoading({
    title: '加载中',
  })
  wx.scanCode({
    success(res) {
      console.log(res)
        if (res.errMsg == 'scanCode:ok') {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/scan/scan?userid=' + res.result,
          })
        } 
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenId()
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
    var that = this
    if (app.globalData.openid != null) {
      wx.getStorage({
        key: token,
        success(res) {
          app.globalData.token = res.data
          that.userInfoRequest();
        }
      })
    }
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