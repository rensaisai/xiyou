const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const topicDetailsUrl = config.topicDetailsUrl
const followUrl = config.followUrl
const cancelFollowUrl = config.cancelFollowUrl
const saveReplyUrlm = config.saveReplyUrlm
const likeTopicUrl = config.likeTopicUrl
const likeTopicReplyUrl = config.likeTopicReplyUrl
const shareTopicUrl = config.shareTopicUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    details:null,
    focus:false,
    placeholder:'添加评论',
    stat:'',
    content:'',
    parentReplyId:'',
  },
  goods(e){
   console.log(e)
    if (e.currentTarget.dataset.goodstype == 2){
       wx.navigateTo({
         url: '/pages/line/scattered/scattered?id=' + e.currentTarget.dataset.goodsid,
       })
    } else if (e.currentTarget.dataset.goodstype == 1){
      wx.navigateTo({
        url: '/pages/line/sincedetails/sincedetails?id=' + e.currentTarget.dataset.goodsid,
      })
    }else{
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + e.currentTarget.dataset.goodsid,
      })
    }
  },
  details(){
   var that = this
    util.kmRequest({
      url: topicDetailsUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        topicId: that.data.id,
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var details = JSON.parse(res.data.data)[0]
          console.log(details)
          if (details.replyList.length > 0){
            for (var i = 0; i < details.replyList.length; i++) {
              let phones = details.replyList[i].phone.slice(3, 7)
              details.replyList[i].phones = details.replyList[i].phone.replace(phones, '****')
            }
          }
          if (details.isFollow == 1){
            var stat = '取消'
          }else{
            var stat = '关注'
          }
          that.setData({
            details: details,
            stat:stat
          })
        }
      }
    })
  },
  attention(){
    var that = this
    var details = that.data.details
    if (details.isFollow == 0) {
      util.kmRequest({
        url: followUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          followerId: details.authorId
        },
        method: "post",
        success: (res) => {
          if (res.data.status == 1) {
            details.isFollow = 1
            that.setData({
              details: details,
              stat: '取消'
            })
          }
        }
      })
    } else {
      util.kmRequest({
        url: cancelFollowUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          followerId: details.authorId
        },
        method: "post",
        success: (res) => {
          if(res.data.status == 1){
            details.isFollow = 0
            that.setData({
              details: details,
              stat: '关注'
            })
          } 
        }
      })
    }
  },
  like() {
    var that = this
    var details = that.data.details
    if (details.isLike == 1) {
    } else {
      util.kmRequest({
        url: likeTopicUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          topicId: details.topicId
        },
        method: "post",
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            details.likeQuantity = details.likeQuantity + 1
            details.isLike = 1
            that.setData({
              details: details
            })
          }
        }
      })
    }
  },
  likecomment(e){
   console.log(e)
   var that = this
   var details = that.data.details
   var comment = that.data.details.replyList[e.currentTarget.dataset.index]
   console.log(comment)
   if (comment.isLike){

   }else{
     util.kmRequest({
       url: likeTopicReplyUrl,
       data: {
         userId: app.globalData.kmUserInfo.id,
         topicId: comment.topicId,
         replyId: comment.replyId
       },
       method:"post",
       success: (res) => {
         console.log(res)
         if(res.data.status == 1){
           for (var i = 0; i < details.replyList.length; i++){
             if (details.replyList[i].replyId == comment.replyId){
               details.replyList[i].isLike = 1
               details.replyList[i].likeQuantity = details.replyList[i].likeQuantity+1
               that.setData({
                 details: details
               })
              }
           }
         }
       }
     })
   }
  },
  replycomment(e){
    var that = this
    var comment = that.data.details.replyList[e.currentTarget.dataset.index]
    console.log(comment)
    that.setData({
      focus: true,
      parentReplyId: comment.replyId,
      placeholder: '回复' + comment.phones,
     
    })
  },
  concet(content){
    var that = this
    var details = that.data.details
    if (that.data.parentReplyId != ''){
      var parentReplyId = that.data.parentReplyId
    }else{
      var parentReplyId = ''
    }
    util.kmRequest({
      url: saveReplyUrlm,
      data:{
        userId: app.globalData.kmUserInfo.id,
        topicId: details.topicId,
        parentReplyId: parentReplyId,
        content: content
      },
      method:"post",
      success:(res)=>{
        if(res.data.status == 1){
          setTimeout(()=>{
            wx.showToast({
              title: '评论成功',
            })
          },200)
          that.details()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  allcomment(){
    wx.navigateTo({
      url: '/pages/association/comment/comment?topicId=' + this.data.details.topicId,
    })
  },
  comments(){
    var that = this
    if (that.data.focus == false){
      this.setData({
        placeholder: '添加评论',
        focus: true
      })
    }else{
      this.setData({
        placeholder: '',
        focus: false
      })
    }
  },
  complete(e){
    var content = e.detail.value
    if (content != '') {
      this.concet(content)
    }
    this.setData({
      focus:false,
      content:'',
    })
  },
  // bindblurs(e){
  //   var content = e.detail.value
  //   if (content != ''){
  //     this.concet(content)
  //   }
  //   this.setData({
  //     active: false,
  //     focus:false,
  //     content: '',
  //   })
  // },
  cancel(){
    this.setData({
      focus:false,
      content: '',
    })
  },
  previewImage(e) {
    console.log(e)
    var that = this
    var current = e.target.dataset.src;
    var list = []
    var img = that.data.details.imgUrlList
    console.log(img)
    img.forEach((i) => {
      var img = i.imgUrl
      list.push(i.imgUrl)
      })
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: list // 需要预览的图片http链接列表  
    })
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    var that = this
    that.setData({
      focus: false,
    })
    if (app.globalData.page == 1 && app.globalData.status == '分享') {
      util.kmRequest({
        url: shareTopicUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          topicId: that.data.id,
        },
        method: "post",
        success: (res) => {
          app.globalData.page = 0
          app.globalData.status = ''
          that.details()
        }
      })
    }else{
      that.details()
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
    app.globalData.status = '分享'
    return {
      title: this.data.details.title,
      imageUrl: this.data.details.imgUrlList[0].imgUrl,
      path: '/pages/association/details/details?id=' + this.data.id, //这里设定都是以"/page"开头,并拼接好传递的参数
    }
  },
})