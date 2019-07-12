const config = require('../../config.js')
const getUserNorecordDetail1Url = config.getUserNorecordDetail1Url
const util = require('../../utils/util.js')
var app = getApp()
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
  isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
  hiddenNone: 'true',
  list:null,
  },
  accounts:function(){
    var that = this
    util.kmRequest({
      url: getUserNorecordDetail1Url,
      data:{
        userId: app.globalData.kmUserInfo.id
      },
      success:function(res){
       console.log(res.data)
       if(res.data.status == 1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for(var i=0; i<list.length; i++){
           var item = list[i];
           var title = '';
           switch (item.flowType) {
             case 1: title = '消费';
               break;
             case 2: title = '商品差价';
               break;
             case 3: title = '消费者利润';
               break;
             case 4: title = '推荐人利润';
               break;
             case 5: title = '店主利润';
               break;
             case 6: title = '店主一代利润';
               break;
             case 7: title = '店主二代利润';
               break;
             case 8: title = '店主三代利润';
               break;
             case 9: title = '经理利润';
               break;
             case 10: title = '合伙人利润';
               break;
             case 11: title = '高级合伙人利润';
               break;
             case 12: title = '资深合伙人利润';
               break;
             case 13: title = '一代育成利润';
               break;
             case 14: title = '二代育成利润';
               break;
             case 15: title = '分公司利润';
               break;
             case 16: title = '城市负责人利润';
               break;
             case 17: title = '提现';
               break;
             case 18: title = '三代育成利润 ';
               break;
           }
           item.title = title;
         }
        that.setData({
          list:list
        })
         that.showNone()
       }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.accounts()
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
    // this.amountRequest();
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
    this.setData({
      isHideLoadMore: false,
    });
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

  }
})