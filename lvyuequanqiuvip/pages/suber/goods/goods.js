 // pages/suber/goods/goods.js
const config=require('../../../config.js')
const getGoodsInfoByGoodsIdUrl = config.getGoodsInfoByGoodsIdUrl
const getGoodsAttrConfigsUrl = config.getGoodsAttrConfigsUrl
const getStockByGoodsIdAndAttrIdUrl = config.getStockByGoodsIdAndAttrIdUrl
var app=getApp()
console.log(app)
var util=require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,//是否显示
    shops:null,
    imgs:null,
    shoplist:null,
    goodsdard:[],
    // newGoodsDesc:null,
    shposcolor:null,
    shopsize:null,
    colorid:'',
    sizeid:'',
    standard:'',
    repertory:null,
    active:false,
    num:1,
    id:'',
    // coupon:'',
    State:'',
    // states:'',
    userType:'',
    Standby:'',
    chit:'',
    goodscolor:'',
    shopsize:''
  },
  commodity: function (id) {
    var that = this
    util.kmRequest({
      url: getGoodsInfoByGoodsIdUrl,
      data: {
        goodsId:id,
        goodsSource: 'sc',
        source: wx
      },
      success: function (res) {
        if (res.data.status == 1) {
          var goods = JSON.parse(res.data.data)[0]
          console.log(goods)
          var imgs=[]
          var img=goods.img
          var imgs=img.split(',')
          if (app.globalData.kmUserInfo.isVip == 0) {
            var price = goods.fansPrice
          } else if (app.globalData.kmUserInfo.isVip > 0) {
            var price = goods.memberPrice
          }
          that.setData({
            shops: goods,
            imgs: imgs,
            price: price,
            img: imgs[0]
          })
        }
      }
    })
  },
  models: function (id) {
    var that = this
    util.kmRequest({
      url: getGoodsAttrConfigsUrl,
      data: {
        goodsId: id,
      },
      success: function (res) {
        if (res.data.status == 1) {
          var shoplist = JSON.parse(res.data.data)
          that.setData({
            shoplist: shoplist,
          })
        }
      }
    })
  },

  // 商品颜色
  goodcolor: function (e) {
    var that = this
    var shoplist = that.data.shoplist
    console.log(shoplist)
    var goodsdard = that.data.goodsdard
    for (var i = 0; i < shoplist.length; i++) {
      for (var j = 0; j < shoplist[i].specList.length; j++) {
        if (shoplist[i].title == e.currentTarget.dataset.title) {
          shoplist[i].specList[j].checked = false
          var standard = shoplist[i].specList[e.currentTarget.dataset.index]
          standard.checked = true
          goodsdard.push(standard)
        }
      }
    }
    var goods = []
    var index = []
    for (var i = 0; i < goodsdard.length; i++) {
      for (var j = i + 1; j < goodsdard.length; j++) {
        if (goodsdard[i].attrId == goodsdard[j].attrId || goodsdard[i].attrName == goodsdard[j].attrName) {
          i++;
          j = i
        }
      }
      goods.push(goodsdard[i])
      index.push(i)
    }
    that.setData({
      shoplist: shoplist,
      goodsdard: goods
    })
    if (shoplist.length == goods.length) {
      that.shopstandard()
    }
  },
  //  拼接规格id
  shopstandard: function () {
    var that = this
    var standard = ''
    var goodsdard = that.data.goodsdard
    for (var i = 0; i < goodsdard.length; i++) {
      standard += goodsdard[i].attrId + ','
    }
    that.setData({
      standard: standard
    })
    that.repertory()
  },
  
  click:function(){
    this.showModal()
    // this.shopstandard()
    // this.reasonable()
  },
  serve:function(){
    this.showModal()
    // this.shopstandard()
    // this.reasonable()
  },
  business(){
   wx.navigateTo({
     url: '/pages/suber/business/business?img='
       + this.data.shops[0].supplierImg,
   })
  },
  // 判断库存
  repertory: function () {
    var that = this
    util.kmRequest({
      url: getStockByGoodsIdAndAttrIdUrl,
      data: {
        goodsId: that.data.id,
        attrId: that.data.standard,
        goodsSource: 'sc',
      },
      success: function (res) {
        if (res.data.status == 1) {
          var repertory = JSON.parse(res.data.data)[0]
          console.log(repertory)
          var shoplist = that.data.shoplist
          var goodsdard = that.data.goodsdard
          if (app.globalData.kmUserInfo.isVip == 0) {
            var price = repertory.fansPrice
          } else if (app.globalData.kmUserInfo.isVip > 0) {
            var price = repertory.memberPrice
          }
          if (repertory.stockNum <= 0) {
            for (var i = 0; i < shoplist.length; i++) {
              shoplist[i].specList = false
            }
            that.setData({
              shoplist: shoplist,
              goodsdard: []
            })
            wx.showToast({
              title: '库存不足',
              icon: 'none'
            })
          } else {
            that.setData({
              repertory: repertory,
            })
          }
          that.setData({
            price: price,
            img: repertory.img
          })
        }
      }
    })
  },
  purchase: function () {
    var that = this
    var data = {
      goodsName: that.data.shops.goodsName,
      goodsdetails: that.data.repertory,
      goodsdard: that.data.goodsdard,
      goodsid: that.data.shops.id,
      num: that.data.num,
      price: that.data.price,
      supplier: that.data.shops.supplier
    }
    if (that.data.goodsdard.length != that.data.shoplist.length) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
    } else if (that.data.goodsdard.length == that.data.shoplist.length) {
      wx.navigateTo({
        url: '/pages/suber/place/place?data=' + JSON.stringify(data)
      })
    }
  },
  close:function(){
    this.hideModal()
  },
    //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },

  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
    this.models()
  },
  add: function () {
    if (this.data.goodsdard.length != this.data.shoplist.length) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
      return
    }
    var num = this.data.num;
    var numbe = num + 1
    this.setData({
      num: numbe,
    })
  },
  subtract: function () {
    if (this.data.goodsdard.length != this.data.shoplist.length) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
      return
    }
    var num = this.data.num;
    var numbe = num - 1
    if (num <= 1) {
      var numbe = 1
    } else {
    }
    this.setData({
      num: numbe,
    })
  },
  imges:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls: this.data.imgs,
    })
  },
  reasonable:function(){
    var fansPrice = this.data.shops[0].fansPrice
    var img=this.data.imgs[0]
    var data = ({fansPrice, img})
    console.log(data)
    this.setData({
      repertory: data 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    this.setData({
      id:id
    })
    this.commodity(id)
    this.models(id)
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