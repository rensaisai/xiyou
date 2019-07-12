// pages/users/yards/yards.js
const config = require('../../../config.js')
const getWxacodeunlimitUrl = config.getWxacodeunlimitUrl
var scanCodeUrl = config.scanCodeUrl

var QR = require('../../../utils/qrcode.js')
var yaQR = require('../../../utils/yaqrcode.js')
var util = require('../../../utils/util.js')
var app = getApp()
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // headimgshow: false,
    // qrshow: true,
    // imgwidth: 0,
    // imgheight: 0,
    // message: '',
    qrCodeUrl: ''
  },
  // createYaQR: function () {
  //   var str = scanCodeUrl + '?kmcode=1&refereId=' + app.globalData.kmUserInfo.id;
  //   console.log(str)
  //   if (str != null && str.length > 0 && this.data.qrCodeUrl.length <= 22) {
  //     var qrData = yaQR.createQrCodeImg(str, { size: 300 });
  //     console.log(qrData)
  //     // const base64 = wx.arrayBufferToBase64(qrData);
  //     this.setData({
  //       qrCodeUrl: qrData//"data:image/png;base64," + 
  //     });
  //   }
  // },
  // createQR: function () {
  //   // let size = this.setCanvasSize();
  //   var str = scanCodeUrl + '?kmcode=1&refereId=' + app.globalData.kmUserInfo.id;
  //   // if (str != null && str.length > 0) {
  //   //   this.createQRcode(str, 'mycanvas', size.w, size.h)
  //   // }
  //   // util.getUrlParam(str);//测试
  // },
  // createQRcode(str, canvasId, canvasWidth, canvasHeight) {
  //   QR.api.draw(str, canvasId, canvasWidth, canvasHeight)
  // }, 
  chkImg: function (scene) {
    console.log(scene)
    var that = this;
    util.kmRequest({
      url: getWxacodeunlimitUrl,
      data: {
        scene: scene,
        path: 'pages/repairshops/detail/repairdetail'
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          console.log(res.data.data)
          that.setData({
            qrCodeUrl: res.data.data
          });
          if (wx.canIUse('downloadFile')) {
            console.log('支持downloadFile');
            // that.downFile(res.data.data);
          }
        }
      }
    })
  },
  // 下载资源到本地
  // downFile: function (fileUrl) {
  //   var that = this;
  //   wx.downloadFile({
  //     url: fileUrl,
  //     success: function (res) {
  //       console.log(res);
  //       if (res.statusCode === 200) {
  //         that.saveFile(res.tempFilePath);
  //         console.log(res.tempFilePath)
  //       }
  //     }
  //   })
  // },
  // // 保存文件到本地
  // saveFile: function (tempPath) {
  //   var that = this;
  //   wx.saveFile({
  //     tempFilePath: tempPath,
  //     success: function (res) {
  //       console.log(res);
  //       var savedFilePath = res.savedFilePath
  //       console.log(savedFilePath);
  //       that.setData({
  //         qrCodeUrl: savedFilePath
  //       });
  //       // 本地储存
  //       wx.setStorage({
  //         key: config.qrFilePath,
  //         data: savedFilePath
  //       })
  //     }
  //   })
  // },
  // previewImage:function(e){
  //   var current = e.target.dataset.src; 
  //   wx.previewImage({ 
  //     current: current, 
  //   // 当前显示图片的http链接		  
  //     urls: [this.data.qrCodeUrl]
  //    // 需要预览的图片http链接列表		
  //    })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.chkImg(app.globalData.kmUserInfo.id);
    this.chkImg(app.globalData.kmUserInfo.id);
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
    // this.chkImg(app.globalData.kmUserInfo.id);
    // var qrPath = null;
    // try {
    //   qrPath = wx.getStorageSync(config.qrFilePath);
    //   console.log(qrPath);
    // } catch (e) {
    //   console.log(e);
    // }
    // if (qrPath != null && qrPath.length > 0 ) {
    //   console.log("不用生成");
    //   this.setData({
    //     qrCodeUrl: qrPath
    //   });
    // } else {
      // console.log(34567)
    
    // }
     
    // this.createQR();
    // this.createYaQR();
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
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)) {
      tenantId = app.globalData.kmUserInfo.tenantId;
      console.log(tenantId)
      tenantNo = app.globalData.kmUserInfo.userNo;
      console.log(tenantNo)
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  }
})