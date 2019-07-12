const config = require('../../config.js')
const  util = require('../../utils/util.js')
const getPersonalInfoUrl = config.getPersonalInfoUrl
const getUserQRUrl = config.getUserQRUrl
const contractStatusUrl = config.contractStatusUrl
const isExistContractUrl = config.isExistContractUrl
const getUserInfoByUserIdUrl = config.getUserInfoByUserIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    team:0,
    active:false,
    codeimg:'',
    username: '',
    headimg: '',
    shopname: '',
    number: '',
    contract:'',
    identifyNo:'',
  },
  team(){
    var that = this
    util.kmRequest({
      url: getPersonalInfoUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var team = JSON.parse(res.data.data)[0]
          app.globalData.kmUserInfo = team.user
          that.setData({
            team: team.countTeam
          })
        }
      }
    })
  },
  setup(){
  if(!util.whetherlanding()){
    return
    }
    wx.navigateTo({
      url: "/pages/user/setup/setup"
    })
  },
  address(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/location/location?add='+1,
    })
  },
  information(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/certificate/certificate',
    })
  },
  bankcard(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/addbank/addbank',
    })
  },
  all(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/myorder/myorder?orderStatus=' + '' +'&currentData='+0,
    })
  },
  withdrawal(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/earnings/earnings',
    })
  },
  gold(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/gold/gold',
    })
  },
  teamnum(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/team/team',
    })
  },
  headimg(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/user/information/information',
    })
  },
  community(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/association/attention/attention',
    })
  },
  sale(){
    if (!util.whetherlanding()) {
      return
    }
    wx.navigateTo({
      url: '/pages/sale/sale',
    })
  },
  contract(){
    var that = this
    if (!util.whetherlanding()) {
      return
    }
    if (that.data.contract == '已完成'){
      util.kmRequest({
        url: isExistContractUrl,
        data: {
          userId: app.globalData.kmUserInfo.id,
          contractTemplateId: '1',
          version: ''
        },
        method: "post",
        success(res) {
          if (res.data.status == 1) {
            var date = JSON.parse(res.data.data)[0]
            console.log(date)
            wx.navigateTo({
              url: '/pages/agtext/agtext?contractId=' + date.contractId + '&signerId=' + date.signerId,
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/contract/deal/deal',
      })
    }
  },
  shareimg(){
   var that = this
   util.kmRequest({
     url: getUserQRUrl,
     data:{
       userId: app.globalData.kmUserInfo.id
     },
     success:function(res){
       if(res.data.status == 1){
         console.log(res.data.data)
         var codeimg = res.data.data
         console.log(codeimg)
         that.setData({
           codeimg: codeimg
         })
       }
     }
   })
  },
  previewImage(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  save(){
    var that = this
    wx.downloadFile({
      url: that.data.codeimg, // 仅为示例，并非真实的资源
      success(res) {
        if (res.statusCode === 200) {
          var img = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath:img,
            success(res) {
              wx.showToast({
                title: '保存成功',
              })
              that.hideModal()
            }
          })
        }
      }
    })
  },
  share(){
    if (!util.whetherlanding()) {
      return
    }
    if (app.globalData.kmUserInfo.isApp >1){
      this.showModal()
    }else{
      wx.showToast({
        title: '您还不是会员,请先升级会员',
        icon:'none',
      })
    }
  },
  hider(){
   this.hideModal()
  },
  showModal: function () {
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
      showModalStatus: true
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
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
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  contractstatus(){
   var that = this 
   util.kmRequest({
     url: contractStatusUrl,
     data:{
       userId:app.globalData.kmUserInfo.id,
     },
     method:"post",
     success(res){
       if(res.data.status == 1){
         var contract = JSON.parse(res.data.data)[0]
         var status = ''
         if (contract.status == 0){
           status ="待签署"
         }
         if (contract.status == 1) {
           status = "签署中"
         }
         if (contract.status == 2) {
           status = "已完成"
         }
         that.setData({
           contract: status
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
  userinformation(id) {
   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var username = '请登录'
    var headimg = '/image/header.png'
    var shopname = ''
    var number = ''
    var identifyNo = ''
    var appBalance = 0
    var coupon = 0
    if (app.globalData.kmUserInfo != null) {
      that.team()
      util.kmRequest({
        url: getUserInfoByUserIdUrl,
        data: {
          userId: app.globalData.kmUserInfo.id
        },
        success: function (res) {
          if (res.data.status == 1) {
            app.globalData.kmUserInfo = JSON.parse(res.data.data)[0]
            if (app.globalData.kmUserInfo.headImg != '' && app.globalData.kmUserInfo.headImg != null) {
              headimg = app.globalData.kmUserInfo.headImg
            }
            if (app.globalData.kmUserInfo.isApp == 1) {
              shopname = '粉丝店主'
            }
            if (app.globalData.kmUserInfo.isApp == 2) {
              shopname = '店主'
            }
            if (app.globalData.kmUserInfo.isApp == 3) {
              shopname = '金牌店主'
            }
            if (app.globalData.kmUserInfo.isApp == 4) {
              shopname = '特约店主'
            }
            if (app.globalData.kmUserInfo.isApp == 5) {
              shopname = '特约高级店主'
            }
            if (app.globalData.kmUserInfo.isApp == 6) {
              shopname = '特约资深店主'
            }
            if (app.globalData.kmUserInfo.nickName == '' || app.globalData.kmUserInfo.nickName == null) {
              var phone = app.globalData.kmUserInfo.phone
              var num = phone.slice(3, 7)
              username = phone.replace(num, '****')
            } else {
              username = app.globalData.kmUserInfo.nickName
            }
            if (app.globalData.kmUserInfo.isApp >= 3) {
              that.contractstatus()
              that.setData({
                active: true,
              })
            }
            number = app.globalData.kmUserInfo.userNo
            identifyNo = app.globalData.kmUserInfo.identifyNo
            appBalance = app.globalData.kmUserInfo.appBalance
            coupon = app.globalData.kmUserInfo.coupon
            that.setData({
              appBalance: appBalance,
              coupon: coupon,
              username: username,
              headimg: headimg,
              shopname: shopname,
              number: number,
              identifyNo: identifyNo,
            })
          }
        }
      })
      if (that.data.codeimg == '') {
      if (app.globalData.kmUserInfo != null && app.globalData.kmUserInfo.isApp > 1) {
        that.shareimg()
      }
    }
    }
    that.setData({
      appBalance: appBalance,
      coupon: coupon,
      username: username,
      headimg: headimg,
      shopname: shopname,
      number: number,
      identifyNo: identifyNo,
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