const config = require('../../config')
var scanCodeUrl = config.scanCodeUrl
var getWxacodeunlimitUrl = config.getWxacodeunlimitUrl

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
    qrCodeUrl:'',
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
  checkOrder:function(){
    wx.switchTab({
      url:'/pages/thesuper/thesuper'
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
    if (app.globalData.kmUserInfo != null && app.globalData.kmUserInfo.isVip == 2){//0商户 1用户
      // this.createQR();
      // this.createYaQR();
      var qrPath = null;
      try {
        qrPath = wx.getStorageSync(config.qrFilePath);
        console.log(qrPath);
      } catch (e) {
        console.log(e);
      }
      if (qrPath != null && qrPath.length > 0) {
        console.log("不用生成");
        this.setData({
          qrCodeUrl: qrPath
        });
      }else{
        this.chkImg(app.globalData.kmUserInfo.id + '_' + app.globalData.kmUserInfo.userNo);
      }
      this.setData({
        headimgshow: true,
        qrshow: false,
        message:'邀请好友注册会员，即可享受推荐有礼活动，使用微信扫描以上二维码即可邀请注册VIP会员'
      });
    }else{
      this.setData({
        headimgshow: false,
        qrshow: true,
        message:'尊贵VIP会员专享'
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
            if (app.globalData.kmUserInfo == null) {
              wx.navigateTo({
                url: '/pages/users/register/register?refereId=' + params.refereId
              });
            } else {
              wx.showToast({
                title: "您已经注册会员",
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
  chkImg: function (scene){
    var that = this;
    util.kmRequest({
      url: getWxacodeunlimitUrl,
      data: {
        scene: scene,
        path:'pages/repairshops/detail/repairdetail'
      },
      method:'post',
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            qrCodeUrl: res.data.data
          });
          if (wx.canIUse('downloadFile')) {
            console.log('支持downloadFile');
            that.downFile(res.data.data);
          }
        }
      }
    })
  },
  downFile: function (fileUrl) {
    var that = this;
    wx.downloadFile({
      url: fileUrl,
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          that.saveFile(res.tempFilePath);
        }
      }
    })
  },
  saveFile: function(tempPath){
    var that = this;
    wx.saveFile({
      tempFilePath: tempPath,
      success: function (res) {
        console.log(res);
        var savedFilePath = res.savedFilePath
        console.log(savedFilePath);
        that.setData({
          qrCodeUrl: savedFilePath
        });
        wx.setStorage({
          key: config.qrFilePath,
          data: savedFilePath
        })
      }
    })
  },
  onShareAppMessage: function () {
    var tenantId = '';
    var tenantNo = '';
    if (app.globalData.kmUserInfo != null) {
      tenantId = app.globalData.kmUserInfo.tenantId;
      console.log(tenantId)
      tenantNo = app.globalData.kmUserInfo.userNo;
      console.log(tenantNo )
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  }
})
