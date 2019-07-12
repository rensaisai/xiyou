const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const upng = require('../../../utils/upng.js')
const uploadUserInfoUrl = config.uploadUserInfoUrl
const uploadPictureUrl = config.uploadPictureUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths1:'',
    tempFilePaths2:'',
    active:false,
  },
  positive(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        wx.getImageInfo({
          src: tempFilePaths,
          success(res) {
            console.log(res)
            var width = res.width + ''
            var heigth = res.height + ''
            if (width.length == 2) {
              var imgWidth = parseInt(width)
            } else if (width.length == 3) {
              var imgWidth = parseInt(width / 10)
            } else if (width.length == 4) {
              var imgWidth = parseInt(width / 100)
            }
            if (heigth.length == 2) {
              var imgHeight = parseInt(heigth)
            } else if (heigth.length == 3) {
              var imgHeight = parseInt(heigth / 10)
            } else if (heigth.length == 4) {
              var imgHeight = parseInt(heigth / 100)
            }
            var canva = 'canvas1'
            that.base64(tempFilePaths, imgWidth, imgHeight, canva)
          }
        })
      }
    })
  },
  base64(tempFilePaths, imgWidth, imgHeight, canva) {
    var that = this
    const canvas = wx.createCanvasContext(canva)
    const platform = wx.getSystemInfoSync().platform
    canvas.drawImage(tempFilePaths, 0, 0, imgWidth, imgHeight) // 1. 绘制图片至canvas// 绘制完成后执行回调
    canvas.draw(false, () => {
      // 2. 获取图像数据
      wx.canvasGetImageData({
        canvasId: canva,
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
        success(res) {
          console.log(res)
          if (platform === 'ios') {
            // 兼容处理：ios获取的图片上下颠倒 
            res = that.reverseImgData(res)
          }
          // 3. png编码
          let pngData = upng.encode([res.data.buffer], res.width, res.height)
          // 4. base64编码
          let base64 = wx.arrayBufferToBase64(pngData)
          let base64s = { "headIcon.jpg": base64 }
          let bas = JSON.stringify(base64s)
          console.log(bas)
          that.uploadheadImg(bas, canva)
        }
      })
    })
  },
  uploadheadImg(uploadheadImg, canva) {
    var that = this
    util.kmRequest({
      url: uploadPictureUrl,
      data: {
        picMap: uploadheadImg,
      },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {
          var img = JSON.parse(res.data.data)[0]
          if (canva == 'canvas1'){
            that.setData({
              tempFilePaths1: img.headIcon
            })
          } else if (canva == 'canvas2'){
            that.setData({
              tempFilePaths2: img.headIcon
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  reverseImgData(res) {
    var w = res.width
    var h = res.height
    let con = 0
    for (var i = 0; i < h / 2; i++) {
      for (var j = 0; j < w * 4; j++) {
        con = res.data[i * w * 4 + j]
        res.data[i * w * 4 + j] = res.data[(h - i - 1) * w * 4 + j]
        res.data[(h - i - 1) * w * 4 + j] = con
      }
    }
    return res
  },
  reverse(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        wx.getImageInfo({
          src: tempFilePaths,
          success(res) {
            console.log(res)
            var width = res.width + ''
            var heigth = res.height + ''
            if (width.length == 2) {
              var imgWidth = parseInt(width)
            } else if (width.length == 3) {
              var imgWidth = parseInt(width / 10)
            } else if (width.length == 4) {
              var imgWidth = parseInt(width / 100)
            }
            if (heigth.length == 2) {
              var imgHeight = parseInt(heigth)
            } else if (heigth.length == 3) {
              var imgHeight = parseInt(heigth / 10)
            } else if (heigth.length == 4) {
              var imgHeight = parseInt(heigth / 100)
            }
            var canva = 'canvas2'
            that.base64(tempFilePaths, imgWidth, imgHeight, canva)
          }
        })
      }
    })
  },
  information(){
    var active=''
   if(this.data.active == true){
     active = false
   }else{
     active = true
   }
   this.setData({
     active:active
   })
  },
  formSubmit(e){
    console.log(e)
    var that = this
    var err= ''
    if (that.data.tempFilePaths1 === ''){
      err='请上传身份证照正面图片'
    } else if (that.data.tempFilePaths2 === ''){
      err = '请上传身份证照反面图片'
    } else if (e.detail.value.name == ''){
      err = '请输入真实姓名'
    } else if (e.detail.value.card == ''){
      err = '请输入身份证号'
    } else if (!util.isCardNo(e.detail.value.card)){
      err = '身份证号格式错误'
    }else if(that.data.active == false){
      err = '请同意协议'
    }
    if(err.length >0){
      wx.showToast({
        title:err,
        icon:'none'
      })
      return
    }
    util.kmRequest({
      url: uploadUserInfoUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        frontImgUrl: that.data.tempFilePaths1,
        reverseImgUrl: that.data.tempFilePaths2,
        realName: e.detail.value.name,
        identityNum: e.detail.value.card
      },
      method:'post',
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var user= JSON.parse(res.data.data)[0]
          app.globalData.kmUserInfo = user
          wx.reLaunch({
            url:'/pages/personalcenter/personalcenter'
          })
          setTimeout(function(){
            wx.showToast({
              title: '添加成功',
            })
          },200)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none',
          })
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