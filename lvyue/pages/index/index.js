const config = require('../../config.js')
const util = require('../../utils/util.js')
const getAdsUrl = config.getAdsUrl
const getAllToursUrl = config.getAllToursUrl
const getUserInfoByUserIdUrl = config.getUserInfoByUserIdUrl
const getXYOpenIdUrl = config.getXYOpenIdUrl 
const saveuserinformation = config.saveuserinformation
const getAllPopularFromHiUrl = config.getAllPopularFromHiUrl
const userInfos = config.userInfos
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shuffling:null,
    circuit:null,
    img:null,
    loadingType:0,
    loding:false,
    pop:null,
    // hidden:false,
    hiddenNone: true,
    page:0,
  },
  openid(){
    wx.login({
      success: function (res) {
        if (res.code) {
          util.kmRequest({
            url: getXYOpenIdUrl,
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.errMsg == "request:ok") {
                var open = JSON.parse(res.data.data)
                app.globalData.openid = open.openid
              }
            }
          })
        }
      }
    })
  },
  //获取用户信息 
  userinformation(id){
    util.kmRequest({
      url: getUserInfoByUserIdUrl, 
      data:{
        userId: id
      },
      success:function(res){
        if(res.data.status == 1){
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0]
        }
      }
    })
  },
  //首页轮播图
  shuffling(){
    var that = this
    util.kmRequest({
      url: getAdsUrl,
      data:{
        type:1
      },
    success:function(res){
     if(res.data.status == 1){
       var shuffling = JSON.parse(res.data.data)
       console.log(shuffling)
       that.setData({
         shuffling: shuffling
       })
     }
      }
    })
  },
  picture: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type: 3
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            img: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  //获取已成团线路
  clustering(){
    var that = this
    util.kmRequest({
      url: getAllPopularFromHiUrl,
      data:{},
      success:(res)=>{
        if(res.data.status == 1){
          var img = JSON.parse(res.data.data)
          img.forEach(i=>{
            i.lineName = '<' + i.lineName + '>'
            i.becomePrice = '￥' + i.becomePrice.toFixed(2)
            i.num = '(' + i.num + '人' + ')'
            i.imgs = '/image/sign.png'
            i.date = i.scheduleDate.slice(5, 10).replace(/-/g, '/')+'已成团'
          })
          img.push({ img:'/image/clustering.png'})
        }else if(res.data.status == 6){
          var img = []
          img.push({ img:'/image/clustering.png'})
        }
        that.setData({
          pop:img
        })
      }
    }) 
  },
  //自嗨团线路列表 
  circuit: function () {
    var that = this
    util.kmRequest({
      url: getAllToursUrl,
      data: {
        type: 0,
        pageNumber: that.data.page,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var circuit = JSON.parse(res.data.data)
          for (var i = 0; i < circuit.length; i++) {
            var time = circuit[i].scheduleDate
            circuit[i].time = time.substring(5,10)
            circuit[i].lineName = '<' + circuit[i].lineName + '>'
            var bargain = (circuit[i].memberPrice) - (circuit[i].nowPrice)
            circuit[i].bargain = bargain
            if (circuit[i].status == 0) {
              circuit[i].star = '未成团'
            } else if (circuit[i].status == 1) {
              circuit[i].star = '已成团'
            }
          }
          if (that.data.circuit != null) {
            var circuits = that.data.circuit
            var circuit = circuits.concat(circuit)
          }
          that.setData({
            circuit: circuit,
          })
        } else if (res.data.status == 6) {
          if(that.data.page > 0) {
            that.setData({
              loding: true,
              loadingType: 2,
              page: that.data.page - 1,
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      that.show()
      }
    })
  },
  circuitdetails(e) {
    if (!util.whetherlanding()){
      return
    }
    var id = e.currentTarget.dataset.id
    if(id != undefined){
      wx.navigateTo({
        url: '/pages/line/sincedetails/sincedetails?id=' + id
      })
    }
  },
  show() {
    var that = this
    if (that.data.circuit == null || that.data.circuit.length == 0) {
      that.setData({
        hiddenNone: ''
      })
    } else {
      that.setData({
        hiddenNone: true
      })
    }
  },
  phone() {
    this.showModal()
  },
  search(){
   wx.navigateTo({
     url: '/pages/line/search/search',
   })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  dial() {
    wx.makePhoneCall({
      phoneNumber: '400-0098-365',
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.hideModal()
  },
  cancel() {
    this.hideModal()
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  imgs(){
    if (!util.whetherlanding()){
      return
    }
    wx.navigateTo({
      url: '/pages/suber/goods/goods?id=' + this.data.img[0].adUrl,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.circuit()
    this.clustering()
    this.shuffling()
    this.picture()
    this.upgrading()
  },
  // 更新
  upgrading(){
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
    if (app.globalData.openid == null){
      that.openid()
    }
    if (app.globalData.kmUserInfo == null){
      wx.getStorage({
        key: saveuserinformation,
        success(res) {
          if (res.errMsg == "getStorage:ok") {
            app.globalData.kmUserInfo = res.data
            that.userinformation(app.globalData.kmUserInfo.id)
          }
        }
      })
      wx.getStorage({
        key: userInfos,
        success(res) {
          if (res.errMsg == "getStorage:ok") {
            app.globalData.userInfo = res.data
          }
        }
      })
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
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading();
      wx.hideLoading();
    }, 800)  
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
    setTimeout(()=>{
      that.setData({
        loadingType: 0,
        page: that.data.page+1
      })
      that.circuit()
    },1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})