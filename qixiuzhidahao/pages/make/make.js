const config = require('../../config.js')
const util = require('../../utils/util.js')
const getTimeNumByRepairIdUrl = config.getTimeNumByRepairIdUrl
const getTimeByRepairIdUrl = config.getTimeByRepairIdUrl
const delTimeByIdUrl = config.delTimeByIdUrl
const saveTimeByRepairIdUrl = config.saveTimeByRepairIdUrl
const getOrderInfoUrl = config.getOrderInfoUrl
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',
    order:null,
    makenum:null,
    day:'',
    date:'',
    currenttime:'',
    listtime: [
      { time: '8:00', id: '1' },
      { time: '8:30', id: '2' },
      { time: '9:00', id: '3' },
      { time: '9:30', id: '4' },
      { time: '10:00', id: '5' },
      { time: '10:30', id: '6' },
      { time: '11:00', id: '7' },
      { time: '11:30', id: '8' },
      { time: '12:00', id: '9' },
      { time: '12:30', id: '10' },
      { time: '13:00', id: '11' },
      { time: '13:30', id: '12' },
      { time: '14:00', id: '13' },
      { time: '14:30', id: '14' },
      { time: '15:00', id: '15' },
      { time: '15:30', id: '16' },
      { time: '16:00', id: '17' },
      { time: '16:30', id: '18' },
      { time: '17:00', id: '19' },
      { time: '17:30', id: '20' },
      { time: '18:00', id: '21' },
      { time: '18:30', id: '22' },
      { time: '19:00', id: '23' },
      { time: '19:30', id: '24' },
      { time: '20:00', id: '25' },
      { time: '20:30', id: '26' },
      { time: '21:00', id: '27' },
    ]
  },
  before() {
    var that = this
    var today = that.data.currenttime
    var addDayCount = -1
    getDateStr(today, addDayCount)
    var dd;
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
      dd = y + "/" + m + "/" + d;
    }
    // if (dd >= that.data.day){
    //   var date = dd
    // }else{
    //   var date = that.data.day
    // }
    console.log(that.data.day)
    var listtime = that.data.listtime
      for (var i = 0; i < listtime.length; i++) {
        listtime[i].active = false
        if (Date.parse(that.data.day) > Date.parse(that.data.currenttime)) {
          listtime[i].checked = false
        } else {
          listtime[i].checked = true
        }
      }
    that.setData({
      currenttime: dd,
      listtime: listtime,
      order: null,
    })
      that.makentime()
  },
  after() {
    var that = this
    var today = that.data.currenttime
    var addDayCount = 1
    getDateStr(today, addDayCount)
    var dd;
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
      dd = y + "/" + m + "/" + d;
    }
    var listtime = that.data.listtime
    for (var i = 0; i < listtime.length; i++) {
      listtime[i].active = false
      if (Date.parse(that.data.day) > Date.parse(that.data.currenttime)) {
        listtime[i].checked = false
      } else {
        listtime[i].checked = true
      }
    }
    that.setData({
      currenttime: dd,
      listtime: listtime,
      order:null,
    })
    that.makentime()
  },
  makenum(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getTimeNumByRepairIdUrl,
        param:{
          repairId: app.globalData.kmUserInfo.repairId,
          date1: that.data.currenttime,
        }
      },
      method:"post",
      success: (res) => {
        if(res.data.status == 1){
          var makenum = JSON.parse(res.data.data)[0]
          console.log(makenum)
          that.setData({
            makenum: makenum
          })
        }
      }
    })
  },
  makentime(){
    var that = this
    var date = that.data.currenttime.replace(/\//g, '-')
    if(that.data.type == 1){
      var data = {
        repairId: app.globalData.kmUserInfo.repairId,
        date1: date,
        orderType:1,
      }
    }else{
      var data = {
        repairId: app.globalData.kmUserInfo.repairId,
        date1: date,
      }
    }
    util.kmRequest({
      data:{
        interfaceName: getTimeByRepairIdUrl,
        param: data
      },
      method: "post",
      success:(res)=>{
       var  listtime = that.data.listtime
       if(res.data.status == 1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for(var i=0; i<list.length; i++){
           for (var j = 0; j < listtime.length; j++){
             var listdate = (list[i].date1.slice(0, 10)).replace(/\-/g, '/')
             list[i].date = Date.parse(listdate + ' ' + list[i].time1)
             listtime[j].date = Date.parse(that.data.currenttime + ' ' + listtime[j].time)
             if (listtime[j].date > that.data.date) {
              //  listtime[j].checked = true
               if (list[i].hourlyRates == 0) {
                 if (list[i].date == listtime[j].date) {
                   listtime[j].active = true
                   listtime[j].orderId = list[i].orderId 
                 }
               }
               if (list[i].hourlyRates == 1) {
                 if (list[i].date == listtime[j].date) {
                   listtime[j].checked = false
                   listtime[j].sid = list[i].id
                 }
               }
             }else{
               listtime[j].checked = false
               if (list[i].hourlyRates == 0) {
                 if (list[i].date == listtime[j].date) {
                   listtime[j].active = true
                   listtime[j].orderId = list[i].orderId
                 }
               }
             }
           }
         }
       }else if(res.data.status == 6){
         for (var i = 0; i < listtime.length; i++) {
           listtime[i].active = false
           listtime[i].checked = false
           listtime[i].date = Date.parse(that.data.currenttime + ' ' + listtime[i].time)
           if (listtime[i].date > that.data.date) {
             listtime[i].checked = true
           }
         }
       }
        that.setData({
          listtime: listtime
        })
      }
    })
  },
  time(e){
   console.log(e)
   var that = this
   var times = that.data.listtime[e.currentTarget.dataset.index]
   var listtime = that.data.listtime
    console.log(times)
    if (times.orderId != undefined){
      util.kmRequest({
        data:{
          interfaceName: getOrderInfoUrl,
          param:{
            orderId: times.orderId
          }
        },
        success:function(res){
          console.log(res.data.data)
          if(res.data.status == 1){
            var order = JSON.parse(res.data.data)[0]
            var serve = ''
            for (var i = 0; i < order.itemsList.length; i++){
              console.log(order.itemsList[i].itemName)
              serve += order.itemsList[i].itemName+','+' ' 
            }
            order.serve = serve
            that.setData({
              order: order
            })
          }
        }
      })
    }else{
      if (that.data.date < times.date) {
        var date = that.data.currenttime.replace(/\//g, '-')
        if (times.checked == true) {
          console.log(date)
          util.kmRequest({
            data: {
              interfaceName: saveTimeByRepairIdUrl,
              param:{
                repairId: app.globalData.kmUserInfo.repairId,
                date1: date,
                time1: times.time
              }
            },
            method: "post",
            success: function (res) {
              if (res.data.status == 1) {
                console.log(JSON.parse(res.data.data))
                that.makentime()
                setTimeout(function () {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'none',
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
        } else {
          util.kmRequest({
            data: {
              interfaceName: delTimeByIdUrl,
              param:{
                id: times.sid,
                date1: date,
                time1: times.time
              }
            },
            success: function (res) {
              if (res.data.status == 1) {
                console.log(res.data.data)
                var listtime = that.data.listtime
                for (var i = 0; i < listtime.length; i++) {
                  listtime.date = Date.parse(that.data.currenttime + ' ' + listtime[i].time)
                  if (listtime[i].date > that.data.date) {
                    if (listtime[i].date == times.date) {
                        listtime[i].checked = true
                      }
                    }
                  }
                that.setData({
                  listtime: listtime
                })
                setTimeout(function () {
                  wx.showToast({
                    title: '修改成功',
                    icon: 'none',
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
        }
      } else {
        wx.showToast({
          title: '不可修改',
          icon: 'none'
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date())
    var date = Date.parse(time.slice(0,16))
    console.log(time)
    //当前日期 
    // var currenttime = time.slice(0, 10).replace(/\//g, '-')
    var currenttime = time.slice(0, 10)
    var listtime = this.data.listtime
    for (var i = 0; i < listtime.length; i++){
      listtime[i].active=false
      listtime[i].checked=true
    }
    if (options.type != undefined){
      var type = options.type
    }else{
      var type = ''
    }
    this.setData({
      currenttime: currenttime,
      day: currenttime,
      date:date,
      listtime: listtime,
      type: type
    })
    this.makenum()
    this.makentime()
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