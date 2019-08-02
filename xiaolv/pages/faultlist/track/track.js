const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const amapFile = require('../../../utils/amap-wx.js')
const getUserStrokeUrl = config.getUserStrokeUrl
const getUserStrokeTrajectoryByIdUrl = config.getUserStrokeTrajectoryByIdUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:[],
    height:'',
    width:'',
    journey:null,
    polyline:[],
    page:0,
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    loadmore: false,
  },
  detail(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/faultlist/track-detail/detail?list=' + JSON.stringify(this.data.journey[e.currentTarget.dataset.index]),
    })
  },
  journey() {
    var that = this
    util.kmRequestobd({
      data: {
        interfaceName: getUserStrokeUrl,
        param: {
          pageNum:that.data.page
        }
      },
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          for(var i = 0; i <list.length; i++){
            // that.track(list[i].id)
            list[i].date = list[i].endTime.slice(0, 10)
            list[i].speeds = parseInt(list[i].speed)
            list[i].time = (list[i].duration / 3600).toFixed(6)
            var dates = list[i].time
            if (dates > 0.01) {
              list[i].time = (list[i].duration / 3600).toFixed(2)
            }
          }
          if (that.data.journey != null){
            var lists = that.data.journey
            var list = lists.concat(list)
          }
          that.setData({
            journey: list
          })
        }else if(res.data.status ==6){
          if (that.data.page > 0) {
            that.setData({
              page: that.data.page - 1,
              loadmore: true
            });
          }
        }
      }
    })
  },
  // track(id) {
  //   var that = this
  //   util.kmRequestobd({
  //     data: {
  //       interfaceName: getUserStrokeTrajectoryByIdUrl,
  //       param: {
  //         id: id
  //       }
  //     },
  //     success: (res) => {
  //       var polylines = that.data.polyline
  //       var imgs = that.data.img
  //       if (res.data.status == 1) {
  //         // var arr = []
  //         var arr = ''
  //         var lists = []
  //         var addres = res.data.data.split(';')
  //         for (var i = 0; i < addres.length; i++) {
  //           var addre = addres[i]
  //           var list = addre.split(',')
  //           lists.push(list)
  //           // arr.push({ longitude: list[0], latitude: list[1] })
  //           // arr += list[0] + ',' + list[1]+';'
  //         }
  //         var address = lists.slice(0, lists.length-1)
  //         for (var i = 0; i < address.length; i++ ){
  //           arr += address[i][0] + ',' + address[i][1]+';'
  //         }
  //         var arrs = arr.substring(0, arr.length-1)
  //       var myAmapFun = new amapFile.AMapWX({ key:"ccbbea7edf9640d2c1749e165c40a840"});
  //         var size = 75 + "*" + 75;
  //             myAmapFun.getStaticmap({
  //               size: size,
  //               location: lists[0][0] + ',' + lists[0][1] ,
  //               scale: 2,
  //               markers: "mid,0x008000,A:" + lists[0][0] + ',' + lists[0][1] + ';' + lists[lists.length - 2][0] + ',' + lists[lists.length - 2][0],
  //               paths: "2,0xFF0000,1,,:" + arrs,
  //               success: function (data) {
  //                 imgs.push(data.url)
  //                 that.setData({
  //                   img: imgs
  //                 })
  //               },
  //               fail: function (info) {
  //                 wx.showModal({ title: info.errMsg })
  //               }
  //             })
  //         // var polyline = [{
  //         //   points: arrs,
  //         //   color: "#DC143C",
  //         //   width: 2,
  //         //   dottedLine: false
  //         // }]
  //         // var markers = [{
  //         //   iconPath: "/image/address3.png",
  //         //   id: 0,
  //         //   latitude: arrs[0].latitude,
  //         //   longitude: arrs[0].longitude,
  //         //   width: 8,
  //         //   height: 8
  //         // }, {
  //         //   iconPath: "/image/address4.png",
  //         //   id: 0,
  //         //   latitude: arrs[arrs.length - 1].latitude,
  //         //   longitude: arrs[arrs.length - 1].longitude,
  //         //   width: 8,
  //         //   height: 8
  //         // }]
  //         // polylines.push({polyline, markers}) 
  //       }else{
  //         var images = null
  //         imgs.push(images)
  //         that.setData({
  //           img: imgs
  //         })
  //         // var polyline = []
  //         // var markers = []
  //         // polylines.push({ polyline, markers }) 
  //       }
  //       // that.setData({
  //       //   polyline: polylines,
  //       // })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.journey()
    wx.getSystemInfo({
      success: function (data) {
         that.setData({
           height:data.windowHeight,
           width: data.windowWidth
         })
      }
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
    var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true) {
      that.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page: that.data.page + 1
        })
        that.journey();
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})