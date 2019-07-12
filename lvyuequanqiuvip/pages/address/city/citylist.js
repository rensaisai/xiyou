const getCitiesUrl = require('../../../config').getCitiesUrl

var util = require('../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    selec:'',
    tItem:'',
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏
    address:'',
    id: null,
    hiddenNone: 'true'
  },
  dataRequest: function (){
    var that = this;
    util.kmRequest({
      url: getCitiesUrl,
      data: {
        proviceCode: this.data.id
      },
      success: function (res) {
        if(res.data.status == 1){
          that.setData({
            list: JSON.parse(res.data.data)
          });
        }
        that.showNone();
      },
      complete: function (res) {
        that.showNone();
      }
    })
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
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    })
    this.dataRequest();
    wx.showNavigationBarLoading()

    setTimeout(function () {
      // complete
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
    var id = options.id;
    var address = options.address
    console.log(address)
    var selec = options.selec
    var tItem = options.tItem
    if (address != '' || address != null){
      this.setData({
        address: address,
        selec: selec,
        tItem: tItem,
      })
    }
    if(id != null){
      this.setData({
        id:id
      })
    }
    this.dataRequest();
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    app.globalData.cityName = selectItem.regionName;
    app.globalData.cityCode = selectItem.areaLevel;
    if(this.data.address == 1){
      wx.navigateTo({
        url: '/pages/addre/addre?selectItem=' + selectItem.regionName + '&selectItem1=' + selectItem.areaLevel + '&selec=' + this.data.selec + '&tItem=' + this.data.tItem 
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
   
    // wx.navigateTo({
    //   url: '/pages/address/district/districtlist?id=' + selectItem.id
    // });
  }
})

