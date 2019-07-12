const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getAllTopicsUrl = config.getAllTopicsUrl
const likeTopicUrl = config.likeTopicUrl
const myFollowUrl = config.myFollowUrl
const saveReplyUrl = config.saveReplyUrl
const shareTopicUrl = config.shareTopicUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgwidth:'',
    focus: false,
    active:true,
    placeholder: '添加评论',
    currentData:1,
    discover:null,
    attention:null,
    loadingType: 0,
    loadingTypes:0,
    loding: false,
    lodings:false,
    hiddenNone:true,
    hiddenNones: true,
    page:1,
    pages:1,
    id:'',
    topicId:'',
    content:'',
  },
  discover(){
   var that = this
    util.kmRequest({
      url: getAllTopicsUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        page: that.data.page,
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var discover = JSON.parse(res.data.data)[0].pageData
          if (discover.length == 0 && that.data.page > 1) {
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            });
          } else if (that.data.page == 1 && discover.length < 10) {
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            });
          }
          if (that.data.discover != null) {
            var discovers = that.data.discover
            var discover = discovers.concat(discover)
          }
          that.setData({
            discover: discover,
          })
        }else if(res.data.status == 6){
         
        }
        if (that.data.discover == null || that.data.discover.length == 0) {
          that.setData({
            hiddenNone: ''
          })
        } else {
          that.setData({
            hiddenNone: true
          })
        }
      }
    })
  },
  loadImage: function (e) {
    var index = e.currentTarget.dataset.index; //图片所在索引
    var dataList = this.data.discover;
    var obj = dataList[index];
    dataList[0].height = 452
    dataList[1].height = 370
    if(index > 1){
        obj.height = 452
    }
    this.setData({
      discover: dataList,
    });
  },
  issue(){
    wx.navigateTo({
      url: '/pages/association/issue/issue',  
    })
  },
  like(e){
   var that = this
    if (e.currentTarget.dataset.date == 1){
      var discover = that.data.discover
      var attention = that.data.attention
      var like = that.data.attention[e.currentTarget.dataset.index]
      if (like.isLile == 1 || like.isLike == 1){
      }else{
        util.kmRequest({
          url: likeTopicUrl,
          data: {
            userId: app.globalData.kmUserInfo.id,
            topicId: like.topicId
          },
          method: "post",
          success: (res) => {
            console.log(res)
            if (res.data.status == 1) {
              attention.forEach((i) => {
                if (i.topicId == like.topicId) {
                  i.likeQuantity = i.likeQuantity + 1
                  i.isLike = 1
                  that.setData({
                    attention: attention
                  })
                }
              })
              if (discover != null){
                discover.forEach((i) => {
                  if (i.topicId == like.topicId) {
                    i.likeQuantity = i.likeQuantity + 1
                    i.isLile = 1
                    that.setData({
                      discover: discover
                    })
                  }
                })
              }
            }
          }
        })
      }
    }else{
   var discover = that.data.discover
   var attention = that.data.attention
   var like = that.data.discover[e.currentTarget.dataset.index]
      if (like.isLile == 1 || like.isLike == 1){
    }else{
      util.kmRequest({
        url: likeTopicUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          topicId: like.topicId
        },
        method: "post",
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            discover.forEach((i)=>{
              if (i.topicId == like.topicId){
                i.likeQuantity = i.likeQuantity+1 
                i.isLile = 1
                that.setData({
                  discover: discover
                })
              }
            })
            if (attention != null){
              attention.forEach((i) => {
                if (i.topicId == like.topicId) {
                  i.likeQuantity = i.likeQuantity + 1
                  i.isLike = 1
                  that.setData({
                    attention: attention
                  })
                }
              })
            }
          } 
        }
      })
     }
    }
  },
  details(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/association/details/details?id='+id,
    })
  },
  checkCurrent(e){
    this.setData({
      currentData: e.currentTarget.dataset.index
    })
  },
  eventchange(e){
   this.setData({
    currentData:e.detail.current
   }) 
  },
  attention(){
    var that = this
    util.kmRequest({
      url: myFollowUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        page: that.data.pages,
      },
      method:"post",
      success:(res)=>{
        console.log(res)
        if(res.data.status == 1){
          var attention = JSON.parse(res.data.data)[0].pageData
          if (attention.length == 0 && that.data.pages > 1) {
            that.setData({
              lodings: true,
              loadingTypes: 2,
              pages: that.data.pages - 1,
            });
          } else if (attention.length < 10 && that.data.pages == 1 ){
            that.setData({
              lodings: true,
              loadingTypes: 2,
              pages: that.data.pages - 1,
            });
          }
          if (that.data.attention != null) {
            var attentions = that.data.attention
            var attention = attentions.concat(attention)
          }
          that.setData({
            attention: attention
          })
        }else if(res.data.status == 6){

        }
        if (that.data.attention == null || that.data.attention.length == 0) {
          that.setData({
            hiddenNones: ''
          })
        } else {
          that.setData({
            hiddenNones: true
          })
        }
      }
    })
  },
  concet(content) {
    var that = this
    util.kmRequest({
      url: saveReplyUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        topicId: that.data.id,
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
  comments(e) {
    console.log(e)
    this.setData({
      placeholder: '添加评论',
      focus: true,
      id: e.currentTarget.dataset.id
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
  cancel() {
    this.setData({
      focus: false,
      content: '',
    })
  },
  previewImage(e) {
    console.log(e)
    var that = this
    var current = e.target.dataset.src;
    var list = []
    that.data.attention.forEach((i)=>{
      if (i.topicId == e.target.dataset.id){
        var img = i.imgUrlList
        img.forEach((i) => {
          list.push(i.imgUrl)
        })
      }
    })
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: list // 需要预览的图片http链接列表  
    })
  },  
 
  scroll(e) {
    var that = this
    if (that.data.loadingType != 0 || that.data.loding || that.data.hiddenNone == false) {
      return;
    }
    that.setData({
      loadingType: 1,
    });
    setTimeout(() => {
      that.setData({
        loadingType: 0,
        page: that.data.page + 1,
        // active: true,
      })
      that.discover()
    }, 1000)
  }, 
  scrolls(){
    var that = this
    if (that.data.loadingTypes != 0 || that.data.lodings || that.data.hiddenNones == false) {
      return;
    }
    that.setData({
      loadingTypes: 1,
    });
    setTimeout(() => {
      that.setData({
        loadingTypes: 0,
        pages: that.data.pages + 1,
        // active: true,
      })
      that.attention()
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowHeight = ''
    var imgwidth = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 50;
        imgwidth = parseInt(res.windowWidth - 10);
      }
    })
    this.setData({
      windowHeight: windowHeight,
      imgwidth: imgwidth
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
    this.setData({
      discover: null,
      attention: null,
      loadingType: 0,
      loadingTypes: 0,
      loding: false,
      lodings: false,
      hiddenNone: true,
      hiddenNones: true,
      page: 1,
      pages: 1,
      active:true,
    })
    if (app.globalData.page == 1 && app.globalData.status == '分享') {
      util.kmRequest({
        url: shareTopicUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          topicId: that.data.topicId,
        },
        method: "post",
        success: (res) => {
          that.setData({
            topicId:'',
          })
          app.globalData.page = 0
          app.globalData.status = ''
          that.discover()
          that.attention()
        }
      })
    }else{
      that.discover()
      that.attention()
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
  onShareAppMessage: function (e) {
    console.log(e)
    var that = this
    var attention = that.data.attention
    var id = e.target.dataset.id
    var title = ''
    var imgUrl = ''
    attention.forEach((i)=>{
      if (i.topicId == id){
        app.globalData.status = '分享'
        title=i.title,
        imgUrl=i.imgUrlList[0].imgUrl
        that.setData({
          topicId:id
        })
      }
    }) 
    return {
      title: title,
      imageUrl: imgUrl,
      path: '/pages/association/details/details?id=' + id, //这里设定都是以"/page"开头,并拼接好传递的参数
    }
  }
})