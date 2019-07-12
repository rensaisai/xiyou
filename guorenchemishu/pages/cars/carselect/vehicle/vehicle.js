const config = require('../../../../config.js')
const util = require('../../../../utils/util.js')
const getCarSplByCcAndYearAndFctIdUrl = config.getCarSplByCcAndYearAndFctIdUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:null,
  fct:null,
  br:null, 
  displacement:null,
  year:null,
  },
  vehicle(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getCarSplByCcAndYearAndFctIdUrl,
        param:{
          fctId: that.data.br.id,
          ccId: that.data.displacement.id,
          yearId: that.data.year.id,
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          that.setData({
            list:list
          })
        }
       console.log(res.data)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
       //车系
      br: JSON.parse(options.br) ,
       //车辆品牌 
      fct: JSON.parse(options.fct),
        //排量
      displacement: JSON.parse(options.displacement),
        //年款
      year: JSON.parse(options.year),
    })
    this.vehicle()
  },
  selectOver(event){
  var basis = this.data.list[event.currentTarget.dataset.index]
  wx.navigateTo({
    url: '/pages/cars/mycar/cardetail/mycar?fct=' + JSON.stringify(this.data.fct) + '&br=' + JSON.stringify(this.data.br) + '&basis=' + JSON.stringify(basis) + '&displacement=' + JSON.stringify(this.data.displacement) + '&year=' + JSON.stringify(this.data.year)
  })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})