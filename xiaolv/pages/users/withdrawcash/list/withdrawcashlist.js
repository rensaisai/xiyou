const config = require('../../../../config')
const getEnchashmentListUrl = config.getEnchashmentListUrl
const checkUserAgentUrl = config.checkUserAgentUrl
var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    list: [
    ],

    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    hiddenNone: 'true'

  },
  withdrawcashRequest: function (eywords) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getEnchashmentListUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var li= JSON.parse(res.data.data)
          for(var i=0; i<li.length; i++){
            if (li[i].status == 0){
              li[i].statue = '申请中'
            }
            if (li[i].status == 1){
              li[i].statue = '处理中'
            }
            if (li[i].status == 2){
              li[i].statue = '处理完成'
            }
            if (li[i].status == 3) {
              li[i].statue = '申请失败'
            }
          }
          that.setData({
            list: li
          });
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
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.withdrawcashRequest();
    wx.showNavigationBarLoading();

    //模拟加载
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
    }, 1000);
  },
  //加载更多
  onReachBottom: function () {
    this.setData({
      isHideLoadMore: false,
    });
    setTimeout(() => {
      var list = this.data.list;
      this.setData({
        isHideLoadMore: true,
        list:list
      })
    }, 1000)
  },
  onLoad: function (options) {
    // var keywords = options.keywords;
  },
  onShow:function(){
    this.withdrawcashRequest();
  },
  itemClick: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    // wx.navigateTo({
    //   url: '/pages/repairshops/detail/repairdetail?repairId=' + selectItem.id
    // });
  },
  add: function () {
    if (!util.checkUserMemberFlag()) {
      return;
    }
    util.kmRequest({
      data:{
        interfaceName: checkUserAgentUrl,
        param: {}
      },
      success:(res)=>{
        if (res.data.data == ''){
           wx.navigateTo({
             url: '/pages/join/join',
           })
        }
        if (res.data.data != ''){
          var message = JSON.parse(res.data.data)[0]
          if (message.statu == 0) {
             wx.navigateTo({
               url: '/pages/upgrade/success/success',
             })
          }
          if(message.statu == 1){
            wx.navigateTo({
                url: '/pages/users/withdrawcash/add/withdrawcashadd'
            });
          }
          if (message.statu == 2){
            wx.showModal({
              title: '不合格信息',
              content: message.remarks,
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/join/join',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
       
        console.log(message)
        // if (res.data.status == 0){
        //    wx.showToast({
        //      title: '您提交的信息正在审核中,审核通过后可进行提现',
        //      icon:'none'
        //    })
        // }else if(res.data.status == 1){
        //  wx.navigateTo({
        //          url: '/pages/users/withdrawcash/add/withdrawcashadd'
        //  });
        // } else if (res.data.status == 2) {
        //   wx.showToast({
        //     title: '您提交的信息有误，请重新提交',
        //     icon: 'none'
        //   })
        // }
      }
    })
  
  }
})

