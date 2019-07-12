const config = require('../../config.js')
const getAllToursUrl = config.getAllToursUrl
const getAllPopularDestinationUrl = config.getAllPopularDestinationUrl
const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
const getAdsUrl = config.getAdsUrl
const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   hot:null,
   page:0,
   check:true,
   img:null,
   hiddenNone: true,
   isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
   hiddenNones: true,
   status:1,
   code:'',
  },
  //获取热门目的地 
  hot(){
  var that=this
   util.kmRequest({
     url: getAllPopularDestinationUrl,
     data:{},
     success:function(res){
       if(res.data.status==1){
         var hot=JSON.parse(res.data.data)
         console.log(hot)
         for(var i=0; i<hot.length; i++){
          hot[i].active=false
         }
         that.setData({
           hot:hot
         })
       }
     }
   })
  },
  //目的轮播图 
  picture: function () {
    var that = this;
    util.kmRequest({
      url: getAdsUrl,
      data: {
        type: 2
      },
      success: function (res) {
        console.log(JSON.parse(res.data.data)[0])
        if (res.data.status == 1) {
          that.setData({
            img: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  //目的地列表 
  destination:function(){
    var that=this
    util.kmRequest({
      url: getAllToursUrl,
      data:{
        type:1,
        pageNumber: that.data.page,
      },
      success:function(res){
        if(res.data.status==1){
          var list = JSON.parse(res.data.data)
         for(var i =0 ; i<list.length; i++){
           list[i].lineName = '<' + list[i].lineName+'>'
         }
         if(that.data.list == null){
           var destination = list
         }else{
           var circuit = that.data.list
           var destination = circuit.concat(list)
         }
          that.setData({
            list: destination
          })
        } else if (res.data.status == 6){
          if(that.data.page >0){
            that.setData({
              isHideLoadMore: true,
              hiddenNones: false,
            });
            setTimeout(() => {
              that.setData({
                hiddenNones: true,
                page: that.data.page-1
              })
            },500)
          } else if (that.data.page ==0){
            that.setData({
              list: null
            })
          }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: false,
          })
        } else {
          that.setData({
            hiddenNone: true,
          })
        }
      }
    })
  },
  //点击全部
  inquires(){
    var check = this.data.check
    var hot = this.data.hot
    for(var i=0; i<hot.length; i++){
      hot[i].active=false
    }
      this.setData({
        check: true,
        hot:hot,
        page: 0,
        code:'',
        list:null,
      })
    this.destination();
  },
  //点击地名时
  inquire(e){
    var that = this
    var code = e.currentTarget.dataset.code
    var hot = that.data.hot
    var check = that.data.check
    that.setData({
      check:false
    })
    for(var i=0; i<hot.length; i++){
      hot[i].active=false
      if (hot[i].cityName == code){
        hot[i].active=true
      }
    }
    that.setData({
      hot:hot,
      code: code,
      page: 0,
      list:null,
    })
    that.latitude()
  },   
  latitude: function (){
    var that = this
    util.kmRequest({
      url: getPopularDestinationByCodeUrl,
      data: {
        code: that.data.code,
        pageNumber: that.data.page,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          for (var i = 0; i < list.length; i++) {
            list[i].lineName = '<' + list[i].lineName + '>'
          }
          if (that.data.list == null) {
            var destination = list
          } else {
            var circuit = that.data.list
            var destination = circuit.concat(list)
          }
          that.setData({
            list: destination
          })
        } else if(res.data.status == 6){
          if (that.data.page > 0) {
            that.setData({
              isHideLoadMore: true,
              hiddenNones: false,
            });
            setTimeout(() => {
              that.setData({
                hiddenNones: true,
                page: that.data.page - 1
              })
            },500)
          } else if (that.data.page == 0) {
            that.setData({
              list: null
            })
          }
        }else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: false,
          })
        } else {
          that.setData({
            hiddenNone: true,
          })
        }
      }
    })
  },
  bourn:function(e){
   console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/travel/scattered/scattered?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.destination()
    this.hot()
    this.picture()
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
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    wx.showNavigationBarLoading();
    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var page = this.data.page + 1
    this.setData({
      isHideLoadMore: false,
      page: page
    });
    setTimeout(()=>{
      if (this.data.code == '') {
        this.destination()
      } else {
        this.latitude()
      }
    },500)
    setTimeout(() => {
      this.setData({
        isHideLoadMore: true,
      })
    }, 1000)
   
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