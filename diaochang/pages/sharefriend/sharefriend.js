const config = require('../../config')
var util = require('../../utils/util')

var app = getApp()

Page({
  data: {
    imgwidth: 0,
    imgheight: 0,
    windowWidth:0,
    name: '',
    shareImgTempPath: ''
  },
  onLoad: function (options) {
    this.setCanvasSize();
    var repairId = options.repairId;
    if (repairId != null) {
      this.sharePengyou(repairId);
    }
    var name = options.name;
    if(name != null){
      this.setData({
        name: name
      })
    }
  },
  setCanvasSize() {
    let size = {};
    let res = wx.getSystemInfoSync();

    let scale = res.windowHeight / res.windowWidth;
    let width = res.windowWidth * scale;
    let height = width;
    size.w = width;
    size.h = height;
    this.setData({
      imgwidth: width,
      imgheight: height,
      windowWidth: res.windowWidth,
      scale: scale
    });
    return size;
  },
  sharePengyou: function (repairId) {
    var that = this;
    var token = this.getAccessToken();
    if (token.length > 0) {
      var url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token;

      wx.request({
        url: url,
        method: 'post',
        data: JSON.stringify({
          scene: repairId,
          page: 'pages/index/index',
          is_hyaline: false
        }),
        success: function (res) {
          console.log(res);
          // wx.downloadFile({
          //   url: that.data.qrcode,
          //   success: function (res2) {
          //     console.log('二维码：' + res2.tempFilePath)
          //     //缓存二维码
          //     that.setData({
          //       qrcode_temp: res2.tempFilePath
          //     })
          //     console.log('开始绘制图片')
          //     that.drawImage();
          //     wx.hideLoading();
          //     setTimeout(function () {
          //       that.canvasToImage()
          //     }, 200)
          //   }
          // })
          that.drawImage();
          setTimeout(function () {
            that.canvasToImage()
          }, 200)
        }
      })
    }
  },
  getAccessToken: function () {
    var token = '';
    var time = '';
    var expires = '';
    try {
      token = wx.getStorageSync('accessToken');
      time = wx.getStorageSync('accessTime');
      expires = wx.getStorageSync('accessExpires');
    } catch (e) {
      console.log(e);
    }
    console.log(time);
    console.log(expires);
    if (time != null && expires != null && expires > 0) {
      var nowDate = new Date();
      if ((nowDate.getTime() - time.getTime()) / 1000 < expires) {
        console.log(token);
        console.log('跳转生成小程序码');
        return token;
      }
    }
    console.log('获取token');
    var appid = 'wx258e6a592d3662cd';
    var appsecrect = '2614b2fc54a807a5a27e788c343cc72f';
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + appsecrect;

    util.kmRequest({
      url: url,
      data: {
      },
      success: function (res) {
        console.log(res);
        if (res.data.access_token != null) {
          try {
            wx.setStorageSync('accessToken', res.data.access_token);
            wx.setStorageSync('accessTime', new Date());
            wx.setStorageSync('accessExpires', res.data.expires_in);
          } catch (e) {
            console.log(e);
          }
        }
      }
    })
    return '';
  },
  drawImage: function () {
    //绘制canvas图片
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = '/image/mineback.jpg'
    var portraitPath = '/image/logo.png'
    var hostNickname = '钓场天下'

    var qrPath = '/image/star_half.png'
    var windowWidth = that.data.windowWidth
    console.log(that.data.scale);
    
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, (that.data.scale * windowWidth - 80))

    //绘制头像
    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    // ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 100, 100)//0.3 * windowWidth
    // ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.047 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + '', windowWidth / 2, 0.52 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.047 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(that.data.name, windowWidth / 2, 0.57 * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.63 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    //绘制第三段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.047 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码获取详情', windowWidth / 2, 1.15 * windowWidth)
    ctx.draw();
  },
  canvasToImage: function () {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.windowWidth,
      height: that.data.windowWidth * that.data.scale,
      destWidth: that.data.windowWidth * 4,
      destHeight: that.data.windowWidth * 4 * that.data.scale,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('图生成成功:' + res.tempFilePath)
        that.setData({
          shareImgTempPath: res.tempFilePath
        })
        // wx.previewImage({
        //   current: res.tempFilePath,
        //   urls: [res.tempFilePath]
        // })
      },
      fail: function (err) {
        console.log('失败')
        console.log(err)
      }
    })
  },
  saveAlbum: function(){
    var that = this;
    wx.setClipboardData({
      data: this.data.name,
      success: function (res) {
        // wx.getClipboardData({
        //   success: function (res) {
        //     console.log(res.data)
        //   }
        // })
      }
    })
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgTempPath,
      success(res) {
        console.log(res);
        wx.showModal({
          title: '保存成功',
          content: '图片已保存到相册，钓场标题已存入剪贴板，直接粘贴即可!',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#1296db',
          success: function (res) {
            if (res.confirm) {
              
            }
          }
        })
      }
    })
  }
})
