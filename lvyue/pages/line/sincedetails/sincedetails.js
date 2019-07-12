const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getToursInfoUrl = config.getToursInfoUrl
const getXYOpenIdUrl = config.getXYOpenIdUrl
const loginByOpenIdUrl = config.loginByOpenIdUrl
const getAllCommentsUrl = config.getAllCommentsUrl
const likeCommentUrl = config.likeCommentUrl
const cancelLikeCommentUrl = config.cancelLikeCommentUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    evaluate: null,
    totalCount: 0,
    date: null,
    days: null,
    circuit: null,
    image: null,
    arr: null,
    id: '',
    sth: null,
    journey: null,
    become: '',
    stage: '',
    figure: '',
    active3: false,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    width: '',
    height: '',
    scroll: false,
    islike: [],
  },
  circuit(id) {
    var that = this
    util.kmRequest({
      url: getToursInfoUrl,
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var details = JSON.parse(res.data.data)
          console.log(details)
          var circuit = details[0].toursList[0]
          var image = details[1].imgsList
          var journey = details[2].itineraryList
          var sth = details[3].progressList
          var date = details[4].scheduleList
          var digital = date[0].num
          if (sth.length != 0){
            var figure = sth[sth.length - 1].userNum
          }
          var number = 100 / figure
          var width = Math.ceil(number * digital)
          var weekDay = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"];
          var arr = []
          for (var i = 0; i < sth.length; i++) {
            sth[i].statistics = sth[i].userNum - digital
            var lists = Math.ceil(sth[i].userNum * number)
            sth[i].length = lists
            sth[i].active = false
            if (sth[i].userNum <= digital) {
              sth[i].active = true
            }
            if (sth[i].active == true) {

            } else {
              arr.push(sth[i])
            }
          }
          for (var i = 0; i < date.length; i++) {
            var item = date[i]
            var dates = item.scheduleDate
            var datet = dates.substring(5, 10)
            var settings = dates.substring(0, 10)
            item.time = datet
            item.settings = settings
            var myDate = new Date(Date.parse(item.settings));
            item.tmpnewchar = weekDay[myDate.getDay()];
          }
          that.setData({
            circuit: circuit,
            image: image,
            journey: journey,
            sth: sth,
            date: date,
            width: width,
            arr: arr,
            // become: become,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        that.height()
      }
    })
  },
  height() {
    var that = this
    var arr = 0
    var query = wx.createSelectorQuery();
    query.selectAll('.journey').boundingClientRect(function (rect) {
    }).exec
    query.selectAll('.first').boundingClientRect(function (rect) {
    }).exec
    query.selectAll('.first-introduce').boundingClientRect(function (rect) {
    }).exec
    query.selectAll('.first-introduces').boundingClientRect(function (rect) {
    }).exec(function (rect) {
      var he = rect[0][0].height
      var height = rect[1][0].height
      var length = rect[1].length
      var tall = height * length
      var heig = rect[2][0].height
      var heights = rect[3]
      for (var i = 0; i < heights.length; i++) {
        arr += heights[i].height
      }
      var heigh = arr + tall + heig + he + 100
      that.setData({
        height: heigh
      })
    })
  },
  talls() {
    var that = this
    var query = wx.createSelectorQuery();
    query.selectAll('.cost').boundingClientRect(function (rect) {
    }).exec
    query.selectAll('.cost-introduce').boundingClientRect(function (rect) {
    }).exec(function (rect) {
      var heigh = rect[0][0].height
      var lenght = rect[0].length
      var tall = Math.ceil(heigh * lenght)
      var heigh1 = Math.ceil(rect[1][0].height)
      var heigh2 = Math.ceil(rect[1][1].height)
      var heigh3 = Math.ceil(rect[1][2].height)
      var heigh4 = Math.ceil(rect[1][3].height)
      var listl = 30 * lenght
      var heig = tall + heigh1 + heigh2 + heigh3 + heigh4 + listl
      that.setData({
        height: heig
      })
    })
  },
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == 0) {
      this.height()
    }
    if (e.detail.current == 1) {
      this.talls()
    }
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  phone() {
    this.showModal()
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
  imges: function (e) {
    var imgs = []
    var img = this.data.image
    for (var i = 0; i < img.length; i++) {
      imgs.push(img[i].imageUrl)
    }
    console.log(img)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: imgs,
    })
  },
  purchase() {
    wx.navigateTo({
      url: '/pages/line/purchase/purchase?id=' + this.data.id,
    })
  },
  paying() {
    wx.navigateTo({
      url: '/pages/line/self-paying/self-paying?id=' + this.data.id,
    })
  },
  qualification(){
    wx.navigateTo({
      url: '/pages/line/qualification/qualification',
    })
  },
  openid(kalendar) {
    var that = this
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
                util.kmRequest({
                  url: loginByOpenIdUrl,
                  data: {
                    openId: open.openid,
                  },
                  success: function (res) {
                    if (res.data.status == 1) {
                      var user = JSON.parse(res.data.data)[0];
                      app.globalData.kmUserInfo = user
                      if (kalendar == undefined){
                        if (app.globalData.kmUserInfo.isApp <= 1) {
                          wx.showToast({
                            title: '您还不是会员,只有会员才能开启自嗨团之旅',
                            icon: 'none'
                          })
                        } else {
                          wx.navigateTo({
                            url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 0,
                          })
                        }
                      }else{
                        if (app.globalData.kmUserInfo.isApp <= 1) {
                          wx.showToast({
                            title: '您还不是会员,只有会员才能开启自嗨团之旅',
                            icon: 'none'
                          })
                        } else {
                          wx.navigateTo({
                            url: '/pages/line/calendar/calendar?calendar=' + kalendar + '&type=' + 0,
                          })
                        }
                      }
                    }
                    if (res.data.status == 4) {
                      wx.navigateTo({
                        url: '/pages/user/register/register',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  watch() {
    var that = this
    if (app.globalData.kmUserInfo == null ){
      that.openid()
    } else {
      if (app.globalData.kmUserInfo.isApp <= 1) {
        wx.showToast({
          title: '您还不是会员,只有会员才能开启自嗨团之旅',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 0,
        })
      }
    }
  },
  calendar(e) {
    var that = this
    var watch = that.data.date[e.currentTarget.dataset.index]
    var kalendar = JSON.stringify(watch)
    if (app.globalData.kmUserInfo == null) {
      that.openid(kalendar)
    } else {
    if (app.globalData.kmUserInfo.isApp <= 1) {
      wx.showToast({
        title: '您还不是会员,只有会员才能开启自嗨团之旅',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: '/pages/line/calendar/calendar?calendar=' + kalendar + '&type=' + 0,
      })
     }
    }
  },
  btn() {
    var that = this
    if (app.globalData.kmUserInfo == null){
      that.openid()
    }else{
      if (app.globalData.kmUserInfo.isApp <= 1) {
        wx.showToast({
          title: '您还不是会员,只有会员才能开启自嗨团之旅',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 0,
        })
      }
    }
  },
  details() {
    wx.navigateTo({
      url: '/pages/line/details-travel/details-travel?id=' + this.data.id,
    })
  },
  onPageScroll: function (e) {
    if (e.scrollTop >= 652) {
      this.setData({
        scroll: true
      })
    } else {
      this.setData({
        scroll: false
      })
    }
  },

  evaluate(id) {
    var that = this
    util.kmRequest({
      url: getAllCommentsUrl,
      data: {
        busiId: id,
        busiType: 2,
        userId: app.globalData.kmUserInfo.id,
        page: 1,
      },
      method: "post",
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var evaluate = JSON.parse(res.data.data)[0].pageData[0].data
          var reputably = JSON.parse(res.data.data)[0].pageData[0].favorableRate
          var totalCount = JSON.parse(res.data.data)[0].totalCount
          console.log(evaluate)
          if (evaluate.length > 3) {
            var evaluate = evaluate.slice(0, 3)
          }
          that.setData({
            evaluate: evaluate,
            totalCount: totalCount,
            reputably: reputably
          })
        }
      }
    })
  },
  allcomment() {
    var that = this
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?id=' + that.data.id+ '&type='+2,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.type == 1){
      wx.reLaunch({
        url: '/pages/line/scattered/scattered?id=' + options.id
      })
      return
    }
    this.setData({
      id: options.id,
    })
    this.circuit(options.id)
    this.evaluate(options.id)
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
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    console.log(currentPage)
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

  }
})