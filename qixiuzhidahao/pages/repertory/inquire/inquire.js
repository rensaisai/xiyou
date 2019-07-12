const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const upng = require('../../../utils/upng.js')
const getGoodsAndStockByGoodsNoUrl = config.getGoodsAndStockByGoodsNoUrl
const getBrInfoUrl = config.getBrInfoUrl
const getFctInfoUrl = config.getFctInfoUrl
const getCcInfoByFctIdUrl = config.getCcInfoByFctIdUrl
const getYearInfoByCcIdUrl = config.getYearInfoByCcIdUrl
const getCarSplByCcAndYearAndFctIdUrl = config.getCarSplByCcAndYearAndFctIdUrl
const getGoodsAndStockByCarSplUrl = config.getGoodsAndStockByCarSplUrl
const getGoodsStockByNameUrl = config.getGoodsStockByNameUrl
const hostimg1 = config.hostimg1
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fctid:'',
    ccid:'',
    list:null,
    goodslist:null,
    br:null,
    fct:null,
    yuecar:null,
    vehicle:null,
    hiidenNone:'',
    hiidenNone1:'',
    hiidenNone2:true,
    hiidenNone3:true,
    hiidenNone4: true,
    hiidenNone5:true,
    hiidenNone6:true,
    hiidenNone7:true,
    currentData:0,
    goodsno:'',
  },
  goods(e){
    this.setData({
      goodsno:e.detail.value
    })
  },
  inquire(){
    if (this.data.goodsno == ''){
      wx.showToast({
        title: '请输入产品编号',
        icon:'none'
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
          cade.forEach((i)=>{
            text += i.words + ';'
          })
          setTimeout(()=>{
            wx.showToast({
              title: '成功',
            })
          },400)
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
  sweepgoods(text){
     var that = this
     util.kmRequest({
       data:{
         interfaceName: getGoodsStockByNameUrl,
         param: {
           mechanismId: app.globalData.kmUserInfo.mechanismId,
           name: text
         }
       },
       success:(res)=>{
         if (res.data.status == 1 && res.data.data != '') {
           var list = JSON.parse(res.data.data)
           that.setData({
             list: list,
           })
         } else if(res.data.status == 6) {
           that.setData({
             list:null
           })
         }
         if(that.data.list == null || that.data.list.length == 0){
           that.setData({
             hiidenNone:''
           })
         }else{
           that.setData({
             hiidenNone:true
           })
         }
       }
     })
  },   
  goodslist(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getGoodsAndStockByGoodsNoUrl,
        param:{
          goodsNo:that.data.goodsno,
          mechanismId: app.globalData.kmUserInfo.mechanismId
        }
      },
      success:(res)=>{
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
  plate(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getBrInfoUrl,
        param:{}
      },
      success:(res)=>{
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          var left = that.data.letter
          var letter = new Array();
          var fctList = new Array();
          var currentLetter = '';
          var currentData;
          for (var i = 0; i < list.length; i++) {
            if (currentLetter != list[i].azSort) {
              currentLetter = list[i].azSort;
              letter.push(currentLetter);
              currentData = new Array();
              currentData.push(list[i]);
              fctList.push({ letter: currentLetter, data: currentData });
            } else {
              currentData.push(list[i]);
            }
          }
          that.setData({
            fctList: fctList,
            lists: list,
            letter: letter,
          });
        }
      }
    })
  },
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
  },
  selectOver: function (event) {
    var that = this
    var fcts = this.data.fctList
    for (var i = 0; i < fcts.length; i++) {
      for (var j = 0; j < fcts[i].data.length; j++) {
        if (fcts[i].data[j].id == event.currentTarget.dataset.id) {
          var fct = fcts[i].data[j]
          console.log(fct)
          that.setData({
            hiidenNone1:true,
            hiidenNone2:''
          })
          that.dataRequest(fct.id)
        }
      }
    }
  },
  dataRequest: function (id) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getFctInfoUrl,
        param: {
          brId: id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          that.setData({
            br: JSON.parse(res.data.data)
          });
        }
      }
    })
  },
  selectOver1: function (event) {
    var that = this
    var list = that.data.br
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].carFcts.length; j++) {
        if (list[i].carFcts[j].id == event.currentTarget.dataset.id) {
          var br = list[i].carFcts[j]
          that.setData({
            hiidenNone1: true,
            hiidenNone2: true,
            hiidenNone3: '',
          })
          that.dataRequest1(br.id)
        }
      }
    }
    console.log(br)
  },
  dataRequest1: function (id) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getCcInfoByFctIdUrl,
        param: {
          fctId:id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          that.setData({
            fct: JSON.parse(res.data.data),
            fctid:id
          });
        }
      }
    })
  },
  selectOver2: function (event) {
    var that = this
    var displacement = this.data.fct[event.currentTarget.dataset.index]
    console.log(displacement)
    that.setData({
      hiidenNone1: true,
      hiidenNone2: true,
      hiidenNone3: true,
      hiidenNone4: '',
    })
    that.dataRequest2(displacement.id)
  },
  dataRequest2: function (id) {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getYearInfoByCcIdUrl,
        param: {
          ccId: id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          console.log(JSON.parse(res.data.data))
          that.setData({
            yuecar: JSON.parse(res.data.data),
            ccid:id
          });
        }
      }
    })
  },
  selectOver3: function (event) {
    var that = this
    var year = that.data.yuecar[event.currentTarget.dataset.index]
    that.setData({
      hiidenNone1: true,
      hiidenNone2: true,
      hiidenNone3: true,
      hiidenNone4: true,
      hiidenNone5: '',
    })
    that.vehicle(year.id)
  },
  vehicle(id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarSplByCcAndYearAndFctIdUrl,
        param: {
          fctId: that.data.fctid,
          ccId: that.data.ccid,
          yearId: id,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          console.log(list)
          that.setData({
            vehicle: list
          })
        }
      },
    })
  },
  selectOver4(e){
    var that = this
    var basis = that.data.vehicle[e.currentTarget.dataset.index]
    that.setData({
      hiidenNone1: true,
      hiidenNone2: true,
      hiidenNone3: true,
      hiidenNone4: true,
      hiidenNone5: true,
      hiidenNone6: '',
    })
    that.cargoodslist(basis.id)
  },
  cargoodslist(id){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getGoodsAndStockByCarSplUrl,
        param:{
          splId:id,
          mechanismId: app.globalData.kmUserInfo.mechanismId
        }
      },
      success:(res)=>{
        if(res.data.status == 1){
           var goodslist = JSON.parse(res.data.data)
           that.setData({
             goodslist: goodslist
           })
        }else if(res.data.status == 6){

        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
        if (that.data.goodslist == null || that.data.goodslist.length == 0){
          that.setData({
            hiidenNone7:''
          })
        }else{
          that.setData({
            hiidenNone7:true
          })
        }
      }
    })
  },
  goodsdetail(e){
    var list = this.data.list[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/repertory/details/details?list='+ JSON.stringify(list),
    })
  },
  goodsdetail1(e){
    var list = this.data.goodslist[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/repertory/details/details?list=' + JSON.stringify(list),
    })
  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    if (current ==1){
      this.plate()
    }
    this.setData({
      currentData: current,
      hiidenNone1: '',
      hiidenNone2:true,
      hiidenNone3: true,
      hiidenNone4:true,
      hiidenNone5: true,
      hiidenNone6: true,
    })
  },
  eventchange: function (e) {
    var current = e.detail.current
    if (current == 1) {
      this.plate()
    }
    this.setData({
      currentData: current,
      hiidenNone1: '',
      hiidenNone2: true,
      hiidenNone3: true,
      hiidenNone4: true,
      hiidenNone5: true,
      hiidenNone6: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 50;
      }
    })
    this.setData({
      windowHeight: windowHeight
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