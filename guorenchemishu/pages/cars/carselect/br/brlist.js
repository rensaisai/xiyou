const getFctInfoUrl = require('../../../../config').getFctInfoUrl
var util = require('../../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [],
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    fct:null,
    titleName:'',
    logo: '',
    hiddenNone: 'true',
    addCar: 0
  },
  dataRequest:function(){
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getFctInfoUrl,
        param:{
          brId: this.data.fct.id
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
    //车辆配牌id 
  
    var fct = JSON.parse(options.fct);
    console.log(fct)
    this.setData({
      fct: fct
    })
    this.dataRequest();
  },
  selectOver: function (event) {
    var list = this.data.list
    for(var i=0; i<list.length; i++){
      for (var j = 0; j < list[i].carFcts.length; j++){
        if (list[i].carFcts[j].id == event.currentTarget.dataset.id){
          var br = list[i].carFcts[j]
        }
      }
    }
    console.log(br)
    wx.navigateTo({
      url: '/pages/cars/carselect/cc/cclist?br=' + JSON.stringify(br)  +'&fct='+JSON.stringify(this.data.fct),
    })
  }
})

