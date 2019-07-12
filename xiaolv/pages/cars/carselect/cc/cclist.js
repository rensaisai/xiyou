const getCcInfoByFctIdUrl = require('../../../../config').getCcInfoByFctIdUrl

var util = require('../../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    fct: null,
    br: null,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏
  },
  dataRequest: function (){
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getCcInfoByFctIdUrl,
        param:{
          fctId: that.data.br.id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          that.setData({
            list: JSON.parse(res.data.data)
          });
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
    this.dataRequest();
    wx.showNavigationBarLoading()

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
    //车系i
    var br = JSON.parse(options.br);
    //车辆品牌
    var fct = options.fct
      this.setData({
        fct: fct,
        br: br,
      })
    this.dataRequest();
  },
  selectOver: function (event) {
    console.log(event)
    var displacement = this.data.list[event.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/cars/carselect/year/yearlist?displacement=' + JSON.stringify(displacement) + '&fct=' + this.data.fct + '&br=' + JSON.stringify(this.data.br)
    })
  }
})

