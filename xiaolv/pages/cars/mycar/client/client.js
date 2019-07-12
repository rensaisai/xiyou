const getUserTeam2Url = require('../../../../config').getUserTeam2Url

var util = require('../../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    img:'/image/headdefault.png',
    // searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    // callbackcount: 15,      //返回数据的个数  
    // isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏

    // id: null,
    //下面是字母排序
    // letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    // letter: [],
    // cityListId: '',
    // fctList: [],
    hiddenNone: 'true',
    // addCar: 0
  },
  dataRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getUserTeam2Url,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          console.log(list)
          that.setData({
            list: list,
          });
          }
          if (that.data.list == null || that.data.list.length == 0) {
            that.setData({
              hiddenNone: ''
            })
          } else {
            that.setData({
              hiddenNone: 'true'
            })
          }
        }
      })
  },
  phone(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  onLoad:function(){
   
  },
  onShow:function(){
    this.dataRequest()
  },
  //下拉刷新
  onPullDownRefresh: function () {
  
  },
  //加载更多
  onReachBottom: function () {
   
  },
  onLoad: function (options) {
   
  },

})

