const config = require('../../../../config')
const getOemAndCarAndSizeUrl = config.getOemAndCarAndSizeUrl

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
    keyword:'',
    searchTypeName: '配件编号',
    searchType: 0,//0配件编号 1车型关键字 2oem
    searchTypeList: ['配件编号', '车型关键字', 'OEM']
  },
  searchPart: function () {
    if (this.data.keyword.length == 0){
      wx.showToast({
        title: '请输入查询关键字',
        icon: 'none'
      })
      return;
    }
    var that = this;
    util.kmRequest({
      url: getOemAndCarAndSizeUrl,
      data: {
        type: this.data.searchType,
        param: this.data.keyword
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          that.setData({
            list: list
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
        list: list
      })
    }, 1000)
  },
  onLoad: function (options) {
    
  },
  actionSheetTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.searchTypeList,
      success: function (e) {
        util.kmConsoleLog(e.tapIndex);

        that.setData({
          searchTypeName: that.data.searchTypeList[e.tapIndex],
          searchType: e.tapIndex
        });
      }
    })
  },
  keywordInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];

    app.globalData.brInfo = selectItem;
    wx.navigateTo({
      url: '/pages/users/searchparts/partcars/partcarlist?baseId=' + selectItem.baseId
    });
  }
})

