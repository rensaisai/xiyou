const config = require('../../../../config')
const getCarTypeUrl = config.getCarTypeUrl

var util = require('../../../../utils/util')

var app = getApp()
Page({
  data: {
    list: [],

    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    id: null,
    titleName: '',
    logo: '',
    hiddenNone: 'true',
    cantAdd: 'true',
    page:0,//当前页数 0
    baseId:''
  },
  dataRequest: function (init) {
    var that = this;
    if(init){
      this.serData({
        page: 0
      });
    }
    util.kmRequest({
      url: getCarTypeUrl,
      data: {
        goodsBaseId: this.data.baseId,
        page: this.data.page,
        row: 20
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = that.data.list;
          if(init){
            list = JSON.parse(res.data.data);
          }else{
            list = list.concat(JSON.parse(res.data.data));          
          }
          that.setData({
            list: list,
            page: that.data.page + 1
          });
          if (list == null || list.length == 0) {
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
    this.dataRequest(true);
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
    this.dataRequest(false);
    setTimeout(() => {     
      this.setData({
        isHideLoadMore: true
      })
    }, 1000)
  },
  onLoad: function (options) {

    var baseId = options.baseId;
    this.setData({
      baseId:baseId
    });
    this.dataRequest();
  },
  onShow: function () {
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];

    app.globalData.brInfo = selectItem;
    wx.navigateTo({
      url: '/pages/cars/mycar/cardetail/mycar?carInfo=' + JSON.stringify(selectItem)
    });
  }
})

