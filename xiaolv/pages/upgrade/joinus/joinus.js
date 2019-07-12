
const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getRefereInfoUrl = config.getRefereInfoUrl
const isHaveAgentUserOrderUrl = config.isHaveAgentUserOrderUrl
const getUserByUserNoUrl = config.getUserByUserNoUrl
const saveAgentApplyUrl = config.saveAgentApplyUrl
const wxGRCreateOrderUrl = config.wxGRCreateOrderUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    // showModalStatus: true,
    tempFilePaths:null,
    tempFilePaths1: null,
    // canvasimgsrc:'',
    active:false,
    // actives: false,
    image1:'',
    image2:'',
    image3:'',
    name:'',
    identity:'',
    number:'',
    forbid:false,
    user:null,
  },
  number(e) {
    this.setData({
      number: e.detail.value
    })
  },
  recommended() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getRefereInfoUrl,
        param: {}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          if (app.globalData.kmUserInfo.memberFlag == 0) {
            var forbid = false
          } else {
            var forbid = true
          }
          that.setData({
            number: list.userNo,
            forbid: forbid
          })
        } else {
          that.setData({
            number: '',
            forbid: false
          })
        }
      }
    })
  },
  link() {
    wx.navigateTo({
      url: '/pages/upgrade/statement/statement',
    })
  },
  radio() {
    this.setData({
      active: true
    })
  },
  submit: function () {
    var that = this;
    if (that.data.number == '') {
      wx.showToast({
        title: '请输入推荐人工号',
        icon: 'none',
      })
      return
    }
    if (that.data.active == false) {
      wx.showToast({
        title: '请阅读软件服务协议',
        icon: 'none',
      })
      return
    }
    that.judge()
  },
  judge() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getUserByUserNoUrl,
        param: {
          userNo: that.data.number
        }
      },
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          var user = JSON.parse(res.data.data)[0]
          console.log(user)
          that.setData({
            user: user
          })
          if (app.globalData.kmUserInfo.memberFlag == 0) {
            that.showModal()
          } else {
            that.uploadingimg2()
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  cancel() {
    this.hideModal()
  },
  affirm() {
    this.hideModal()
    this.applications()
  },
  applications() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: isHaveAgentUserOrderUrl,
        param: {}
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.succeed()
        } else {
          that.submits()
        }
      }
    })
  },
  succeed() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: saveAgentApplyUrl,
        param: {
          ancestorNo: that.data.number,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          wx.reLaunch({
            url: '/pages/upgrade/success/success',
          })
          var list = JSON.parse(res.data.data)[0]
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  submits() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: saveAgentApplyUrl,
        param: {
          ancestorNo: that.data.number,
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          var orderid = list.id
          console.log(list)
          that.order(orderid)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  order(orderid) {
    var that = this;
    var data = {
      interfaceName: wxGRCreateOrderUrl,
      param: {
        openId: app.globalData.openid,
        orderId: orderid,
        ip: '127.0.0.1'
      }
    };
    util.kmRequest({
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          console.log(res.data)
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }

      }
    })
  },
  wxPay: function (data) {
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        console.log(res)
        if (res.errMsg == 'requestPayment:ok') {
          wx.navigateTo({
            url: '/pages/upgrade/success/success',
          })
        } else {
          wx.showToast({
            title: res.errMsg,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          res.errMsg = "取消支付";
        }
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      },
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
 
  // radios() {
  //   this.setData({
  //     actives: true
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.recommended()
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