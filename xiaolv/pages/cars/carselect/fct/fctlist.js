const getBrInfoUrl = require('../../../../config').getBrInfoUrl
const getPopularBrInfoUrl = require('../../../../config').getPopularBrInfoUrl 
var util = require('../../../../utils/util')
var app = getApp()
Page({
  data: {
    list: [
    ],
    hot:null,
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认false，隐藏

    id: null,
    //下面是字母排序
    // letter: [{ "name": "A" }, { "name": "B" }, { "name": "C" }, { "name": "D" }, { "name": "E" }, { "name": "F" }, { "name": "G" }, { "name": "H" }, { "name": "I" }, { "name": "J" }, { "name": "K" }, { "name": "L" }, { "name": "M" }, { "name": "N" }, { "name": "O" }, { "name": "P" }, { "name": "Q" }, { "name": "R" }, { "name": "S" }, { "name": "T" }, { "name": "U" }, { "name": "V" }, { "name": "W" }, { "name": "X" }, { "name": "Y" }, { "name": "Z" }],
    // letter:[],
    cityListId: '',
    fctList:[],
    hiddenNone: 'true',
    addCar:0
  },
  dataRequest:function(){
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getBrInfoUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          // var list = lists.sort()
          console.log(list)
          var left = that.data.letter
          console.log(left)
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
            letter:letter,
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
  //获取热门车型 
  hot(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getPopularBrInfoUrl,
        param:{}
      },
      success(res){
        if(res.data.status == 1){
          var hot = JSON.parse(res.data.data)
          that.setData({
            hot: hot
          })
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
    var addCar = options.addCar;
    if(addCar != null){
      this.setData({
        addCar:addCar
      });
    }
    app.globalData.fctInfo = null;
    app.globalData.brInfo = null;
    app.globalData.yearInfo = null;
    this.dataRequest();
    this.hot()
  },
  //点击城市字母
  letterTap(e) {
    console.log(e)
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
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
    console.log(event)
    var fcts = this.data.fctList
    for (var i = 0; i < fcts.length; i++){
      for (var j = 0; j < fcts[i].data.length; j++){
        if (fcts[i].data[j].id == event.currentTarget.dataset.id){
          var fct = fcts[i].data[j]
          console.log(fct)
        }
      }
    }
    // []
    wx.navigateTo({
      url: '/pages/cars/carselect/br/brlist?fct=' + JSON.stringify(fct),
    })
  }
})

