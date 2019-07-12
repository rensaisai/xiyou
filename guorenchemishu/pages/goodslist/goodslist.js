const config = require('../../config.js')
const util = require('../../utils/util.js')
const getCarGoodsByItemIdAndSplIdUrl = config.getCarGoodsByItemIdAndSplIdUrl
const getCarOilsByItemIdAndSplIdUrl = config.getCarOilsByItemIdAndSplIdUrl
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
   list:null,
   list1:null,
   oillist:null,
   hiddenNone: 'true',
   goodslist:null,
   repairId:'',
   add:'',
   id:'',
   oil:null,
  },
  goodslist(){
    var that = this
    var url = ''
    var list= []
    var oillist= []
    if (that.data.goodslist.oilFlag == 1){
      url=getCarOilsByItemIdAndSplIdUrl
      var data ={
        interfaceName:url,
        param:{
          splId: app.globalData.carInfo.splId,
          isDefault: '',
          repairId: that.data.repairId,
        }
      }
    } else{
      url=getCarGoodsByItemIdAndSplIdUrl
      var data={
        interfaceName:url,
        paran:{
          itemId: that.data.id,
          splId: app.globalData.carInfo.splId,
          repairId: that.data.repairId,
          isDefault: '',
        }
      }
    }
    util.kmRequest({
      data:data,
      method:"post",
      success:function(res){
       if(res.data.status == 1){
         var goodslist = JSON.parse(res.data.data)
         for (var i = 0; i < goodslist.length; i++){
           if (goodslist[i].goodsPackage != undefined){
             var brandId = that.data.goodslist.brandId
             if (goodslist[i].goodsPackage == that.data.goodslist.goodsPackage && goodslist[i].brandId == brandId) {
               list.push(goodslist[i])
             } else if (goodslist[i].goodsPackage != that.data.goodslist.goodsPackage && goodslist[i].brandId == brandId){
               oillist.push(goodslist[i])
             }
           }else{
             list.push(goodslist[i])
           }
         }
         that.setData({
           list:list,
           oillist: oillist
         })
       }
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
    })
 },
 list(e){
   var that = this
   var list = that.data.list
   var goods = list[e.currentTarget.dataset.index]
   var oillist = that.data.oillist
   var list1 = that.data.list1
   if (that.data.add == 1 && that.data.goodslist.oil == 4){
     for (var i = 0; i < list1.length; i++) {
       if (list1[i].spec == goods.spec && list1[i].viscosity == goods.viscosity && list1[i].catLvl == goods.catLvl ) {
         var oilgoods = list1[i]
       }
     }
   }else{
     if (oillist.length > 0){
     for (var i = 0; i < oillist.length; i++) {
       if (oillist[i].spec == goods.spec && oillist[i].viscosity == goods.viscosity && oillist[i].catLvl == goods.catLvl && oillist[i].goodsName == goods.goodsName) {
         var oilgoods = oillist[i]
       }
     }
    }
   }
   var shops = []
   if (goods.oilFlag == 1 && oilgoods == undefined){
     shops.push(goods)
   } else if (goods.oilFlag == 1 && oilgoods != undefined){
     shops.push(goods, oilgoods)
   }else{
     shops.push(goods)
   }
   console.log(shops)
   var oil = that.data.oil
   if(oil.length == 1){
     for (var i = 0; i <shops.length; i++){
       for (var j = 0; j < oil.length; j++){
           if (shops[i].goodsPackage != oil[j].goodsPackage) {
             shops.splice(i, 1)
           }
         }
     }
   }
   var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
   var prevPage = pages[pages.length - 2];
   prevPage.setData({
     goods: shops
   })
   wx.navigateBack({
     delta:1,
   })
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodslist = JSON.parse(options.goodslist)
    if (options.add == undefined){
      var add = ''
    }else{
      var add = options.add
    }
    this.setData({
      goodslist: goodslist,
      id: options.id,
      add: add,
      oil: JSON.parse(options.oil),
      repairId: options.repairId
    })
    this.goodslist() 
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