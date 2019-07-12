const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const updateUserTouristUrl = config.updateUserTouristUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    schedule: null,
    man: '',
  },
  man(e) {
    console.log(e)
    var that = this
    var list = that.data.list
    if (e.currentTarget.dataset.man == '男') {
      list.active = true
      that.setData({
        man: '男',
        list: list
      })
    }
  },
  woman(e) {
    console.log(e)
    var that = this
    var list = that.data.list
    if (e.currentTarget.dataset.woman == '女') {
      list.active = false
      that.setData({
        man: '女',
        list: list
      })
    }
  },
  bindDateChange(e) {
    var list = this.data.list
    list.birthDate = e.detail.value
    this.setData({
      list: list
    })
  },
  formSubmit(e) {
    console.log(e)
    var that = this
    var err = ''
    if (e.detail.value.name.length == 0) {
      err = '请输入出游人姓名'
    } else if (e.detail.value.phone.length == 0) {
      err = '请输入出游人手机号'
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '出游人手机号有误'
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: 'none'
      })
      return
    }
    if (that.data.man == '男') {
      var gender = 0
    } else {
      var gender = 1
    }
    var list = that.data.list
    var birthday = list.birthDate
    var aDate = birthday.split("-")
    var oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为9-25-2017格式 
    var present = that.data.schedule
    var aDate = present.split("-")
    var oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
    var age = parseInt(iDays / 365)
    util.kmRequest({
      url: updateUserTouristUrl,
      data: {
        id: that.data.list.id,
        userName: e.detail.value.name,
        age: age,
        sex: gender,
        birthDate: list.birthDate,
        nationality: '中国大陆',
        phone: e.detail.value.phone,
        identifyNo: e.detail.value.identity,
      },
      method: 'post',
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          wx.navigateBack({
            url: 1,
          })
          setTimeout(function () {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            })
          }, 500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    console.log(time)
    var times = time.slice(0, 10)
    var schedule = times.replace(/\//g, '\-')
    console.log(schedule)
    this.setData({
      schedule: schedule
    })
    var list = JSON.parse(options.list)
    list.birthDate = list.birthDate.slice(0, 10)
    if (list.tourisSex == 0) {
      list.active = true
      this.setData({
        man: '男'
      })
    } else {
      list.active = false
      this.setData({
        man: '女'
      })
    }
    this.setData({
      list: list
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