// pages/users/members/berlist/berlist.js
const config = require('../../../../config.js')
// const getUserByUserIdAndLevelURL = config.getUserByUserIdAndLevelURL
// const getUserByUserIdAndLevel2Url = config.getUserByUserIdAndLevel2Url
const getUserTeamUrl = config.getUserTeamUrl
var app = getApp()
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    listl:[],
    menuTapCurrent: 0,
    isHideLoadMore: true,
    hiddenNone: 'true',
    hidd: 'true',
  },

  stair:function(){
    var that= this;
    util.kmRequest({
      // url: getUserByUserIdAndLevelURL,
      url: getUserTeamUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        level:1,
        // isVip: app.globalData.kmUserInfo.isVip
      },
      success: function (res) {
        // console.log(JSON.parse(res.data.data))
        //  console.log(res.data)
        if(res.data.data != ''){
        var list = JSON.parse(res.data.data)
        for (var i = 0; i < list.length; i++) {
          var phone = list[i].phone;
          var tempstr = phone.slice(3, 7);
          var nick = phone.replace(tempstr, "****")
          list[i].phone = nick
        }
        that.setData({
          list:list
        })
         }
        that.showNone();
      },
       complete: function (res) {
         that.showNone();
      }
    })
  },
  secondlevel: function () {
    var that = this;
    util.kmRequest({
      url: getUserTeamUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        level: 2,
      },
      success: function (res) {
        // console.log(JSON.parse(res.data.data))
        // console.log(res.data)
        if(res.data.data != ''){
        var listl = JSON.parse(res.data.data)
        for (var i = 0; i < listl.length; i++) {
          var phone = listl[i].phone;
          var tempstr = phone.slice(3, 7);
          var nick = phone.replace(tempstr, "****")
          listl[i].phone = nick
        }
        that.setData({
          listl: listl
        })
        }
        that.show();
      },
      complete: function (res) {
        that.show();
      }
    })
  },
  menuTap: function (e) {
    var current = e.currentTarget.dataset.current;//获取到绑定的数据
    //改变menuTapCurrent的值为当前选中的menu所绑定的数据
    this.setData({
      menuTapCurrent: current
    });
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
  show: function () {
    if (this.data.listl == null || this.data.listl.length == 0) {
      this.setData({
        hidd: ''
      })
    } else {
      this.setData({
        hidd: 'true'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.stair();
    // this.secondlevel();
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
    this.stair();
    // this.secondlevel();
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
    this.setData({
      isHideLoadMore: false,
    });
    setTimeout(() => {
      // var list = this.data.list;
      // var listl = this.data.listl;
      this.setData({
        isHideLoadMore: true,
        // list: list,
        // listl: listl
      })
    }, 500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})