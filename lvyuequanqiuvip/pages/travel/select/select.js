const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getTouristUserByUserIdUrl = config.getTouristUserByUserIdUrl
const updateUserTouristUrl = config.updateUserTouristUrl
// const visitorinformation = config.visitorinformation
const delTouristUserByIdUrl = config.delTouristUserByIdUrl
const document = config.document
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  people:null,
   list:null,
   hiddenNone: 'true',
   schedule:'',
  },
  tourism(){
    var that = this
    util.kmRequest({
      url: getTouristUserByUserIdUrl,
      data:{
        userId: app.globalData.kmUserInfo.id
      },
      method: 'post',
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          for(var i=0; i<list.length; i++){
            list[i].active=false
            list[i].delter=false
          }  
          that.setData({
            list: list
          })
         
        }else if(res.data.status == 6){
          that.setData({
            list: null
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
        that.showNone()
      }
    })
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  select(e){
    var that = this
    var list = that.data.list
    var index = e.currentTarget.dataset.index
    var lists = list[index]
    for(var i=0; i<list.length; i++){
        if (list[i].id == lists.id) {
          if (list[i].active == false) {
            list[i].active = true
              that.setData({
                list: list,
              })
            } 
            else {
            list[i].active = false
            that.setData({
                  list: list,
                })
            }
          } 
    }
  
  },
  add(){
   wx.navigateTo({
     url: '/pages/travel/addition/addition',
  })
  },
  modification(e){
    console.log(e)
    var list = this.data.list[e.currentTarget.dataset.index]
    console.log(list)
    var listfile=JSON.stringify(list) 
    wx.navigateTo({
      url: '/pages/travel/modification/modification?list=' + listfile,
   })
  },
  btn(){
    console.log(6666666)
   var that = this
   var list = that.data.list
   var listbox = []
    if (list != null){
      for (var i = 0; i < list.length; i++) {
        if (list[i].active == true) {
          listbox.push(list[i])
        }
      }
    }
    if (listbox.length == 0){
      wx.showToast({
        title: '请至少选择一位出游人',
        icon: 'none'
      })
      return
    }
    var arr = []
    var arrs = []
    for (var i = 0; i < listbox.length; i++){
      if (listbox[i].touristAge >12){
        arr.push(listbox[i])
      } 
      if (listbox[i].touristAge <= 12){
        arrs.push(listbox[i])
      }
    }
    if (arr.length == that.data.schedule.adultnum && arrs.length == that.data.schedule.childrennum){
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 2]
      currPage.setData({
        listbox: listbox
      })
      // console.log(currPage)
      // wx.setStorage({
      //   key: visitorinformation,
      //   data: listbox,
      // })
      wx.navigateBack({
        delta: 1
      })
    } else if (arr.length < that.data.schedule.adultnum || arr.length > that.data.schedule.adultnum){
      wx.showToast({
        title: '请选择' + that.data.schedule.adultnum+'位成人',
        icon:'none'
      })
    } else if (arrs.length < that.data.schedule.childrennum || arrs.length > that.data.schedule.childrennum){
      wx.showToast({
        title: '请选择' + that.data.schedule.childrennum + '位儿童',
        icon: 'none'
      })
    }
  },
  touchS(e) {
    console.log(e)
    // 获得起始坐标
    this.startX = e.touches[0].clientX;
    console.log(this.startX)
    this.startY = e.touches[0].clientY;
    console.log(this.startY)
  },
  touchM(e) {
    console.log(e)
    // 获得当前坐标
    var that = this 
    var index = e.currentTarget.dataset.index
    var li = that.data.list
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    for(var i=0; i<li.length; i++){
      li[i].delter = false
    }
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      li[index].delter=true
      this.setData({
        list:li
      })
    } else if (x < -35 && y < 110) {
      //向右滑
      li[index].delter = false
      this.setData({
        list: li
      })
    }
  },
  delter(e){
    var that = this
    util.kmRequest({
      url: delTouristUserByIdUrl,
      data:{
        id: e.currentTarget.dataset.id
      },
      method:'post',
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          that.tourism()
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 2]
    this.setData({
      schedule: currPage.data.schedule
    })
    // if (options.people != undefined){
    //   var people = JSON.parse(options.people)
    //   this.setData({
    //     people: people
    //   })
    //   wx.setStorage({
    //     key: savevisitors,
    //     data: people,
    //   })
    // }
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
    that.tourism()
    // that.setData({
    //   listbox:null,
    // })
    // wx.getStorage({
    //   key: document,
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.errMsg == 'getStorage:ok') {
    //       that.setData({
    //         people: res.data
    //       })
    //     }
    //   },
    // })
    // wx.getStorage({
    //   key: savevisitors,
    //   success: function (res) {
    //     console.log(res.data)
    //     if (res.errMsg == 'getStorage:ok') {
    //       that.setData({
    //         people: res.data
    //       })
    //     }
    //   },
    // })
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