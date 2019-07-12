const config = require('../../../config')
const getRepairInfoUrl = config.getRepairInfoUrl
const getSetmealsUrl = config.getSetmealsUrl
const getCommentsUrl = config.getCommentsUrl
const getGoodsInfoByGoodsIdUrl = config.getGoodsInfoByGoodsIdUrl
const getGoodsAttrConfigsUrl = config.getGoodsAttrConfigsUrl
const findStockUrl = config.findStockUrl
const getConfigByIdUrl = config.getConfigByIdUrl
const getAllVipZGGoods = config.getAllVipZGGoods
const getStockByGoodsIdAndAttrIdUrl = config.getStockByGoodsIdAndAttrIdUrl
var app = getApp()
console.log(app)
console.log(app.globalData.tenantId)
var util = require('../../../utils/util')

Page({
  data: {
    entity: [],
    imgs:{},
    cont:{},
    parameter:[],
    size:[],
    clore:[],
    list: [
    ],
    listl:{},
    // id:'',
    // idl:'',
    // sid:'',
    // sizemarking:'长:30cm,宽:12cm,高:43cm',
    // clor:'',
    acti:true,
    goodsAttrId: '',
    commentsList: [
    ],
    // listm:listm,
    orderType:1,// 0 - 距离优先，1-评价优先
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    isHideLoadMore: true, //"上拉加载"的变量，默认true，隐藏
    selected: true,
    selected1: false,
    selectSetmeal: null,
    notBuy: false,
    shposcolor: null,
    colorid: null,
    shopsize: '',
    sizeid: '',
    standard:'',
    repertory:null,
    id:''
  },
  
  repairsRequest: function () {
    var that = this;
    util.kmRequest({
      url: getGoodsInfoByGoodsIdUrl,
      data: {
        goodsSource:'zg',
        source:wx,
        goodsId: that.data.id
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 1) {
          var entity = JSON.parse(res.data.data)[0];
          console.log(entity);
          var imgs = entity.img.split(",");
          entity.imgs = imgs;
          // var count = entity.attrArr.length;
          // console.log(count)
          // var setmeal = null;
          // console.log(entity)
          // for (var j = 0; j < count; j++) {
          //   entity.attrArr[j]=
          //   {
          //     'attr': entity.attrArr[j],
          //     'id': entity.goodsAttrList[j].id,
          //     'price': entity.goodsAttrList[j].goodsAttrPrice
          //   };
          // }
          // for (var j = 0; j < count; j++) {
          //   entity.attrArr[j].checked = true;
          //   setmeal = entity.attrArr[j];
          //   break;
          // }
          that.setData({
            entity: entity,
            // selectSetmeal: setmeal
          });
        }
      }
    })
  },
 

  accesstogoods:function(){
    var that = this
    util.kmRequest({
      url: getGoodsAttrConfigsUrl,
      data: {
        goodsId: that.data.id,
        source: wx
      },
      success: function (res) {
        if (res.data.status == 1) {
          var shposcolor = ''
          var shopsize = ''
          var colorid = ''
          var sizeid = ''
          var shoplist = JSON.parse(res.data.data)
          console.log(shoplist)
          shposcolor = shoplist[0]
          console.log(shposcolor)
          shopsize = shoplist[1]
          console.log(shopsize)
          if (shposcolor != undefined && shopsize != undefined) {
              shposcolor.specList[0].checked = true;
              colorid = shposcolor.specList[0].attrId
              console.log(colorid)
            shopsize.specList[0].checked = false;
          }
          if (shposcolor != undefined && shopsize == undefined) {
            shposcolor.specList[0].checked = false;
          }
          that.setData({
            shposcolor: shposcolor,
            colorid: colorid,
            shopsize: shopsize,
            sizeid: sizeid
          })
        }
      }
    })
  },
  // 商品颜色
  goodcolor: function (e) {
    var that = this
    console.log(e)
    var colorid = e.currentTarget.dataset.id;
    var value = e.currentTarget.dataset.value;
    console.log(value, colorid)
    var shposcolor = that.data.shposcolor
    console.log(shposcolor)
    for (var i = 0; i < shposcolor.specList.length; i++) {
      if (shposcolor.specList[i].attrId == colorid) {
        shposcolor.specList[i].checked = true
      } else {
        shposcolor.specList[i].checked = false
      }
    }
    this.setData({
      shposcolor: shposcolor,
      colorid: colorid
    })
    this.shopstandard()
    this.repertory()
    // this.itemcolor()
  },
  // 商品大小
  size: function (e) {
    var that = this;
    var sizeid = e.currentTarget.dataset.id;
    var sizename = e.currentTarget.dataset.value;
    console.log(sizeid, sizename)
    var shopsize = that.data.shopsize;
    for (var i = 0; i < shopsize.specList.length; i++) {
      if (shopsize.specList[i].attrId == sizeid) {
        shopsize.specList[i].checked = true
      } else {
        shopsize.specList[i].checked = false
      }
    }
    that.setData({
      shopsize: shopsize,
      sizeid: sizeid
    })
    this.shopstandard()
    this.repertory()
    //  this.itemcolor()
  },
  //  拼接规格id
  shopstandard: function () {
    var colorid = this.data.colorid
    console.log(colorid)
    var sizeid = this.data.sizeid
    console.log(sizeid)
    var standard = null
    if (colorid != '' && sizeid != '') {
      standard = colorid + ',' + sizeid
    }
    if (colorid != '' && sizeid == '') {
      standard = colorid
    }
    if (colorid == '' && sizeid != '') {
      standard = sizeid
    }
    console.log(standard)
    this.setData({
      standard: standard
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
        source: wx
      },
      success: function (res) {
        if (res.data.status == 1) {
          var repertory = JSON.parse(res.data.data)[0]
          console.log(repertory)
          // var entity = that.data.entity
          // entity.memberPrice = repertory.memberPrice
          // console.log(entity)
          if (repertory.stockNum <= 0) {
            var shposcolor = that.data.shposcolor
            var shopsize = that.data.shopsize
            var colorid = that.data.colorid
            var sizeid = that.data.sizeid
            var active = that.data.active
            for (var i = 0; i < shposcolor.specList.length; i++) {
              if (shposcolor.specList[i].attrId == colorid) {
                shposcolor.specList[i].checked = false
              }
            }
            for (var i = 0; i < shopsize.specList.length; i++) {
              if (shopsize.specList[i].attrId == sizeid) {
                shopsize.specList[i].checked = false
              }
            }
            that.setData({
              shposcolor: shposcolor,
              shopsize: shopsize
            })
            console.log(shposcolor)
            wx.showToast({
              title: "库存不足",
              icon: "none"
            })
          } else {
          }
          that.setData({
            repertory: repertory,
          })
        }
      }
    })
  },
 
  setmealsRequest: function (goodsId) {
    var that = this;
    util.kmRequest({
      url: getSetmealsUrl,
      data: {
        yearId: app.globalData.carInfo.yearId,
        userId: app.globalData.kmUserInfo.id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data);
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.chose == 1) {
              item.checked = true;
              that.setData({
                selectSetmeal: item
              });
              break;
            } else {
              item.checked = false;
            }
          }
          that.setData({
            list: list
          });
        }
      }
    })
  },
  placeanorder:function(e){
    if (this.data.repertory != null){
    var repertory = this.data.repertory.skuId
      this.setData({
        selectSetmeal: repertory,
      })
      console.log(this.data.selectSetmeal)
    }
  },
  onLoad: function (options) {
    var id=options.goodsId
    console.log(id)
    this.setData({
      id:id
    })
    this.repairsRequest();
    this.accesstogoods();
  },
  onShow:function(){
    
  },
  selected: function (e) {
    this.setData({
      selected: true,
      selected1: false,
      selected2: false
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
  },
  selected2: function (e) {
    this.setData({
      selected: false,
      selected1: false,
      selected2: true
    })
  },
  mapShow: function () {
    wx.navigateTo({
      url: '/pages/maps/map/map?lon=' + this.data.entity.lon + '&lat=' + this.data.entity.lat
    });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: "4008972221",// this.data.entity.phone,
      success: function () {
        util.kmConsoleLog("成功拨打电话")
      }
    })
  },
  checkOrder:function(){
    this.placeanorder()
    var repertory = this.data.repertory
    var colorid = this.data.colorid
    console.log(colorid)
    var sizeid = this.data.sizeid
    console.log(sizeid)
    console.log(repertory)
    if (this.data.shposcolor != null && this.data.shopsize != null) {
    if ((repertory == null) && (colorid != '' && sizeid == '')){
        wx.showToast({
          title: "请选择规格",
          icon: "none"
        })
    } else if ((repertory != null && repertory.stockNum == 0) && (colorid != '' && sizeid != '')){
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
    } else if ((repertory != null && repertory.stockNum > 0) && (colorid != '' && sizeid == '')) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
      }else if ((repertory != null && repertory.stockNum > 0) && (colorid != '' && sizeid != '')){
      wx.navigateTo({
        url: '/pages/orders/my/check/ordercheck?entity=' + JSON.stringify(this.data.entity) + '&setmeal=' + JSON.stringify(this.data.selectSetmeal)
      });
    }
    }
    if (this.data.shposcolor != null && this.data.shopsize == undefined) {
      if (repertory == null && colorid == ''){
        wx.showToast({
          title: "请选择规格",
          icon: "none"
        })
      } else if ((repertory != null && repertory.stockNum == 0) && (colorid !='')){
        wx.showToast({
          title: "请选择规格",
          icon: "none"
        })
      } else if ((repertory != null && repertory.stockNum > 0) && (colorid != '')){
        wx.navigateTo({
          url: '/pages/orders/my/check/ordercheck?entity=' + JSON.stringify(this.data.entity) + '&setmeal=' + JSON.stringify(this.data.selectSetmeal)
        });
      }
    }
  },
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.entity.imgs
    })
  },
})

