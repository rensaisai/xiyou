const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCarSplByGoodsIdUrl = config.getCarSplByGoodsIdUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   carlist:null,
   loadmore:false,
   isHideLoadMore:true,
   page:0,
  },
  carlist(){
   var that = this
    util.kmRequest({
      data:{
        interfaceName: getCarSplByGoodsIdUrl,
        param:{
          goodsId:that.data.list.id,
          pageNumber:that.data.page
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          if (that.data.carlist == null){
            var carlist = list
          }else{
            var carlist = that.data.carlist.concat(list)
          }
          that.setData({
            carlist: carlist
          })
        }else if(res.data.status == 6){
          if (that.data.page > 0) {
            that.setData({
              page: that.data.page - 1,
              loadmore: true
            });
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: JSON.parse(options.list)
    })
    this.carlist()
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
    var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true) {
      that.setData({
        isHideLoadMore: false,
      });
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page: that.data.page + 1
        })
        that.carlist();
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})