const getFctInfoUrl = require('../../../../config').getFctInfoUrl

var util = require('../../../../utils/util')

var app = getApp()
Page({
  data: {
    list: [
    ],

    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏

    id: null,
    //下面是字母排序
    // letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    letter:[],
    cityListId: '',
    fctList:[],
    hiddenNone: 'true'
  },
  dataRequest:function(){
    var that = this;
    util.kmRequest({
      url: getFctInfoUrl,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          var letter = new Array();
          var fctList = new Array();
          var currentLetter = '';
          var currentData;
          for(var i = 0; i < list.length; i++){
            if (currentLetter != list[i].azSort){
              currentLetter = list[i].azSort;
              letter.push(currentLetter);
              currentData = new Array();
              currentData.push(list[i]);
              fctList.push({ letter: currentLetter, data: currentData});
            } else {
              currentData.push(list[i]);
            }
          }
          that.setData({
            fctList: fctList,
            list: list,
            letter:letter
          });
          if (that.data.fctList == null || that.data.fctList.length == 0) {
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
    // var secondId = options.id;
    this.dataRequest();
  },
  //点击城市字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
    //util.kmConsoleLog(this.data.cityListId);
  },
  binderrorimg: function (e) {
    var fctList = this.data.fctList;
    var pItem = fctList[e.target.dataset.pindex];
    var errorItem = pItem.data[e.target.dataset.index];
    errorItem.img = "/image/car.png";
    this.setData({
      fctList: fctList
    });
  },
  selectOver: function (event) {
    var selectItem = event.currentTarget.dataset.item;
    app.globalData.fctInfo = selectItem;
    wx.navigateTo({
      url: '/pages/cars/carselect/br/brlist?fctid=' + selectItem.id
    });
  }
})

