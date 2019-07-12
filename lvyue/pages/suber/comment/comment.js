const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const commentDetailsUrl = config.commentDetailsUrl
const saveReplyURLS = config.saveReplyURLS
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:null,
    focus:false,
    id:'',
  },
  detail(){
    var that = this
    util.kmRequest({
      url: commentDetailsUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        commentId:that.data.id,
      },
      method:"post",
      success:(res)=>{
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          that.setData({
            details:list
          })
        }
       
      }
    })
  },
  like(){
    var that = this
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 2] //获取当前页面的对象
    var like = that.data.details
    if (like.isLike == 0){
      like.isLike = 1
      like.likeQuantity = like.likeQuantity+1
    }else{
      like.isLike = 0
      like.likeQuantity = like.likeQuantity - 1
    }
    that.setData({
      details: like
    })
    currentPage.data.likes = like
  },
  comments(e) {
    console.log(e)
    this.setData({
      placeholder: '添加评论',
      focus: true,
    })
  },
  complete(e) {
    var content = e.detail.value
    if (content != '') {
      this.concet(content)
    }
    this.setData({
      focus: false,
      content: '',
    })
  },
  cancel() {
    this.setData({
      focus: false,
      content: '',
    })
  },
  // bindblurs(e){
  //   var content = e.detail.value
  //   if (content != ''){
  //     this.concet(content)
  //   }
  //   this.setData({
  //     focus:false,
  //     content: '',
  //   })
  // },
  concet(content) {
    var that = this
    util.kmRequest({
      url: saveReplyURLS,
      data: {
        userId: app.globalData.kmUserInfo.id,
        commentId: that.data.details.commentId,
        parentReplyId: '',
        content: content
      },
      method: "post",
      success: (res) => {
        if (res.data.status == 1) {
          that.detail()
          setTimeout(() => {
            wx.showToast({
              title: '评论成功',
            })
          }, 200)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  likecomment(e){
    var that = this
    var arr = []
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 2] //获取当前页面的对象
    var replys = currentPage.data.replys
    var details = that.data.details
    var reply = details.replyList[e.currentTarget.dataset.index]
    if (reply.isLike == 0){
      reply.isLike = 1
      reply.likeQuantity = reply.likeQuantity+1
    }else{
      reply.isLike = 0
      reply.likeQuantity = reply.likeQuantity - 1
    }
    arr.push(reply)
    that.setData({
      details: details
    })
    for (var i = 0; i < arr.length; i++) {
      if (replys.indexOf(arr[i]) == -1) {
        replys.push(arr[i]);
      }
    }
  },
  goods(e){
   console.log(e)
    var goodsid = e.currentTarget.dataset.goodsid
    var goodstype = e.currentTarget.dataset.goodstype
    if (goodstype == 0){
      wx.redirectTo({
        url: '/pages/suber/goods/goods?id=' + goodsid,
      })
    }
    if (goodstype == 2){
      wx.redirectTo({
         url: '/pages/line/sincedetails/sincedetails?id=' + goodsid,
      })
    }
    if(goodstype == 3){
      wx.redirectTo({
        url: '/pages/line/scattered/scattered?id=' + goodsid,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.detail()
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