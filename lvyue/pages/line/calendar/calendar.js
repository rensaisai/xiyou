var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      type:'',
      schedule:null,
      active:true,
      num:1,
      nums:0,
      years: '',
      months: '',
      days: '',
      dates:'',
      year: '',
      month: '',
      // price:'',
      // children:'',
    week: ['日', '一', '二', '三', '四', '五', '六'],
  },
 next(){
   wx.navigateTo({
     url: '/pages/line/order/order?some=' + JSON.stringify(this.data.schedule)+'&type='+ this.data.type,
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    var date = new Date//当前日期
    var years = date.getFullYear()//当前年
    var  months = date.getMonth() + 1//当前月份
    var  days = date.getDate()//当天
    var kalendar = options.calendar
    var schedule = JSON.parse(kalendar)
    schedule.adultnum = 1
    schedule.childrennum = 0
    var year = schedule.year
    var month = schedule.month
    var dateline = schedule.scheduleDate.substring(8,10)
    var caddy = schedule.scheduleDate.substring(0,10)
    schedule.time = caddy
    this.setData({
      years: years,
      months: months,
      days: days,
      year: year,
      month: month,
      schedule: schedule,
      dates: dateline,
      type:type
    })
    this.dateData(year, month)
  },
  dateData: function (showYear, showMonth) {
    let dataAll = []//总日历数据
    let date = new Date//当前日期
    let year = date.getFullYear()//当前年
    let month = date.getMonth() + 1//当前月份
    let day = date.getDate()//当天

    let thisDate = [year, month, day];//当天日期信息

    let week = date.getDay();//当天星期几

    if (showYear) {
      year = showYear //显示年
    }
    if (showMonth) {
      month = showMonth //显示月
    }
    let showDate = [year, month];//当前显示日期信息
    //获取显示月的天数
    let monthDays = new Date(year, month, 0).getDate();
    let firstWeek = new Date(year + '-' + month + '-' + '1').getDay();
    console.log(monthDays);
    console.log('本月1号星期：' + firstWeek);
    let daysCount = monthDays//一共显示多少天
    let dayscNow = 0//计数器
    for (let i = 0; i < firstWeek; i++) {
      dataAll.push('');
    }
    //把当月的天数转为数组
    for (let i = 1; i <= daysCount; i++) {
      dataAll.push(i)
    }
    for(var i = 0; i < dataAll.length; i++){
      var length = dataAll[i].toString().length
      if (length==1){
        dataAll[i] = '0' + dataAll[i]
      }
    }
    console.log(dataAll);
    for (var i = 0; i < dataAll.length; i++){
      if (this.data.years == this.data.year && this.data.months == this.data.month){
        if (dataAll[i] == this.data.days){
          dataAll[i]='今天'
        }
      }
    }
    this.setData({
      date: dataAll,
      firstWeek: firstWeek,
      thisDate: thisDate,
      showDate: showDate
    })
  },
  dd1(){
    var that = this
    if (that.data.active == false){
      that.setData({
        active: true,
      })
    }else{
      that.setData({
        active: true,
      })
    }
    var schedule = that.data.schedule
    var num = that.data.num+1
    // var cost = that.data.schedule.nowPrice
    schedule.adultnum = num
    // schedule.price = cost*num
    that.setData({
     num: num,
     schedule: schedule
   })
  },
  reduce1(){
    var that = this
    if (that.data.active == false) {
      that.setData({
        active: true,
      })
    } else {
      that.setData({
        active: true,
      })
    }
    var schedule = that.data.schedule
    var num = that.data.num-1
    // var cost = schedule.price
    // if (num >1){
    //   schedule.price = cost - schedule.nowPrice
      
    // }else{
    //   schedule.price = schedule.nowPrice
     
    // }
    if(num <= 1){
      schedule.adultnum = 1
      that.setData({
        num: 1,
        schedule: schedule
      })
    }else{
      schedule.adultnum = num
      that.setData({
        num: num,
        schedule: schedule
      })
    }
  },
  dd2(){
    var that = this
    if(that.data.active == true){
      that.setData({
        active: false,
      })
    }else{
      that.setData({
        active: false,
      })
    }
    var nums = that.data.nums+1
    var schedule = that.data.schedule
    // var cost = schedule.childrenPrice
    // schedule.children = cost * nums
    schedule.childrennum = nums
    that.setData({
      nums:nums,
      schedule: schedule
    })
  },
  reduce2(){
    var that = this
    if (that.data.active == true) {
      that.setData({
        active: false,
      })
    } else {
      that.setData({
        active: false,
      })
    }
    var nums = that.data.nums -1
    var schedule = that.data.schedule
    // if(nums >0){
    //   schedule.children = schedule.children - schedule.childrenPrice
     
    // }else{
    //   schedule.children = schedule.childrenPrice
      
    // }
    if(nums <=0){
      schedule.childrennum = 0
      that.setData({
        nums: 0,
        schedule: schedule,
      })
    }else{
      schedule.childrennum = nums
      that.setData({
        nums: nums,
        schedule: schedule
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
  //  this.setData({
  //    isvip: app.globalData.kmUserInfo.isVip
  //  })
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