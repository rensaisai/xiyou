const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getLineSetmealsUrl = config.getLineSetmealsUrl
const getDetectionLineInfoUrl = config.getDetectionLineInfoUrl
// const getCommentUrl = config.getCommentUrl
const getCommentsUrl = config.getCommentsUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:0,
   currentData: 0,
   windowHeight:'',
   projectlist:null,
   hiddenNone:true,
   list:null,
   clickstate: '点击展开',
   active: true,
   price:0,
   selectItem:null,
   loading:false,
   showModalloading: true,
    commentsList:null,
    loadmore: false,
    isHideLoadMore: true,
  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  eventchange: function (e) {
    var current = e.detail.current
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  an() {
    var that = this
    if (that.data.active == false) {
      that.setData({
        active: true,
        clickstate: '点击收起'
      })
    } else {
      that.setData({
        active: false,
        clickstate: '点击展开'
      })
    }
  },
  maintenance(e){
    console.log(e)
    var that = this
    var projectlist = that.data.projectlist
    var project = projectlist[e.currentTarget.dataset.index]
    var price = 0
    for (var i=0; i<projectlist.length; i++){
      if (projectlist[i].id == project.id){
        if (projectlist[i].checked == false || projectlist[i].checked == undefined){
          projectlist[i].checked = true
        } 
        // else if (projectlist[i].checked == true){
        //   projectlist[i].checked = false
        // }  
      }else{
        projectlist[i].checked = false
      }
      if (projectlist[i].checked == true){
        price += projectlist[i].price
      }
    }
    var prices = price.toFixed(2)
    that.setData({
      projectlist: projectlist,
      price:prices
    })
  },
  address() {
    var that = this
    var list = that.data.list
    wx.openLocation({
      latitude: list.lat,
      longitude: list.lon,
      scale: 18,
      name: list.detectionLineName,
      address: list.address
    })
  },
  btn() {
    var that = this
    var price = that.data.price
    // var num = that.data.num
    var entity = that.data.list
    var order = []
    var list = that.data.projectlist
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked == true) {
        order.push(list[i])
      }
    }
    if (price == 0) {
      wx.showToast({
        title: '请选择审车项目',
        icon: 'none'
      })
    } else {
      that.setData({
        loading: true
      })
      wx.navigateTo({
        url: '/pages/users/order/order?order=' + JSON.stringify(order) + '&entity=' + JSON.stringify(entity),
      })
    }
  },
//获取检测线信息
  detal:function(){
   var that = this
    util.kmRequest({
      data:{
        interfaceName: getDetectionLineInfoUrl,
        param:{
          detectionLineId: that.data.selectItem.id
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          var img1 = 'img1'
          var img2 = 'img2'
          var stars = new Array();
          var count = parseInt(Math.round(list.evaluate));
          for (var j = 0; j < count; j++) {
            stars.push(img1);
          }
          if (stars.length < 5){
            var sta = 5 - stars.length
            for(var i=0; i<sta.length; i++){
              stars.push(img2)
            }
          }
          list.stars = stars;
          that.setData({
            list:list
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  //获取检测线项目 
  vehicle:function(){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: getLineSetmealsUrl,
       param:{
         lineId: that.data.selectItem.id
       }
     },
     success:function(res){
      if(res.data.status == 1){
        var projectlist=JSON.parse(res.data.data)
        console.log(projectlist)
        projectlist[0].checked=true
        var price = projectlist[0].price
        var prices = price.toFixed(2)
        that.setData({
          projectlist: projectlist,
          price:prices,
        })
      }else if(res.data.status == 6){
       
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: "none"
        })
      }
      that.setData({
        showModalloading: false,
      })
       if (that.data.projectlist == null || that.data.projectlist.length ==0 ){
         that.setData({
           hiddenNone:'',
           showModalloading: false,
         })
       }else{
         that.setData({
           hiddenNone:true,
           showModalloading: false,
         })
       }
     }
   })
  },
  //获取检测线评价
  evaluate:function(){
    var that = this
   util.kmRequest({
     data:{
       interfaceName: getCommentsUrl,
       param:{
         repairId: that.data.selectItem.id,
         pageNum: that.data.page
       }
     },
     success:function(res){
      console.log(res.data)
      if(res.data.status == 1){
        var img1 = 'img1'
        var img2 = 'img2'
        var list = JSON.parse(res.data.data);
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var time = item.createTime
          item.time = time.slice(0, 10)
          if (item.nickName != null && item.nickName.length != 0) {
            item.title = item.nickName;
          } else {
            var phone = "";
            if (item.phone != null && item.phone.length == 11) {
              var tempStr = item.phone.slice(3, 8);
              phone = item.phone.replace(tempStr, "*****");
            }
            item.title = phone;
          }
          var stars = new Array();
          var count = parseInt(Math.round(item.evaluate));
          console.log(count)
          for (var j = 0; j < count; j++) {
            stars.push(img1);
          }
          item.stars = stars;
          if (item.stars.length < 5) {
            var str = 5 - item.stars.length
            for (var s = 0; s < str; s++) {
              item.stars.push(img2)
            }
          }
        }
        if (that.data.commentsList != null) {
          var evaluationlist = that.data.commentsList
          var list = evaluationlist.concat(list)
        }
        that.setData({
          commentsList: list
        });
      } else if (res.data.status == 6){
        if (that.data.page > 0) {
          that.setData({
            page: that.data.page - 1,
            loadmore: true
          });
        }
      }
     }
   })
  },
   scroll() {
    var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true) {
      that.setData({
        isHideLoadMore: false,
      })
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page: that.data.page + 1
        })
        that.evaluate()
      }, 1000)
    }
  },
  phone() {
    wx.showModal({
      content: '400-992-5550',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-992-5550',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  phones(e) {
    var phone = e.currentTarget.dataset.phone
    wx.showModal({
      content: phone,
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selectItem = JSON.parse(options.selectItem)
    this.setData({
      selectItem: selectItem,
    })
    this.detal()
    this.vehicle()
    this.evaluate()
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
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 46;
      }
    })
    that.setData({
      windowHeight: windowHeight,
      loading: false
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