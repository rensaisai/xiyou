const config = require('../../config')
var scanCodeUrl = config.scanCodeUrl

var QR = require('../../utils/qrcode.js')
var yaQR = require('../../utils/yaqrcode.js')
var util = require('../../utils/util')

var app = getApp()

Page({
  data: {
    headimgshow: false,
    qrshow:true,
    imgwidth:0,
    imgheight:0,
    message:'',
    qrCodeUrl:''
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad: function (options){

  },
  createYaQR:function(){    
    var str = scanCodeUrl + '?kmcode=1&refereId=' + app.globalData.kmUserInfo.id;
    if (str != null && str.length > 0 && this.data.qrCodeUrl.length <= 22) {
      var qrData = yaQR.createQrCodeImg(str, {size: 300});
      // const base64 = wx.arrayBufferToBase64(qrData);
      this.setData({
        qrCodeUrl: qrData//"data:image/png;base64," + 
      });
    }
  },
  onShow:function(){
    if (app.globalData.kmUserInfo != null &&app.globalData.kmUserInfo.memberFlag == 1){//0未购买 1已购买 >>>>>>
      // this.createQR();
      this.createYaQR();
      this.setData({
        headimgshow: true,
        qrshow: false,
        message:'邀请好友注册会员，即可享受推荐有礼活动，使用车秘书小程序或APP扫描以上二维码即可邀请注册VIP会员'
      });
    }else{
      this.setData({
        headimgshow: false,
        qrshow: true,
        message:'尊贵VIP会员专享(朋友邀请请点击右侧扫码)'
      });
    }
  },
  onHide: function () {
    // this.setData({
    //   qrshow: true
    // });
  },
  createQR:function(){
    let size = this.setCanvasSize();
    var str = scanCodeUrl + '?kmcode=1&refereId=' + app.globalData.kmUserInfo.id;
    if (str != null && str.length > 0) {
      this.createQRcode(str, 'mycanvas', size.w, size.h)
    }
    // util.getUrlParam(str);//测试
  },
  createQRcode(str, canvasId, canvasWidth, canvasHeight) {
    QR.api.draw(str, canvasId, canvasWidth, canvasHeight)
  },
  setCanvasSize() {
    let size = {};
    let res = wx.getSystemInfoSync();
    
    let scale = 400 / 750;
    let width = res.windowWidth * scale;
    let height = width;
    size.w = width;
    size.h = height;
    this.setData({
      imgwidth:width,
      imgheight:height
    });
    return size;
  },
  joinVIPRequest: function (e) {
    if(app.globalData.kmUserInfo == null){
      wx.navigateTo({
        url: '/pages/users/login/login'
      });
      return;
    }
    var that = this;
    var data = {
      userId: app.globalData.kmUserInfo.id,
      price: 599,
      type: 0 //0会员 1充值
    }
    wx.navigateTo({
      url: '/pages/pay/payment/payment?paytype=1&orderdata=' + JSON.stringify(data)
    });
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        if (res.result != null && res.result.length > 0) {
          var params = util.getUrlParam(res.result);
          if (params.kmcode != null && params.kmcode == 1) {
            if (app.globalData.kmUserInfo == null) {//>>>>>>
              wx.navigateTo({
                url: '/pages/users/register/register?refereId=' + params.refereId
              });
            } else {
              // wx.showToast({
              //   title: "您已经注册会员",
              //   icon: "none"
              // })
              wx.showToast({
                title: "您已绑定过推荐人",
                icon: "none"
              })
            }
          } else {
            wx.showToast({
              title: "不支持",
              icon: "none"
            })
          }
        }
      },
      fail: function (res) {
      }
    })
  },
  cardVIP: function () {
    if (app.globalData.kmUserInfo == null) {
      wx.navigateTo({
        url: '/pages/users/login/login'
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/users/cardvip/cardvip'
    });
  }
  // onShareAppMessage: function () {
  //   return {
  //     title: '果仁车秘书',
  //     desc: '正品配件，专业保养',
  //     path: '/pages/index/index'
  //   }
  // }
})
