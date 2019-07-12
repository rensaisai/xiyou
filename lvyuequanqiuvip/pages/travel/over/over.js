const config = require('../../../config.js')
const getTouristRouteByKeyWordUrl = config.getTouristRouteByKeyWordUrl
const getPopularDestinationByCodeUrl = config.getPopularDestinationByCodeUrl
const util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   hiddenNone:true,
   isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
   hiddenNones: true,
   page:0,
   status:1,
   code:'',
  },
  over: function (keyWord){
    var that = this
    util.kmRequest({
      url: getTouristRouteByKeyWordUrl,
      method: "POST",
      data:{
        keyWord: keyWord
      },
      success:function(res){
       if(res.data.status ==1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for (var i = 0; i < list.length; i++) {
           list[i].lineName = '<' + list[i].lineName + '>'
         }
         that.setData({
           list:list
         })
       }else{
         wx.showToast({
           title: res.data.msg,
           icon: "none"
         })
       }
        if (that.data.list == null || that.data.list.length==0) {
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
  inquire:function(code){
    var that = this
   util.kmRequest({
      url: getPopularDestinationByCodeUrl,
      data: {
        code: code,
        pageNumber: that.data.page,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          console.log(list)
          that.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: '',
          })
        } else {
          that.setData({
            hiddenNone: 'true',
          })
        }
      }
    })
  },
  inquires: function () {
    var that = this
    util.kmRequest({
      url: getPopularDestinationByCodeUrl,
      data: {
        code: that.data.code,
        pageNumber: that.data.page,
      },
      success: function (res) {
        var circuits = that.data.list
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          console.log(list)
          var array = circuits.concat(list)
          that.setData({
            list: array
          })
        }else if (res.data.status == 6) {
          status: res.data.status
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  bourn: function (e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var type = e.currentTarget.dataset.type
    if (type == 0){
      wx.navigateTo({
        url: '/pages/travel/hi-details/hi-details?id=' + id,
      })
    }
    if (type == 1){
      wx.navigateTo({
        url: '/pages/travel/scattered/scattered?id=' + id,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.name !=undefined){
      this.over(options.name)
    }
    if (options.code != undefined){
      this.inquire(options.code)
      this.setData({
        code: options.code
      })
    }
    this.setData({
      page: 0,
      status: 1,
    })
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
    if(this.data.code != ''){
    if (this.data.status == 1) {
      this.data.page = this.data.page + 1
      this.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        this.setData({
          isHideLoadMore: true,
          page: this.data.page
        })
      }, 1000)
      this.inquires()
    } else if (this.data.status == 6) {
      this.setData({
        hiddenNones: false,
      });
      setTimeout(() => {
        this.setData({
          hiddenNones: true,
          page: this.data.page
        })
      }, 1000)
      this.inquires()
    }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})