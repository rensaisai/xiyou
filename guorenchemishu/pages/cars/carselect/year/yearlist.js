const getYearInfoByCcIdUrl = require('../../../../config').getYearInfoByCcIdUrl

var util = require('../../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    img:'',
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏
    displacement:null,
    fct:null,
    br:null,
    titleName:'',
    logo: '',
    hiddenNone: 'true',
    addCar: 0
  },
  dataRequest: function (){
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getYearInfoByCcIdUrl,
        param:{
          ccId: this.data.displacement.id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          that.setData({
            list: JSON.parse(res.data.data)
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
    this.dataRequest();
    wx.showNavigationBarLoading()

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
    //排量
    var displacement = JSON.parse(options.displacement);
    //车辆品牌id
    var fct = options.fct
    //车系id 
    var br = options.br
    this.setData({
      fct:fct,
      br: br,
      displacement: displacement
    })
    this.dataRequest();
  },
  selectOver: function (event) {
    var year= this.data.list[event.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/cars/carselect/vehicle/vehicle?year=' + JSON.stringify(year) + '&fct=' + this.data.fct + '&br=' + this.data.br + '&displacement=' + JSON.stringify(this.data.displacement),
    }) 
  }
})

