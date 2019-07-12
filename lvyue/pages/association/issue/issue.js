const config = require('../../../config.js')
const util =require('../../../utils/util.js')
const saveTopicContentUrl = config.saveTopicContentUrl
const uploadTopicImageUrl = config.uploadTopicImageUrl
// const saveReplyUrl = config.saveReplyUrl
// const saveReplyUrls = config.saveReplyUrls
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    imgnum:0,
    price:0,
    busiId:null,
    busiType:'',
    goodsname:'',
    goodsimg:'',
    title:'',
    img:[],
    id:'' ,
    type:'',
    },
  title(e){
    var num = 
    this.setData({
      num: e.detail.value.length,
      title: e.detail.value
    })
  },
  detail(e){
   var that = this
   var index = e.currentTarget.dataset.index
   var img = that.data.img
   var imgs = img.splice(index, 1);
   that.setData({
     img:img,
     imgnum: img.length
   })
   wx.showToast({
     title: '删除成功',
   })
  },
  img(e){
    console.log(e)
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var img = that.data.img
        var tempFilePaths = res.tempFilePaths
        tempFilePaths.forEach((i)=>{
          img.push(i)
        })
        that.setData({
          img:img,
          imgnum:img.length
        })
      }
    })
  },
  formSubmit(e){
   var that = this
    if (that.data.id == '' && that.data.type == ''){
     if (that.data.img.length == 0) {
       wx.showToast({
         title: '请至少添加一张图片',
         icon: 'none'
       })
       return
     } else if (e.detail.value.title == '') {
       wx.showToast({
         title: '请输入标题',
         icon: 'none'
       })
       return
     } else if (e.detail.value.content == '') {
       wx.showToast({
         title: '请输内容',
         icon: 'none'
       })
       return
     }
     if (that.data.busiId == null) {
       var goodsId = ''
       var busiType = ''
     } else {
       var goodsId = that.data.busiId.goodsId
       var busiType = that.data.busiId.goodsType
     }
     util.kmRequest({
       url: saveTopicContentUrl,
       data: {
         userId: app.globalData.kmUserInfo.id,
         busiId: goodsId,
         busiType: busiType,
         title: e.detail.value.title,
         content: e.detail.value.content,
       },
       method: "post",
       success: (res) => {
         if (res.data.status == 1) {
           var img = that.data.img
           var topicId = res.data.data
           for (var i = 0; i < img.length; i++) {
             wx.uploadFile({
               url: uploadTopicImageUrl, //仅为示例，非真实的接口地址
               filePath: img[i],
               name: 'file',
               formData: {
                 topicId: topicId,
                 source: "wx_ly"
               },
               success(res) {
                 var msg = JSON.parse(res.data)
                 if (res.statusCode == 200 && msg.status == 1) {
                   if (img.length == i) {
                     wx.showToast({
                       title: '发布成功',
                     })
                     setTimeout(() => {
                       wx.redirectTo({
                         url: '/pages/association/attention/attention'
                       })
                     }, 300)
                   }
                 }else{
                   wx.showToast({
                     title: '发布失败',
                   })
                 }
               }
             })
           }
         }
       }
     })
    }    
  },
  goods(){
    wx.navigateTo({
      url: '/pages/suber/add/add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        text: '发布',
        placeholder: '发布你的心得体会吧!'
      })
  },
  shutbtn(){
    this.setData({
      goodsname: '',
      goodsimg:'',
      price: '',
      busiId: null,
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
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var goodsname =''
    var goodsimg = ''
    var price = ''
    if (currPage.data.busiId != null){
        goodsname = currPage.data.busiId.goodsName + currPage.data.busiId.subtitle
        price = currPage.data.busiId.price
        goodsimg = currPage.data.busiId.img
    }
    this.setData({
      goodsname: goodsname,
      goodsimg: goodsimg,
      price: price,
      busiId: currPage.data.busiId
    })
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