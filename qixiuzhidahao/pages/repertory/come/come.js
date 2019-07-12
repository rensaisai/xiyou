const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const upng = require('../../../utils/upng.js')
const getGoodsAndStockByGoodsNoUrl = config.getGoodsAndStockByGoodsNoUrl
const outStockByGoodsIdUrl = config.outStockByGoodsIdUrl 
const getGoodsStockByNameUrl = config.getGoodsStockByNameUrl
const hostimg1 = config.hostimg1
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsno:'',
    goodstext:'',
    list:null,
    num:1,
    hiidenNone:''
  },
  goods(e) {
    this.setData({
      goodsno: e.detail.value,
      goodstext: ''
    })
  },
  inquire() {
    if (this.data.goodsno == '') {
      wx.showToast({
        title: '请输入产品编号',
        icon: 'none'
      })
      return
    }
    this.goodslist()
  },
  sweep() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        that.uploadings(tempFilePaths)
      }
    })
  },
  uploadings(img) {
    var that = this
    wx.uploadFile({
      url: hostimg1,
      filePath: img,
      name: 'file',
      formData: {
        type: 4,
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var cad = JSON.parse(res.data)
        console.log(cad)
        if (cad.status == 1) {
          var cade = JSON.parse(cad.data)
          console.log(cade)
          var text = ''
          cade.forEach((i) => {
            text += i.words + ';'
          })
          setTimeout(() => {
            wx.showToast({
              title: '成功',
            })
          }, 400)
          that.sweepgoods(text)
        } else if (cad.status == 6) {

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
      }
    })
  },
  sweepgoods(text) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getGoodsStockByNameUrl,
        param: {
          mechanismId: app.globalData.kmUserInfo.mechanismId,
          name:text
        }
      },
      success: (res) => {
        if (res.data.status == 1 && res.data.data != '') {
          var list = JSON.parse(res.data.data)
          that.setData({
            list: list,
          })
        } else if (res.data.status == 6) {
          that.setData({
            list: null
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiidenNone: ''
          })
        } else {
          that.setData({
            hiidenNone: true
          })
        }
      }
    })
  },   
  goodslist() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getGoodsAndStockByGoodsNoUrl,
        param: {
          goodsNo: that.data.goodsno,
          mechanismId: app.globalData.kmUserInfo.mechanismId
        }
      },
      success: (res) => {
        if (res.data.status == 1 && res.data.data != '') {
          var list = JSON.parse(res.data.data)
          that.setData({
            list: list,
          })
        } else if (res.data.status == 6) {
          that.setData({
            list: null
          })
        }
        if (that.data.list == null || that.data.list.length == 0) {
          that.setData({
            hiidenNone: ''
          })
        } else {
          that.setData({
            hiidenNone: true
          })
        }
      }
    })
  },
  come(e){
    var that = this
    var model = this.data.list[e.currentTarget.dataset.index]
    console.log(model)
    if (that.data.num > model.sum){
      wx.showToast({
        title: '所选商品数量，超出库存数',
        icon: 'none'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '是否出库' + model.goodsNo + '?',
        confirmColor: '#1296db',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
              that.goodscome(model.goodsId, model.id)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  plus(){
    var num = this.data.num + 1
    this.setData({
      num:num
    })
  },
  subtract(){
   var num = this.data.num - 1 
   if(num > 1){
     this.setData({
       num:num
     })
   }else{
     this.setData({
       num: 1
     })
   }
  },
  goodscome(goodsid,staffid){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: outStockByGoodsIdUrl,
        param:{
          goodsId: goodsid,
              num:that.data.num,
          mechanismId: app.globalData.kmUserInfo.mechanismId,
          staffId: staffid,
        }
      },
      success:(res)=>{
       console.log(res)
       if(res.data.status == 1){
         if (that.data.goodstext != ''){
           that.sweepgoods()
         }else{
           that.goodslist()
         }
         setTimeout(()=>{
           wx.showToast({
             title: '出库成功',
             icon:'none'
           })
         },200)
       }
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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