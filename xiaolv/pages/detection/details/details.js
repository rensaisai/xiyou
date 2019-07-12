const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getRepairCheckByIdUrl = config.getRepairCheckByIdUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  information(id){
    var that = this
    util.kmRequest({
       data:{
         interfaceName: getRepairCheckByIdUrl,
         param:{
           id:id
         }
       },
       success:(res)=>{
         if(res.data.status == 1){
           var list = JSON.parse(res.data.data)[0]
           list.projects.forEach(i=>{
             if(i.status == 0){
               i.status1 = '正常'
             } else if (i.status == 1){
               i.status1 = '异常'
             }else{
               i.status1 = '未检测'
             }
           })
           that.setData({
             list:list
           })
           console.log(list)
         }
       }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.information(options.id)
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