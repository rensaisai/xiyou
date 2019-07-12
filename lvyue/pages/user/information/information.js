const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const upng = require('../../../utils/upng.js')
const uploadPictureUrl = config.uploadPictureUrl
const saveHedeImgUrl = config.saveHedeImgUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg:'',
  },
 information(){
   var headImg = ''
   if (app.globalData.kmUserInfo.headImg == '' || app.globalData.kmUserInfo.headImg == null) {
     headImg = '/image/header.png'
   } else {
     headImg = app.globalData.kmUserInfo.headImg
   }
   this.setData({
     headImg: headImg,
     username: app.globalData.kmUserInfo.nickName,
   })
 },
  headImg(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        wx.getImageInfo({
          src: tempFilePaths,
          success(res){
            console.log(res)
            // if (res.width.length == 2){
            var width = res.width+''
            var heigth = res.height+''
            if (width.length == 2){
              var imgWidth = parseInt(width)
            } else if (width.length == 3){
              var imgWidth = parseInt(width/10)
            } else if (width.length == 4){
              var imgWidth = parseInt(width/100)
            }
            if (heigth.length ==2){
              var imgHeight = parseInt(heigth)
            } else if (heigth.length == 3){
              var imgHeight = parseInt(heigth/10)
            } else if (heigth.length == 4){
              var imgHeight = parseInt(heigth/100)
            }
            that.base64(tempFilePaths, imgWidth, imgHeight)
          }
        })
      }
    })  
  },
  base64(tempFilePaths, imgWidth, imgHeight){
    console.log(tempFilePaths, imgWidth, imgHeight)
    var that = this
    const canvas = wx.createCanvasContext('canvas')
    const platform = wx.getSystemInfoSync().platform
    canvas.drawImage(tempFilePaths, 0, 0, imgWidth, imgHeight) // 1. 绘制图片至canvas// 绘制完成后执行回调
    canvas.draw(false, () => {
      // 2. 获取图像数据
      wx.canvasGetImageData({
        canvasId: 'canvas',
        x: 0,
        y: 0,
        width:imgWidth,
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
          that.uploadheadImg(bas)
        }
      })
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
  uploadheadImg(uploadheadImg){
    var that = this
    util.kmRequest({
      url: uploadPictureUrl,
      data:{
       picMap: uploadheadImg,   
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          var img = JSON.parse(res.data.data)[0]
          that.setData({
            headImg: img.headIcon
          })
          that.userimg(img.headIcon)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  userimg(img){
   var that = this
   util.kmRequest({
     url: saveHedeImgUrl,
     data:{
       userId: app.globalData.kmUserInfo.id,
       img:img
     },
     success(res){
       console.log(res)
       if(res.data.status == 1){
         app.globalData.kmUserInfo = JSON.parse(res.data.data)[0]
         setTimeout(()=>{
           wx.showToast({
             title: '修改成功',
           })
         },200)
       }
     }
   })
  },
  name(){
  wx.navigateTo({
    url: '/pages/user/swname/swname',
  })
  },
  paypassword(){
    wx.navigateTo({
      url: '/pages/user/patcode/paycode',
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
    this.information()
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