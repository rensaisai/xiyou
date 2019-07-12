const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getMailingAddressUrl = config.getMailingAddressUrl
const getLogisticsUrl = config.getLogisticsUrl
var regx = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logistics:null,
    hiddenNone:false,
    addres:','
  },
  addres(addresid){
    var that = this
    
  },
  logistics(expressNo){
    var that = this
    util.kmRequest({
      url: getLogisticsUrl,
      data:{
        expressNo: expressNo
      },
      success:(res)=>{
        if(res.data.status == 1){
          var logistics = JSON.parse(res.data.data)
          console.log(logistics)
          logistics.forEach(i=>{
            i.date = i.expressTime.slice(5,10)
            i.time = i.expressTime.slice(11,16)
          })
          logistics.unshift({ expressRoute: '[收货地址]'+that.data.addres, date:'', time: ''})
          var dates = logistics[logistics.length - 1]
          logistics.push({expressRoute: '已发货', date: dates.date , time:dates.time})
          that.setData({
            logistics: logistics
          })
        }
        if (that.data.logistics == null || that.data.logistics.length ==0){
          that.setData({ 
            hiddenNone:false
          })
        }else{
          that.setData({
            hiddenNone: true
          })
        }
      }
    })
  },
  phone(e){
    var that = this
    var text = that.data.logistics[e.currentTarget.dataset.index].expressRoute
    var phoneNums = text.match(regx);
    if (phoneNums != null){
      wx.makePhoneCall({
        phoneNumber: phoneNums[0]

      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.kmRequest({
      url: getMailingAddressUrl,
      data: {
        id: options.addresid
      },
      success: (res) => {
        if (res.data.status == 1) {
          var addres = JSON.parse(res.data.data)[0]
          that.setData({
            addres: addres.detailAddress
          })
        }
      }
    })
    that.logistics(options.expressNo)
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