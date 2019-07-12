const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const getAllTopicReplysUrl = config.getAllTopicReplysUrl
const likeTopicReplyUrl = config.likeTopicReplyUrl
const saveReplyUrl = config.saveReplyUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    id:'',
    parentReplyId:'',
    comment:null,
    loadingType: 0,
    hiddenNone: true,
    focus: false,
    placeholder: '添加评论',
    content:'',
  },
  comment(){
   var that = this
    util.kmRequest({
      url: getAllTopicReplysUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        topicId:that.data.id,
        page:that.data.page,
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var comment = JSON.parse(res.data.data)[0].pageData
          if (comment.length == 0 && that.data.page > 1) {
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            });
          } else if (that.data.page ==1 && comment.length < 10){
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            });
          }
          for (var i = 0; i < comment.length; i++){
            let phones = comment[i].phone.slice(3,7)
            comment[i].phones = comment[i].phone.replace(phones,'****')
          }
          if (that.data.comment != null) {
            var circuits = that.data.comment
            var comment = circuits.concat(comment)
          }
          that.setData({
            comment: comment,
            length: comment.length
          })
        }else if(res.data.status == 6){
         
        }
        if (that.data.comment == null || that.data.comment.length == 0){
          that.setData({
            hiddenNone:'',
          })
        }else{
          that.setData({
            hiddenNone:true,
          })
        }
      }
    })
  },
  likecomment(e) {
    console.log(e)
    var that = this
    var comment = that.data.comment
    var comments = that.data.comment[e.currentTarget.dataset.index]
    if (comment.isLike) {

    } else {
      util.kmRequest({
        url: likeTopicReplyUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          topicId: that.data.id,
          replyId: comments.replyId
        },
        method: "post",
        success: (res) => {
          if (res.data.status == 1) {
            for (var i = 0; i < comment.length; i++) {
              if (comment[i].replyId == comments.replyId) {
                comment[i].isLike = 1
                comment[i].likeQuantity = comment[i].likeQuantity + 1
                that.setData({
                  comment: comment
                })
              }
            }
          }
        }
      })
    }
  },
  replycomment(e) {
    var that = this
    var comment = that.data.comment[e.currentTarget.dataset.index]
    that.setData({
      focus: true,
      parentReplyId: comment.replyId,
      placeholder: '回复' + comment.phones,
    })
  },
  concet(content) {
    var that = this
    var comment = that.data.comment
    if (that.data.parentReplyId != '') {
      var parentReplyId = that.data.parentReplyId
    } else {
      var parentReplyId = ''
    }
    util.kmRequest({
      url: saveReplyUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        topicId: that.data.id,
        parentReplyId: parentReplyId,
        content: content
      },
      method: "post",
      success: (res) => {
        if (res.data.status == 1) {
          that.setData({
            loding: false,
            loadingType: 0,
            page: 1,
            comment: null,
          })
          setTimeout(() => {
            wx.showToast({
              title: '评论成功',
            })
          }, 200)
          that.comment()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  comments() {
    this.setData({
      placeholder: '添加评论',
      focus: true
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
  // bindblurs(e) {
  //   var content = e.detail.value
  //   if (content != '') {
  //     this.concet(content)
  //   }
  //   this.setData({
  //     focus: false,
  //     content: '',
  //   })
  // },
  cancel() {
    this.setData({
      focus: false,
      content: '',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.topicId
    })
    this.comment()
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
    var that = this
    if (this.data.loadingType != 0 || this.data.loding || this.data.hiddenNone == false) {
      return;
    }
    this.setData({
      loadingType: 1
    });
    setTimeout(() => {
      that.setData({
        loadingType: 0,
        page: that.data.page + 1
      })
      that.comment()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})