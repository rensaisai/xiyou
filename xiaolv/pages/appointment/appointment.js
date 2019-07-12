const config = require('../../config.js')
const util = require('../../utils/util.js')
const getTimeByRepairIdUrl = config.getTimeByRepairIdUrl
const getTimeByOrderIdUrl = config.getTimeByOrderIdUrl
const saveTimeByOrderIdUrl = config.saveTimeByOrderIdUrl
const updateTimeByOrderIdUrl = config.updateTimeByOrderIdUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //格式为年月日的当前日期 
   currentdate:'',
  //格式为年月日的日期  
   time:'',
  //转了格式的当前时间  
   current:'',
  //格式为--日期
   currenttime:'',
  //自己预约的时间
    datetime:'',
    id:'',
    repairId:'',
    repairName:'',
   listtime:[
     { time: '8:00',id:'1'},
     { time: '8:30',id:'2'},
     { time: '9:00',id:'3'},
     { time: '9:30',id:'4'},
     { time: '10:00',id:'5'},
     { time: '10:30',id:'6'},
     { time: '11:00',id:'7'},
     { time: '11:30',id:'8'},
     { time: '12:00',id:'9'},
     { time: '12:30',id:'10'},
     { time: '13:00',id:'11'},
     { time: '13:30',id:'12'},
     { time: '14:00',id:'13'},
     { time: '14:30',id:'14'},
     { time: '15:00',id:'15'},
     { time: '15:30',id:'16'},
     { time: '16:00',id:'17'},
     { time: '16:30',id:'18'},
     { time: '17:00',id:'19'},
     { time: '17:30',id:'20'},
     { time: '18:00',id:'21'},
     { time: '18:30',id:'22'},
     { time: '19:00',id:'23'},
     { time: '19:30',id:'24'},
     { time: '20:00',id:'25'},
     { time: '20:30',id:'26'},
     { time: '21:00',id:'27'},
   ]
  },
  // 查询所有的预约时间
  alltime(){
    var that = this
    var date = that.data.currenttime.replace(/\//g, '-')
    util.kmRequest({
      data:{
        interfaceName: getTimeByRepairIdUrl,
        param:{
          repairId: that.data.repairId,
          date1: date
        }
      },
      method:"post",
      success:function(res){
        var list = that.data.listtime
      if(res.data.status == 1){
        var lists = JSON.parse(res.data.data)
        console.log(lists)
        var currenttime = that.data.currenttime
        console.log(currenttime)
        for (var i = 0; i < list.length; i++) {
          list[i].date = Date.parse(currenttime + ' ' + list[i].time)
          for (var j = 0; j < lists.length; j++) {
            var date = lists[j].date1.slice(0, 10).replace(/\-/g, '/')
            var datetime = Date.parse(date+' '+ lists[j].time1)
            if (list[i].date == datetime){
              console.log(6666666)
              list[i].checked = false
            }
            if (list[i].date == datetime && list[i].date == that.data.datetime){
              console.log(7777777777)
              list[i].checked = true
            }
          }
        } 
      }
      that.setData({
        listtime: list
      })
      }
    })
  },
  //查询自己的预约时间
  mytime(){
    var that = this
   util.kmRequest({
     data:{
       interfaceName:getTimeByOrderIdUrl,
       param:{
         orderId: that.data.id
       }
     },
     method:"post",
     success:function(res){
       var list = that.data.listtime
       if(res.data.status == 1){
         var lists = JSON.parse(res.data.data)[0]
         console.log(lists)
        //选中时间  
         var date = lists.date1.slice(0, 10).replace(/\-/g, '/')
         var datetime = Date.parse(date+ ' ' + lists.time1)
         var currenttime = that.data.currenttime
         for (var i = 0; i < list.length; i++) {
           list[i].date = Date.parse(currenttime + ' ' + list[i].time)
           if (list[i].date == datetime){
             console.log(444444444)
             list[i].active = true
           }else{
             console.log(66666666)
             list[i].active = false
           }
         }
         that.setData({
           listtime: list,
           datetime: datetime
         })
       }
       that.alltime()
     }
   })
  },
  //预约保养
  make(time){
    var that = this
    var date = that.data.currenttime.replace(/\//g, '-')
    util.kmRequest({
      data:{
        interfaceName: saveTimeByOrderIdUrl,
        param:{
          userId: app.globalData.kmUserInfo.id,
          orderId: that.data.id,
          date1: date,
          time1: time
        }
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          that.mytime()
          setTimeout(()=>{
            wx.showToast({
              title: '预约成功',
              icon: 'none'
            })
          },400)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  // 修改预约时
  modification(time){
    var that = this
    var date = that.data.currenttime.replace(/\//g, '-')
    util.kmRequest({
      data:{
        interfaceName: updateTimeByOrderIdUrl,
        param:{
          orderId: that.data.id,
          date1: date,
          time1: time
        }
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          wx.showToast({
            title: '修改成功',
            icon:'none'
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  time(e){
    var that = this
    var timelist = this.data.listtime
    var list = timelist[e.currentTarget.dataset.index]
    if (list.checked == true && list.active == false){
      for (var i = 0; i < timelist.length; i++) {
        timelist[i].active = false
        if (timelist[i].id == list.id){
          timelist[i].active = true
          if (that.data.datetime == '') {
              that.make(list.time)
            } else {
              that.modification(list.time)
            }
        }
       }
    }
    this.setData({
      listtime: timelist
    })
  },
  before(){
    var that = this 
    var date = that.data.time
    var today = date.slice(0, 4) + '-' + date.slice(5, 7) + '-' + date.slice(8, 10);
    var addDayCount = -1
    getDateStr(today, addDayCount)
    function getDateStr(today, addDayCount) {
      var dd;
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
      dd = y + "年" + m + "月" + d + '日';
      if (dd >= that.data.currentdate){
        //当前时间 
        var current = that.data.current
        //选择的时间 
        var currenttime = y + "/" + m + "/" + d
        var list = that.data.listtime
        for (var i = 0; i < list.length; i++) {
          list[i].date = Date.parse(currenttime + ' ' + list[i].time)
          if (list[i].date > current) {
            list[i].checked = true
          } else {
            list[i].checked = false
          }
        }
        that.setData({
          time: dd,
          listtime: list,
          currenttime: currenttime
        })
      }
      that.mytime()
    }
  },
  after(){
    var that = this
    var date = that.data.time
    var today = date.slice(0, 4) + '/' + date.slice(5, 7) + '/' + date.slice(8, 10);
    var addDayCount = 1
    getDateStr(today, addDayCount)
    function getDateStr(today, addDayCount) {
      var dd;
      if (today) {
        dd = new Date(today);
      } else {
        dd = new Date();
      }
      dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期
      console.log(dd)
      var y = dd.getFullYear();
      console.log(y)
      var m = dd.getMonth() + 1;//获取当前月份的日期 
      console.log(m)
      var d = dd.getDate();
      console.log(d)
      if (m < 10) {
        m = '0' + m;
      };
      if (d < 10) {
        d = '0' + d;
      };
      dd = y + "年" + m + "月" + d + '日';
      //当前时间 
      var current = that.data.current
      //点击后的时间 
      var currenttime = y + "/" + m + "/" + d
      var list = that.data.listtime
      for (var i = 0; i < list.length; i++) {
        list[i].date = Date.parse(currenttime + ' ' + list[i].time)
        if (list[i].date > current) {
          list[i].checked = true
        } else {
          list[i].checked = false
        }
      }
      that.setData({
        time: dd,
        listtime: list,
        currenttime: currenttime
      })
      that.mytime()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var order = JSON.parse(options.order)
    var times = util.formatTime(new Date())
    var time = times.replace(/\-/g, '/')
    console.log(time)
    //当前日期 
    var currenttime = time.slice(0, 10)
    console.log(currenttime)
    //当前时间 
    var current = Date.parse(time.slice(0, 16))
    console.log(current)
    var list = that.data.listtime
    for(var i=0; i<list.length; i++){
      list[i].date = Date.parse(currenttime +' '+list[i].time)
      list[i].checked = false
      list[i].active = false
      if (list[i].date > current){
        list[i].checked = true
      }else{
        list[i].checked = false
      }
    }
    var times = time.slice(0, 4) + '年' + time.slice(5, 7) + '月' + time.slice(8, 10)+'日';
    that.setData({
      //当前日期 
      currenttime: currenttime,
      //格式为年月日的日期 
      time: times,
      currentdate: times,
      listtime:list,
      //转了格式的日期 
      current: current,
      id: order.id,
      repairId: order.repairId,
      repairName: order.repairName
    })
    that.mytime()
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