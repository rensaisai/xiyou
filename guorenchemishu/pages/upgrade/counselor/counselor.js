const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserStatisticsUrl = config.getUserStatisticsUrl
const getUserStareByUserId2Url = config.getUserStareByUserId2Url
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    userName: '',
    codeimg:'',
    userNo: '',
    name:'',
    headImg:'',
    width:'',
    active1:false,
    active2: false,
    active3: false,
    membercount:0,
    commission:0,
    member:0,
    swiperIndex:0,
  },
  must(){
   wx.navigateTo({
     url: '/pages/upgrade/must-buy/must-buy',
   })
  },
  binding(){
   wx.navigateTo({
     url: '/pages/upgrade/binding/binding',
   })
  },
  bank(){
  wx.navigateTo({
    url: '/pages/users/creditcards/list/creditcardlist',
  })
  },
  withdraw(){
    wx.navigateTo({
      url: '/pages/users/withdrawcash/list/withdrawcashlist',
    })
  },
  commission(){
    wx.navigateTo({
      url: '/pages/cars/mycar/commission/commission',
    })
  },
  team(){
    wx.navigateTo({
      url: '/pages/cars/mycar/team/team',
    })
  },
  client(){
    wx.navigateTo({
      url: '/pages/cars/mycar/client/client',
    })
  },
  fanslist(){
    wx.navigateTo({
      url: '/pages/upgrade/fanslist/fanslist',
    })
  },
  statistics(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getUserStatisticsUrl,
        param:{}
      },
      success:function(res){
        if(res.data.status==1){
          var statistics = JSON.parse(res.data.data)[0]
          console.log(statistics)
          that.setData({
            membercount: statistics.memberCount,
            member: statistics.memberCount2,
            commission: statistics.amount,
          })
        }
      }
    })
  },
  share() {
    this.showModal1()
  },
  previewImage() {
    // var current = e.target.dataset.src;
    var that = this
    var codeimg = that.data.codeimg
    var cundeimg = []
    codeimg.forEach(i=>{
      cundeimg.push(i.imgUrl)
    })
    var img = codeimg[that.data.swiperIndex].imgUrl
    console.log(img)
    wx.previewImage({
      current: img,
      urls: cundeimg
    })
  },
  save() {
    var that = this
    var codeimg = that.data.codeimg[that.data.swiperIndex].imgUrl
    wx.downloadFile({
      url: codeimg, 
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          var img = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              wx.showToast({
                title: '保存成功',
              })
              that.hideModal1()
            }
          })
        }
      }
    })
  },
  showModal1: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus1: true
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal1: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus1: false
      })
    }.bind(this), 150)
  },
  hider() {
    this.hideModal1()
  },
  sharecode() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getUserStareByUserId2Url,
        param:{}
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          var codeimg = JSON.parse(res.data.data)
          console.log(codeimg)
          that.setData({
            codeimg: codeimg
          })
        }
      }
    })
  },
  swiperChange(e){
    this.setData({
      swiperIndex: e.detail.current,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var headImg = '/image/headdefault.png'
    if (app.globalData.kmUserInfo.headImg != ''){
      headImg = app.globalData.kmUserInfo.headImg
    }
    this.setData({
      nickName: app.globalData.kmUserInfo.nickName,
      userName: app.globalData.kmUserInfo.userName,
      userNo: app.globalData.kmUserInfo.userNo,
      headImg: headImg
    })
    if (app.globalData.kmUserInfo.memberType == 1) {
        this.setData({
          name: '初级养代',
          width:0,
          active1:true
        })
      }
    if (app.globalData.kmUserInfo.memberType == 2) {
      this.setData({
        name: '中级养代',
        width:'40%',
        active1: true,
        active2: true,
      })
    }
    if (app.globalData.kmUserInfo.memberType == 3) {
      this.setData({
        name: '高级养代',
        width:'80%',
        active1: true,
        active2: true,
        active3: true,
      })
    }
    this.statistics()
    this.sharecode()
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
    var headImg = '/image/headdefault.png'
    if (app.globalData.kmUserInfo.headImg != '') {
      headImg = app.globalData.kmUserInfo.headImg
    }
    this.setData({
      nickName: app.globalData.kmUserInfo.nickName,
      userName: app.globalData.kmUserInfo.userName,
      userNo: app.globalData.kmUserInfo.userNo,
      headImg: headImg
    })
    if (app.globalData.kmUserInfo.memberType == 1) {
      this.setData({
        name: '初级养代',
        width: 0,
        active1: true
      })
    }
    if (app.globalData.kmUserInfo.memberType == 2) {
      this.setData({
        name: '中级养代',
        width: '40%',
        active1: true,
        active2: true,
      })
    }
    if (app.globalData.kmUserInfo.memberType == 3) {
      this.setData({
        name: '高级养代',
        width: '80%',
        active1: true,
        active2: true,
        active3: true,
      })
    }
    this.statistics()
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