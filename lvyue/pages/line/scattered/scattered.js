const config = require('../../../config.js');
const getToursInfoUrl = config.getToursInfoUrl;
const saveuserinformation = config.saveuserinformation
const getXYOpenIdUrl = config.getXYOpenIdUrl
const loginByOpenIdUrl = config.loginByOpenIdUrl
const getAllCommentsUrl = config.getAllCommentsUrl
const util = require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    circuit:null,
    image: null,
    journey: null,
    sth: null,
    date: null,
    showModalStatus: false,
    id:'',
    clientHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    height:'',
    scroll:false,
    islike: [],
  },
  destination:function(id){
    var that = this
    util.kmRequest({
      url: getToursInfoUrl,
      data:{
        id:id
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status==1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          var circuit = list[0].toursList[0]
          var image = list[1].imgsList
          var journey = list[2].itineraryList
          var sth = list[3].progressList
          var date = list[4].scheduleList
          var weekDay = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"];
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
            date: date
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        that.height()
      }
    })
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
  phone(){
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
  dial(){
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
    this.setData({
      currentTab: e.detail.current
    });
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
  qualification() {
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
              console.log(res)
              if (res.errMsg == "request:ok") {
                var open = JSON.parse(res.data.data)
                app.globalData.openid = open.openid
                util.kmRequest({
                  url: loginByOpenIdUrl,
                  data: {
                    openId: open.openid,
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.status == 1) {
                      var user = JSON.parse(res.data.data)[0];
                      app.globalData.kmUserInfo = user
                      if (kalendar == undefined) {
                          wx.navigateTo({
                            url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 1,
                          })
                      } else {
                          wx.navigateTo({
                            url: '/pages/line/calendar/calendar?calendar=' + kalendar + '&type=' + 1,
                          })
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
  calendar(e) {
    var that = this
    var watch = this.data.date[e.currentTarget.dataset.index]
    var kalendar = JSON.stringify(watch)
    if (app.globalData.kmUserInfo == null) {
      that.openid()
    } else {
    wx.navigateTo({
      url: '/pages/line/calendar/calendar?calendar=' + kalendar + '&type=' + 1,
    })
    }
  },
  btn() {
    var that = this
    if (app.globalData.kmUserInfo == null) {
      that.openid()
    } else {
    wx.navigateTo({
      url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 1,
    })
    }
  },
  details() {
    wx.navigateTo({
      url: '/pages/line/details-travel/details-travel?id=' + this.data.id,
    })
  },
  height() {
    var that = this
    var arr=0
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
      var heig = tall + heigh1 + heigh2 + heigh3 + heigh4+ listl
      that.setData({
        height: heig
      })
    })
  },
  watch(e) {
    var that = this
    if (app.globalData.kmUserInfo == null) {
      that.openid()
    } else {
    wx.navigateTo({
      url: '/pages/line/watch/watch?id=' + that.data.id + '&type=' + 1,
    })
  }
  },
  evaluate(id) {
    var that = this
    util.kmRequest({
      url: getAllCommentsUrl,
      data: {
        busiId: id,
        busiType: 3,
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
      url: '/pages/evaluate/evaluate?id=' + that.data.id+'&type='+3,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id= options.id
    this.destination(id)
    this.evaluate(id)
    this.setData({
      id:id,
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
    // var tenantId = '';
    // var tenantNo = '';
    // if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)) {
    //   tenantId = app.globalData.kmUserInfo.tenantId;
    //   tenantNo = app.globalData.kmUserInfo.userNo;
    // }
    // return {
    //   title: '旅游直达号VIP',
    //   desc: '',
    //   path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    // }
  }
})