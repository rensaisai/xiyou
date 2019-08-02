const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const saveWXCommentContentUrl = config.saveWXCommentContentUrl
const uploadWXCommentImageUrl = config.uploadWXCommentImageUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starlevel:[0,1,2,3,4],
    posit:4,
    loding:false,
    imgnum: 0,
    placeholder:'',
    star:'/image/star.png',
    star1:'/image/star1.png',
    text:'非常好',
    id:'',
    type:'',
    goodsimg:'',
    orderid:'',
    img:[]
  },
  star(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var text = ''
    switch (index) {
      case 4:
        text = '非常好'
        break;
      case 3:
        text = '很好'
        break;
      case 2:
        text = '一般'
        break;
      case 1:
        text = '差'
        break;
      case 0:
        text = '极差'
        break;
    } 
    that.setData({
      posit: index,
      text:text
    })
  },
  formSubmit(e){
    console.log(e)
    var that = this
    if (e.detail.value.content == ''){
      wx.showToast({
        title: '请输入评价内容',
        icon:'none'
      })
      return
    }
    if(that.data.type == 1){
      var busiType = 0
    }
    if (that.data.type == 2){
      var busiType =  2
    }
    if (that.data.type == 3) {
      var busiType = 3
    }
    that.setData({
      loding:true
    })
    util.kmRequest({
      url: saveWXCommentContentUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        busiId:that.data.id,
        busiType:busiType,
        content: e.detail.value.content,
        grade: that.data.posit+1,
        orderId: that.data.orderid
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          if (that.data.img.length == 0) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 200)
            wx.showToast({
              title: '评价成功',
            })
            that.setData({
              loding: false
            })
          }else{
            var img = that.data.img
            for (var i = 0; i < img.length; i++) {
              wx.uploadFile({
                url: uploadWXCommentImageUrl, //仅为示例，非真实的接口地址
                filePath: img[i],
                name: 'files',
                formData: {
                  commentId: res.data.data,
                  source: "wx_ly"
                },
                success(res) {
                  console.log(res)
                  var msg = JSON.parse(res.data)
                  if (res.statusCode == 200 && msg.status == 1) {
                    if (img.length == i) {
                      setTimeout(() => {
                        wx.redirectTo({
                          url: '/pages/user/myorder/myorder',
                        })
                      }, 200)
                      wx.showToast({
                        title: '评价成功',
                      })
                      that.setData({
                        loding: false
                      })
                    }
                  }else{
                    wx.showToast({
                      title: '评价失败',
                      icon: 'none'
                    })
                    that.setData({
                      loding: false
                    })
                  }
                }
              })
            }
          }
        }else{
          that.setData({
            loding: true
          })
          wx.showToast({
            title: '评价失败',
            icon:'none'
          })
        }
      }
    })
  },
  detail(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var img = that.data.img
    var imgs = img.splice(index, 1);
    that.setData({
      img: img,
      imgnum: img.length
    })
    wx.showToast({
      title: '删除成功',
    })
  },
  img(e) {
    console.log(e)
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var img = that.data.img
        var tempFilePaths = res.tempFilePaths
        tempFilePaths.forEach((i) => {
          img.push(i)
        })
        that.setData({
          img: img,
          imgnum: img.length
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     id: options.id,
     type: options.type,
     goodsimg: options.img,
     orderid: options.orderid,
     placeholder:'宝贝满足你的期待吗？快来评价下它吧'
   })
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