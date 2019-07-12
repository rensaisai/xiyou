const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const saveUserTouristUrl = config.saveUserTouristUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  active:true,
  man:'男',
  date:'请选择出生日期',
  schedule:'',
  schedulers:'',
  },
  man(e){
    console.log(e)
   if(this.data.active == true){
     this.setData({
       active:true,
       man: e.currentTarget.dataset.man
     })
   }else{
     this.setData({
       active: true,
       man: e.currentTarget.dataset.man
     })
   }
  },
  woman(e){
    console.log(e)
    if (this.data.active == false) {
      this.setData({
        active: false,
        man: e.currentTarget.dataset.woman,
      })
    } else {
      this.setData({
        active: false,
        man: e.currentTarget.dataset.woman,
      })
    }
  },
  formSubmit(e){
    console.log(e)
   var that = this
   var err = ''
    if (e.detail.value.name.length == 0){
      err='请输入出游人姓名'
    }else if (that.data.date == '请选择出生日期'){
      err = '请选择出生日期'
    }else if (e.detail.value.phone.length == 0){
      err = '请输入出游人手机号'
    } else if (!util.checkPhone(e.detail.value.phone)){
      err = '出游人手机号有误'
    } else if (e.detail.value.identity.length == 0){
      err = '请输入身份证号'
    } else if (!util.isCardNo(e.detail.value.identity)){
      err = '身份证号有误'
    }
    if(err.length >0){
      wx.showToast({
        title:err,
        icon:'none'
      })
      return
    }
    if (that.data.man == '男'){
      var gender = 0
    }else{
      var gender = 1
    }
    var birthday = that.data.date
    var aDate = birthday.split("-")
    var oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]) //转换为9-25-2017格式 
    var present = that.data.schedule
    var aDate = present.split("-")
    var oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    var iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
    var age = parseInt(iDays/365)
    util.kmRequest({
      url: saveUserTouristUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        userName: e.detail.value.name,
        age: age, 
        sex: gender,
        birthDate: that.data.date,
        nationality:'中国大陆',
        phone: e.detail.value.phone,
        identifyNo: e.detail.value.identity,
      },
      method: 'post',
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          wx.navigateBack({
            delta: 1,
          })
          setTimeout(function(){
            wx.showToast({
              title: '添加成功',
              icon: 'none'
            })
          }, 500)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  bindDateChange(e){
  console.log(e)
  this.setData({
    date: e.detail.value
  })
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
    var time = util.formatTime(new Date());  
    console.log(time)
    var times = time.slice(0,10)
    var schedule=times.replace(/\//g, '\-')
    this.setData({
      schedule: schedule
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