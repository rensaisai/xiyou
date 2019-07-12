// pages/suber/products/products.js
const config=require('../../../config.js');
const getAllVipQualityGoodsUrl = config.getAllVipQualityGoodsUrl;
var app=getApp()
const util=require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: true,
    shops:null,
    hiddenNone: 'true',
    hiddenNones:true,
    page:0,
    status:1,
  },

  boutique:function(){
    var that = this
    util.kmRequest({
      url: getAllVipQualityGoodsUrl,
      data:{
        goodsSource: 'sc',
        source: wx,
        page:that.data.page
      },
      success:function(res){
        if(res.data.status == 1){
          var shops=JSON.parse(res.data.data)
          console.log(shops)
          that.setData({
            shops:shops
          })
        }else if(res.data.status == 6){
          that.setData({
            shops:[]
          })
        }
        that.showNone()
      }
    })
  },
  boutiques: function () {
    var that = this
    util.kmRequest({
      url: getAllVipQualityGoodsUrl,
      data: {
        goodsSource: 'sc',
        page: that.data.page,
        source: wx
      },
      success: function (res) {
        if (res.data.status == 1) {
          var shopss = that.data.shops
          var shops = JSON.parse(res.data.data)
          var arry = shopss.concat(shops)
          console.log(shops)
          that.setData({
            shops: arry
          })
        } else if (res.data.status == 6) {
          that.setData({
            status: res.data.status
          })
        }
        that.showNone()
      }
    })
  },
  buy: function (e) {
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.tenantId != '') {
      console.log(e)
      var id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + id
      })
    }
    if ((app.globalData.kmUserInfo.isVip == 0) && (app.globalData.kmUserInfo.tenantId == '')) {
      wx.navigateTo({
        url: '/pages/suber/referrer/referrer'
      })
    }
  },
  details: function (e) {
    console.log(e)
    if (!util.checkUserInfo()) {
      return;
    }
    if (app.globalData.kmUserInfo.tenantId != '') {
      console.log(e)
      var id = e.currentTarget.dataset.id
      console.log(id)
      wx.navigateTo({
        url: '/pages/suber/goods/goods?id=' + id
      })
    }
    if ((app.globalData.kmUserInfo.isVip == 0) && (app.globalData.kmUserInfo.tenantId == '')) {
      wx.navigateTo({
        url: '/pages/suber/referrer/referrer'
      })
    }
  },
  showNone: function () {
    if (this.data.shops == null || this.data.shops.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.boutique()
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
    if (this.data.status == 1) {
      this.data.page = this.data.page + 1
      this.boutiques()
      this.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        this.setData({
          isHideLoadMore: true,
          page: this.data.page
        })
      }, 500)
    } else if (this.data.status == 6) {
      this.boutiques()
      this.setData({
        hiddenNones: false,
      });
      setTimeout(() => {
        this.setData({
          hiddenNones: true,
          page: this.data.page
        })
      }, 1000)
    }
    // this.setData({
    //   isHideLoadMore: false,
    // });
    // this.data.page = this.data.page + 1
    // setTimeout(() => {
    //   this.setData({
    //     isHideLoadMore: true,
    //   })
    // }, 500)
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})