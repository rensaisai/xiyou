const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getUserObdAlertUrl = config.getUserObdAlertUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    date1:'',
    list:null,
    hiddenNone:true
  },
  bindDateChange(e){
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1(e) {
    this.setData({
      date1: e.detail.value
    })
  },
  inquire(){
    this.police()
    this.data.list = null 
  },
  police(){
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getUserObdAlertUrl,
        param: {
          startTime:that.data.date,
          endTime:that.data.date1
        }
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
        }else if(res.data.status == 6){
          var list = null
        }
        that.setData({
          list: list
        })
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiddenNone: '',
          })
        } else {
          that.setData({
            hiddenNone: true,
          })
        }
      }
    })
  },
  detail(e){
    wx.navigateTo({
      url: '/pages/faultlist/police-detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var time = (util.formatTime(new Date())).slice(0,10);
    var today = time;
    var dd;
    var addDayCount = -1
    getDateStr(today, addDayCount)
    function getDateStr(today, addDayCount) {
      if (today) {
        dd = new Date(today);
      } else {
        dd = new Date();
      }
      dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;//获取当前月份的日期 
      var d = dd.getDate();
      if (m < 10) {
        m = '0' + m;
      };
      if (d < 10) {
        d = '0' + d;
      };
      dd = y + "-" + m + "-" + d;
    }
    that.setData({
      date:dd,
      date1:time
    })
    that.police()
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

  }
})