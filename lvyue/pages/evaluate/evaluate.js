const config = require('../../config.js')
const util = require('../../utils/util.js')
const getAllCommentsUrl = config.getAllCommentsUrl
const getAllTouristReplysUrl = config.getAllTouristReplysUrl
const cancelLikeCommentUrl = config.cancelLikeCommentUrl
const likeCommentUrl = config.likeCommentUrl
const cancelLikeCommentReplyUrl = config.cancelLikeCommentReplyUrl
const likeCommentReplyUrl = config.likeCommentReplyUrl
const saveReplyURLS = config.saveReplyURLS
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluate:null,
    page:1,
    length:0,
    id:'',
    type:'',
    loadingType: 0,
    hiddenNone: true,
    likes:null,
    replys:[],
    focus:false,
    commentId:'',
  },
  allevaluate(){
    var that = this
    if (that.data.type == 1){
      var busiType = 0
    }
    if (that.data.type == 2) {
      var busiType = 2
    }
    if (that.data.type == 3) {
      var busiType = 3
    }
      util.kmRequest({
        url: getAllCommentsUrl,
        data: {
          busiId: that.data.id,
          busiType: busiType,
          userId: app.globalData.kmUserInfo.id,
          page: that.data.page
        },
        method: "post",
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            var evaluate = JSON.parse(res.data.data)[0].pageData[0].data
            if (evaluate.length == 0 && that.data.page > 1) {
              that.setData({
                loding: true,
                loadingType: 2,
                page: that.data.page - 1,
              });
            }
            if (that.data.evaluate != null) {
              var circuits = that.data.evaluate
              var evaluate = circuits.concat(evaluate)
            }
            that.setData({
              evaluate: evaluate,
              length: evaluate.length
            })
          }
          if (that.data.evaluate == null || that.data.evaluate.length == 0) {
            that.setData({
              hiddenNone: '',
            })
          } else {
            that.setData({
              hiddenNone: true,
            })
          }
        }
      })
    // }else{
    //   util.kmRequest({
    //     url: getAllTouristReplysUrl,
    //     data: {
    //       touristRouteId: that.data.id,
    //       page: that.data.page,
    //     },
    //     method: "post",
    //     success: (res) => {
    //       if (res.data.status == 1) {
    //         var evaluate = JSON.parse(res.data.data)[0].pageData[0].data
    //         console.log(e)
    //         if (evaluate.length == 0 && that.data.page > 1) {
    //           that.setData({
    //             loding: true,
    //             loadingType: 2,
    //             page: that.data.page - 1,
    //           });
    //         }
    //         if (that.data.evaluate != null) {
    //           var circuits = that.data.evaluate
    //           var evaluate = circuits.concat(evaluate)
    //         }
    //         that.setData({
    //           evaluate: evaluate,
    //           length: evaluate.length
    //         })
    //       }
    //       if (that.data.evaluate == null || that.data.evaluate.length == 0) {
    //         that.setData({
    //           hiddenNone: '',
    //         })
    //       } else {
    //         that.setData({
    //           hiddenNone: true,
    //         })
    //       }
    //     }
    //   })
    
  },
  likecomment(e){
    var that = this
    var list = that.data.evaluate
    var like = list[e.currentTarget.dataset.index]
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 2] //获取当前页面的对象
    console.log(currentPage)
    var islike = currentPage.data.islike
    var arr = []
    for (var i = 0; i < list.length; i++){
      if (list[i].commentId == like.commentId){
        if (list[i].isLile == 0) {
          list[i].isLile = 1
          list[i].likeQuantity = list[i].likeQuantity+1
        } else {
          list[i].isLile = 0
          list[i].likeQuantity = list[i].likeQuantity - 1
        }
        arr.push(list[i])
        break;
      }
    }
    that.setData({
      evaluate: list
    })
    for (var i = 0; i < arr.length; i++) {
      if (islike.indexOf(arr[i]) == -1) {
        islike.push(arr[i]);
      }
    }
  },
  detail(e){
    this.data.likes = null
    this.data.replys = []
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 2] //获取当前页面的对象
    if (currentPage.data.islike.length > 0) {
      currentPage.data.islike.forEach((i) => {
        if (i.isLile == 1) {
          util.kmRequest({
            url: likeCommentUrl,
            data: {
              userId: app.globalData.kmUserInfo.id,
              commentId: i.commentId
            },
            method: "post",
            success: (res) => {
              console.log(res)
            }
          })
        } else {
          util.kmRequest({
            url: cancelLikeCommentUrl,
            data: {
              userId: app.globalData.kmUserInfo.id,
              commentId: i.commentId
            },
            method: "post",
            success: (res) => {
              console.log(res)
            }
          })
        }
      })
      currentPage.data.islike = []
    }
    wx.navigateTo({
      url: '/pages/suber/comment/comment?id='+e.currentTarget.dataset.id,
    })
  },
  replycomment(e) {
    this.setData({
      placeholder: '添加评论',
      focus: true,
      commentId: this.data.evaluate[e.currentTarget.dataset.index].commentId
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
  cancel(){
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
  concet(content) {
    var that = this
    util.kmRequest({
      url: saveReplyURLS,
      data: {
        userId: app.globalData.kmUserInfo.id,
        commentId: that.data.commentId,
        parentReplyId: '',
        content: content
      },
      method: "post",
      success: (res) => {
        if (res.data.status == 1) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      type:options.type
    })
    this.allevaluate()
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
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    if (currentPage.data.likes != null){
      var evaluate = that.data.evaluate
      for (var i = 0; i < evaluate.length; i++){
        if (evaluate[i].commentId == currentPage.data.likes.commentId) {
          if (currentPage.data.likes.isLike == 0 && evaluate[i].isLile == 1) {
            evaluate[i].isLile = 0
            evaluate[i].likeQuantity = evaluate[i].likeQuantity - 1
          } else if (currentPage.data.likes.isLike == 1 && evaluate[i].isLile == 0) {
            evaluate[i].isLile = 1
            evaluate[i].likeQuantity = evaluate[i].likeQuantity + 1
          }
          break;
        }
      }
      that.setData({
        evaluate: evaluate
      })
      if (currentPage.data.likes.isLike == 0){
        util.kmRequest({
          url: cancelLikeCommentUrl,
          data: {
            userId: app.globalData.kmUserInfo.id,
            commentId: currentPage.data.likes.commentId
          },
          method: "post",
          success: (res) => {
            console.log(res)
          }
        })
      }else{
        util.kmRequest({
          url: likeCommentUrl,
          data: {
            userId: app.globalData.kmUserInfo.id,
            commentId: currentPage.data.likes.commentId
          },
          method: "post",
          success: (res) => {
            console.log(res)
          }
        })
      }
    }
    if (currentPage.data.replys.length > 0){
      for (var i = 0; i < currentPage.data.replys.length; i++){
        if (currentPage.data.replys[i].isLike == 0){
           util.kmRequest({
             url: cancelLikeCommentReplyUrl,
             data:{
               userId: app.globalData.kmUserInfo.id,
               commentId: currentPage.data.replys[i].commentId,
               replyId: currentPage.data.replys[i].replyId
             },
             method: "post",
             success:(res)=>{
               console.log(res)
             }
           })
        }else{
          util.kmRequest({
            url: likeCommentReplyUrl,
            data: {
              userId: app.globalData.kmUserInfo.id,
              commentId: currentPage.data.replys[i].commentId,
              replyId: currentPage.data.replys[i].replyId
            },
            method:"post",
            success: (res) => {
              console.log(res)
            }
          })
        }
      }
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
      that.allevaluate()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})