const config = require('../../../config.js');
const getToursInfoUrl = config.getToursInfoUrl;
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
    isvip:'',
    showModalStatus: false,
    id:'',
    clientHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    height:'',
    scroll:false
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
      url: '/pages/travel/purchase/purchase?id=' + this.data.id,
    })
  },
  details() {
    wx.navigateTo({
      url: '/pages/travel/details-travel/details-travel?id=' + this.data.id,
    })
  },
  paying() {
    wx.navigateTo({
      url: '/pages/travel/self-paying/self-paying?id=' + this.data.id,
    })
  },
  qualification() {
    wx.navigateTo({
      url: '/pages/travel/qualification/qualification',
    })
  },
  watch() {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/travel/watch/watch?id=' + this.data.id+'&type='+1,
    })
  },
  btn(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/travel/watch/watch?id=' + this.data.id + '&type=' + 1,
    })
  },
  calendar(e) {
    if (!util.checkUserInfo()) {
      return;
    }
    console.log(e)
    var watch = this.data.date[e.currentTarget.dataset.index]
    var kalendar = JSON.stringify(watch)
    wx.navigateTo({
      url: '/pages/travel/calendar/calendar?calendar=' + kalendar+'&type='+1,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id= options.id
    this.destination(id)
    this.setData({
      id:id
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
   this.setData({
     isvip: app.globalData.kmUserInfo.isVip
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
    var tenantId = '';
    var tenantNo = '';
    if ((app.globalData.kmUserInfo != null) && (app.globalData.kmUserInfo.isVip == 1 || app.globalData.kmUserInfo.isVip == 2)) {
      tenantId = app.globalData.kmUserInfo.tenantId;
      tenantNo = app.globalData.kmUserInfo.userNo;
    }
    return {
      title: '旅游直达号VIP',
      desc: '',
      path: '/pages/index/index?tenantId=' + tenantId + '&tenantNo=' + tenantNo
    }
  }
})