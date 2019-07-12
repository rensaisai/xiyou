const config = require('../../../config.js')
const getToursInfoUrl = config.getToursInfoUrl
// const getAllScheduleDateByTouristIdUrl = config.getAllScheduleDateByTouristIdUrl
const util = require('../../../utils/util.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:null,
    days:null,
    circuit: null,
    image: null,
    arr:null,
    id:'',
    sth:null,
    journey: null,
    become:'',
    stage:'',
    figure:'',
    // active1:false,
    // active2: true,
    active3: false,
    // clientHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    width:'',
    height:'',
    scroll: false,
  },
  imges: function (e) {
    var imgs=[]
    var img = this.data.image
    for(var i=0; i<img.length; i++){
      imgs.push(img[i].imageUrl)
    }
    console.log(img)
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: imgs,
    })
  },
  circuit(id){
    var that= this
    util.kmRequest({
      url: getToursInfoUrl,
      data:{
        id:id
      },
      success:function(res){
        if(res.data.status==1){
          var details=JSON.parse(res.data.data)
          console.log(details)
          var circuit = details[0].toursList[0]
          var image = details[1].imgsList
          var journey = details[2].itineraryList
          var sth = details[3].progressList
          var date = details[4].scheduleList
          var digital = date[0].num
          var figure = sth[sth.length-1].userNum
          var number = 100 / figure
          var width = Math.ceil(number * digital)
          var weekDay = ["周天", "周一", "周二", "周三", "周四", "周五", "周六"];
          var arr = []
          for(var i = 0; i < sth.length; i++){
            sth[i].statistics = sth[i].userNum - digital
            var lists = Math.ceil(sth[i].userNum * number)
            sth[i].length = lists
            sth[i].active = false
            if (sth[i].userNum <= digital){
              sth[i].active = true
            } 
            if (sth[i].active == true){
              
            }else{
              arr.push(sth[i])
            }
          }
          for(var i = 0; i < date.length; i++){
            var item = date[i]
            var dates = item.scheduleDate
            var datet = dates.substring(5,10)
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
            sth:sth,
            date:date,
            width: width,
            arr:arr,
            // become: become,
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

   talls(){
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
     if (e.detail.current == 0){
       this.height()
     }
     if (e.detail.current == 1){
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
  details(){
    wx.navigateTo({
      url: '/pages/travel/details-travel/details-travel?id='+this.data.id,
    })
  },
  purchase(){
   wx.navigateTo({
     url: '/pages/travel/purchase/purchase?id='+this.data.id,
   })
  },
  paying(){
    wx.navigateTo({
      url: '/pages/travel/self-paying/self-paying?id=' + this.data.id,
    })
  },
  qualification(){
    wx.navigateTo({
      url: '/pages/travel/qualification/qualification',
    })
  },
  btn(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.isVip == 0){
      wx.showModal({
        content: '您还不是会员只有会员才能开启自嗨团之旅，是否升级会员',
        confirmText:'是',
        cancelText:'否',
        confirmColor:'#f39400',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url:'/pages/thesuper/thesuper'
            })
          } else if (res.cancel) {
            
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/travel/watch/watch?id=' + this.data.id + '&type=' + 0 ,
      })
    }
    
  },
  watch(e){
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.isVip == 0) {
      wx.showModal({
        content: '您还不是会员只有会员才能开启自嗨团之旅，是否升级会员',
        confirmText: '是',
        cancelText: '否',
        confirmColor: '#f39400',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/thesuper/thesuper'
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/travel/watch/watch?id=' + this.data.id + '&type=' + 0,
      })
    }
  },
  calendar(e){
    if (!util.checkUserInfo()) {
      return;
    }
    var watch = this.data.date[e.currentTarget.dataset.index]
    var kalendar = JSON.stringify(watch)
    if (app.globalData.kmUserInfo.isVip == 0) {
      wx.showModal({
        content: '您还不是会员只有会员才能开启自嗨团之旅，是否升级会员',
        confirmText: '是',
        cancelText: '否',
        confirmColor: '#f39400',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/thesuper/thesuper'
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/travel/calendar/calendar?calendar=' + kalendar + '&type=' + 0,
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
  height(){
    var that = this
    var arr =0
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
      for (var i = 0; i < heights.length; i++){
        arr += heights[i].height
      }
      var heigh = arr + tall + heig + he+100
      that.setData({
        height: heigh
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id=options.id
    this.setData({
      id:id,
    })
    this.circuit(id)
  },
  onPageScroll: function (e) {
    var scrollTop = e.scrollTop
    if (scrollTop >= 861) {
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