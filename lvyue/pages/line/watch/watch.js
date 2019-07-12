const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getAllScheduleDateByTouristIdUrl = config.getAllScheduleDateByTouristIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isvip:'',
    some:null,
    active: true,
    num: 1,
    nums: 0,
    list:null,
    id:'',
    day: '',
    year: '',
    month: '',
    date: '2017-01',
    today: '',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false,
    type:''
  },
  schedule(id){
    var that = this
    var calendar = that.data.calendar
    util.kmRequest({
      url: getAllScheduleDateByTouristIdUrl,
      data:{
        touristId:id,
      },
      method: 'post',
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for(var i=0; i<list.length; i++){
            var time = list[i].scheduleDate.substring(0,10)
            list[i].time = time
          }
          that.setData({
            list:list
          })
          that.list()
      }   
      }
    })
  },
  list(){
   var that = this
   let list = that.data.list
   var calendar = that.data.calendar
  //  if (calendar.second != [] ){
    for(var i=0; i<list.length; i++){
      // if(that.data.type == 0){
        for (var l = 0; l < calendar.fourth.length; l++) {
          calendar.fourth[l].actives = false
          if (list[i].time == calendar.fourth[l].date) {
            if (that.data.type == 0){
              calendar.fourth[l].price = '￥' + list[i].nowPrice
            }
            if (that.data.type == 1 && app.globalData.kmUserInfo.isVip == 0) {
              calendar.fourth[l].price = '￥' + list[i].noMemberPrice
            }
            if (that.data.type == 1 && app.globalData.kmUserInfo.isVip != 0) {
              calendar.fourth[l].price = '￥' + list[i].memberPrice
            }
              calendar.fourth[l].active = true
          }
        }
        for (var s = 0; s < calendar.first.length; s++){
          calendar.first[s].actives = false
          if (list[i].time == calendar.first[s].date) {
            if (that.data.type == 0) {
              calendar.first[s].price = '￥' + list[i].nowPrice
            }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip == 0) {
              calendar.first[s].price = '￥' + list[i].noMemberPrice
            // }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip != 0) {
              calendar.first[s].price = '￥' + list[i].memberPrice
            // }
            calendar.first[s].active = true
          }
        }
        for (var j = 0; j < calendar.second.length; j++) {
          calendar.second[j].actives = false
          if (list[i].time == calendar.second[j].date) {
            if (that.data.type == 0) {
               calendar.second[j].price = '￥' + list[i].nowPrice
            }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip == 0) {
              calendar.second[j].price = '￥' + list[i].noMemberPrice
            // }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip != 0) {
              calendar.second[j].price = '￥' + list[i].memberPrice
            // }
            calendar.second[j].active = true
          }
        }
        for (var m = 0; m < calendar.third.length; m++) {
          calendar.third[m].actives = false
          if (list[i].time == calendar.third[m].date) {
            if (that.data.type == 0) {
               calendar.third[m].price = '￥' + list[i].nowPrice
            }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip == 0) {
              calendar.third[m].price = '￥' + list[i].noMemberPrice
            // }
            // if (that.data.type == 1 && app.globalData.kmUserInfo.isVip != 0) {
              calendar.third[m].price = '￥' + list[i].memberPrice
            // }
            calendar.third[m].active = true
          }
        } 
    }
    // }
   that.setData({
    calendar: calendar
   })
  },
  dd1() {
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
    var some = that.data.some
    var num = that.data.num + 1
    // var cost = some.nowPrice
    // some.price = cost * num
    some.adultnum = num
    console.log(some)
    that.setData({
      num: num,
      some: some
    })
  },
  reduce1() {
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
    var some = that.data.some
    var num = that.data.num - 1
    if (num <= 1) {
      some.adultnum = 1
      that.setData({
        num: 1,
        some:some
      })
    } else {
      some.adultnum = num
      that.setData({
        num: num,
        some:some
      })
    }
  },
  dd2() {
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
    var some = that.data.some
    var nums = that.data.nums + 1
    some.childrennum = nums
    that.setData({
      nums: nums,
      some:some
    })
  },
  reduce2() {
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
    var some = that.data.some
    var nums = that.data.nums - 1
    if (nums <= 0) {
      some.childrennum = 0
      that.setData({
        nums: 0,
        some:some
      })
    } else {
      some.childrennum = nums
      that.setData({
        nums: nums,
        some:some
      })
    }
  },
  next(){
    if (this.data.some == null){
      wx.showToast({
        title: '请选择出游日期',
        icon:'none',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/line/order/order?some='+JSON.stringify(this.data.some)+'&type='+this.data.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    var type = options.type
    const date = new Date()
      , month = this.formatMonth(date.getMonth() + 1)
      , year = date.getFullYear()
      , day = this.formatDay(date.getDate())
      , today = `${year}-${month}-${day}`
    let calendar = this.generateThreeMonths(year, month)
    this.setData({
      calendar,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}-${month}`,
      id:id,
      type: type,
    })
    this.schedule(id)
  },
  showCaldenlar() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
    })
  },
  /**
  * 
  * 左右滑动
  * @param {any} e 
  */
  swiperChange(e) {
    const lastIndex = this.data.swiperIndex
      , currentIndex = e.detail.current
    let flag = false
      , { year, month, day, today, date, calendar, swiperMap } = this.data
      , change = swiperMap[(lastIndex + 2) % 4]
      , time = this.countMonth(year, month)
      , key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0
        ? flag = true
        : null
    } else {
      lastIndex === 0 && currentIndex === 3
        ? null
        : flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}-${month}`
    day = ''
    if (today.indexOf(date) !== -1) {
      day = today.slice(-2)
    }

    time = this.countMonth(year, month)
    calendar[change] = null
    calendar[change] = this.generateAllDays(time[key].year, time[key].month)
    this.setData({
      swiperIndex: currentIndex,
      //文档上不推荐这么做，但是滑动并不会改变current的值，所以随之而来的计算会出错
      year,
      month,
      date,
      day,
      calendar,
      some: null,
      hide: false,
    })
    this.list()
  },
  /**
  * 
  * 点击切换月份，生成本月视图以及临近两个月的视图
  * @param {any} year 
  * @param {any} month 
  * @returns {object} calendar
  */
  generateThreeMonths(year, month) {
    let { swiperIndex, swiperMap, calendar } = this.data
      , thisKey = swiperMap[swiperIndex]
      , lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1]
      , nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1]
      , time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },
  bindDayTap(e) {
    console.log(e)
    var date = e.currentTarget.dataset.date
    var year = date.substring(0, 4)
    var day = e.currentTarget.dataset.day
    var calendar = this.data.calendar
    let list = this.data.list
    for (var i = 0; i < list.length; i++) {
      for (var l = 0; l < calendar.fourth.length; l++) {
        calendar.fourth[l].actives = false
        if ((list[i].time == date) && (calendar.fourth[l].date == date)) {
          if (calendar.fourth[l].actives == true) {
            calendar.fourth[l].actives = false
            this.setData({
              some: null,
              hide: false,
              calendar: calendar
            })
          } else {
            calendar.fourth[l].actives = true
            list[i].adultnum = 1
            list[i].childrennum = 0
            this.setData({
              some: list[i],
              hide: true,
              calendar: calendar
            })
          }
        }
      } 
      
      for (var s = 0; s < calendar.first.length; s++) {
        calendar.first[s].actives = false
        if ((list[i].time == date) && (calendar.first[s].date == date)) {
          if (calendar.first[s].actives == true) {
            calendar.first[s].actives = false
            this.setData({
              some: null,
              hide: false,
              calendar: calendar
            })
          } else {
            calendar.first[s].actives = true
            list[i].adultnum = 1
            list[i].childrennum = 0
            this.setData({
              some: list[i],
              hide: true,
              calendar: calendar
            })
          }
        }
      } 
    for (var j = 0; j < calendar.second.length; j++) {
      calendar.second[j].actives = false
      if ((list[i].time == date) && (calendar.second[j].date == date)){
        if (calendar.second[j].actives == true){
          calendar.second[j].actives = false
          this.setData({
            some:null,
            hide:false,
            calendar: calendar
          })
        }else{
          calendar.second[j].actives = true
          list[i].adultnum = 1
          list[i].childrennum = 0
          this.setData({
            some: list[i],
            hide:true,
            calendar: calendar
          })
        }
      }
    } 
      for (var m = 0; m < calendar.third.length; m++) {
        calendar.third[m].actives = false
        if ((list[i].time == date) && (calendar.third[m].date == date)) {
          if (calendar.third[m].actives == true) {
            calendar.third[m].actives = false
            this.setData({
              some: null,
              hide: false,
              calendar: calendar
            })
          } else {
            calendar.third[m].actives = true
            list[i].adultnum = 1
            list[i].childrennum = 0
            this.setData({
              some: list[i],
              hide: true,
              calendar: calendar
            })
          }
        }
      }
    }
   
  },
  bindDateChange(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2)
      , year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },
  prevMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
  },
  nextMonth(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
  /**
  * 
  * 直接改变日期
  * @param {any} year 
  * @param {any} month 
  */
  changeDate(year, month) {
    let { day, today } = this.data
      , calendar = this.generateThreeMonths(year, month)
      , date = `${year}-${month}`
    date.indexOf(today) === -1
      ? day = '01'
      : day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
  /**
  * 
  * 月份处理
  * @param {any} year 
  * @param {any} month 
  * @returns 
  */
  countMonth(year, month) {
    let lastMonth = {
      month: this.formatMonth(parseInt(month) - 1)
    }
      , thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      }
      , nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12
      ? `${parseInt(year) - 1}`
      : year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1
      ? `${parseInt(year) + 1}`
      : year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
  /**
  * 生成上个月应显示的天
  * @param {any} year 
  * @param {any} month 
  * @returns 
  */
  lastMonthDays(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1)
      , lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12
        ? `${parseInt(year) - 1}`
        : year
      , lastNum = this.getNumOfDays(lastMonthYear, lastMonth) //上月天数
    let startWeek = this.getWeekOfDate(year, month - 1, 1) //本月1号是周几
      , days = []
    if (startWeek == 7) {
      return days
    }

    const startDay = lastNum - startWeek

    return this.generateDays(lastMonthYear, lastMonth, lastNum, { startNum: startDay, notCurrent: true })
  },
  /**
  * 生成下个月应显示天
  * @param {any} year 
  * @param {any} month
  * @returns 
  */
  nextMonthDays(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1)
      , nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1
        ? `${parseInt(year) + 1}`
        : year
      , nextNum = this.getNumOfDays(nextMonthYear, nextMonth) //下月天数
    let endWeek = this.getWeekOfDate(year, month)  //本月最后一天是周几
      , days = []
      , daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, { startNum: 1, notCurrent: true })
  },
  /**
  * 
  * 生成一个月的日历
  * @param {any} year 
  * @param {any} month 
  * @returns Array
  */
  generateAllDays(year, month) {
    let lastMonth = this.lastMonthDays(year, month)
      , thisMonth = this.currentMonthDays(year, month)
      , nextMonth = this.nextMonthDays(year, month)
      , days = [].concat(lastMonth, thisMonth, nextMonth)
    return days
  },
  /**
  * 
  * 生成日详情
  * @param {any} year 
  * @param {any} month 
  * @param {any} daysNum 
  * @param {boolean} [option={
  * startNum:1,
  * grey: false
  * }] 
  * @returns Array 日期对象数组
  */
  generateDays(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
  /**
  * 
  * 获取指定月第n天是周几 |
  * 9月第1天： 2017, 08, 1 |
  * 9月第31天：2017, 09, 0 
  * @param {any} year 
  * @param {any} month 
  * @param {number} [day=0] 0为最后一天，1为第一天
  * @returns number 周 1-7, 
  */
  getWeekOfDate(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
  /**
  * 
  * 获取本月天数
  * @param {number} year 
  * @param {number} month 
  * @param {number} [day=0] 0为本月0最后一天的
  * @returns number 1-31
  */
  getNumOfDays(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
  /**
  * 
  * 月份处理
  * @param {number} month 
  * @returns format month MM 1-12
  */
  formatMonth(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
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
    // this.setData({
    //   isvip: app.globalData.kmUserInfo.isVip
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