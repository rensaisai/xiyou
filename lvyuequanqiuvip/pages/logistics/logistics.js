// pages/logistics/logistics.js
const config = require('../../config.js')
const util = require('../../utils/util.js')
const getLogisticsUrl = config.getLogisticsUrl
var app = getApp()
function checkPhone(text) {
  return text.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\d3,4|\d{3,4}-|\s)?\d{7,14}))?/g);
}
// var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:null,
    arp:'',
    text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var expressNo = options.expressNo 
    var arp = options.arp
    console.log(arp)
    this.setData({
      arp:arp
    })
    this.logistics(expressNo)
  },
  logistics: function (expressNo){
    var that =this
    util.kmRequest({
      url: getLogisticsUrl,
      data:{
        expressNo:expressNo,
      },
      success:function(res){
        if(res.data.status==1){
         var list=JSON.parse(res.data.data)
         console.log(list)
          var name = list[0].expressRoute
          var lengths=name.length - 3;
          var text = name.substring(lengths)
          that.setData({
            text:text
          })
         for(var i=0; i<list.length; i++){
           var date = list[i].expressTime.substring(5,10)
           var time = list[i].expressTime.substring(11,16)
           list[i].date = date
           list[i].time = time
         }
         that.setData({
           list:list
         })
        }
        
      }
    })
  },
  click:function(e){
  console.log(e)
    var content = e._relatedInfo.anchorTargetText
    console.log(content)
    var phone_list = checkPhone(content)
    var yse_phone = []
    for (var i = 0; i < phone_list.length; i++) {
      if (phone_list[i].length == 8 || phone_list[i].length == 7 || phone_list[i].length == 11) {
        yse_phone.push(phone_list[i])
      }
    }
    console.log(yse_phone[0])
    if (yse_phone[0] != undefined){
      console.log(1233)
      wx.makePhoneCall({
        phoneNumber: yse_phone[0],
        success: function () {
          console.log("成功拨打电话")
        }
      })
    }
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