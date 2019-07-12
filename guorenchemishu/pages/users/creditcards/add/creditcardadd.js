const config = require('../../../../config')
const util = require('../../../../utils/util')
const upng = require('../../../../utils/upng.js')
const hostimg1 = config.hostimg1
const getBankNameUrl = config.getBankNameUrl
const getProvicesUrl = config.getProvicesUrl
const saveBankInfoUrl = config.saveBankInfoUrl
const getCitiesUrl = config.getCitiesUrl
const getBankByGenreAndAreaLevelUrl = config.getBankByGenreAndAreaLevelUrl
var app = getApp()
Page({
  data: {
    img:'',
    width:'',
    heigth:'',
    city: null,
    citys: null,
    selec:'所在地区',
    cityCode:'',
    genre:'',
    opening:null,
    bankName:'请选择开户行名称',
    active:true,
    card:'',
    bankNameid:'',
    cardno:'',
  },
  sweep(){
    var that = this
    this.setData({
      type: 3,
    })
    wx.navigateTo({
      url: '/pages/identity/identity',
    })
  },
  uploadheadImg(img) {
    var that = this
    wx.uploadFile({
      url: hostimg1,
      filePath: img,
      name: 'file',
      formData: {
        type: 1,
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var img = JSON.parse(res.data)
        if (img.status == 1) {
          wx.showToast({
            title: '识别成功',
          })
          that.setData({
            card: (img.data).replace(/\s*/g, "")
          })
        } else if (img.status == 6) {
          wx.showToast({
            title: '识别失败',
            icon: 'none',
          })
          that.setData({
            card: ''
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          that.setData({
            card: ''
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
  card(e){
    var that = this
    var card = e.detail.value
    that.setData({
      card: card
    })
  },
  opening(){
   var that = this
    if (this.data.card.length == 0) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: "none"
      })
      return
    }
    if (that.data.selec == '所在地区'){
      wx.showToast({
        title: '请选择银行卡所在地',
        icon: "none"
      })
      return
    }
   util.kmRequest({
     data:{
       interfaceName: getBankByGenreAndAreaLevelUrl,
       param:{
         genre: that.data.genre,
         areaLevel: that.data.cityCode
       }
     },
     success:function(res){
       console.log(res.data)
       if(res.data.status == 1){
         var opening = JSON.parse(res.data.data)
         console.log(opening)
         that.setData({
           opening: opening
         })
         that.showModals()
       }else{
         wx.showToast({
           title: res.data.msg,
           icon: "none"
         })
       }
     }
   })
  },
  saveBankRequest:function(e){
    var that = this;
    var err = '';
  if(e.detail.value.username.length == 0) {
  err = '请输入持卡人姓名';
}else if (e.detail.value.cardno.length == 0){
      err = '请输入银行卡号';
}  else if  (that.data.bankName == '请选择开户行名称'){
    err = '请选择开户行名称';
} 
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }
    util.kmRequest({
      data: {
        interfaceName: saveBankInfoUrl,
        param:{
          bankNo: e.detail.value.cardno,
          userName: e.detail.value.username,
          bankName: that.data.bankName,
          bankNameId: that.data.bankNameid
        }
      },
      method:"post",
      success: function (res) {
        if(res.data.status == 1){
          wx.navigateBack({
            delta: 1
          })
          setTimeout(function () {
            wx.showToast({
              title: '添加成功',
              icon: 'none'
            })
          }, 500) 
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  resgiter: function () {
    var that = this
    if (that.data.card.length == 0) {
      wx.showToast({
        title: '请输入银行卡号',
        icon: "none"
      })
      return
    }
    util.kmRequest({
      data: {
        interfaceName: getBankNameUrl,
        param: {
          bankNo: that.data.card
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          that.setData({
            genre: list.genre,
            bankNameid: list.bankNameid
          })
          that.showModal()
          that.dataRequest()
          that.setData({
            citylse: true,
            cityls: false,
            cityl: false,
          })
        }
      }
    })
   
  },
  dataRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getProvicesUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            city: JSON.parse(res.data.data),
          });
        }
      },
    })
  },
  Request: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getCitiesUrl,
        param:{
          proviceCode: this.data.tItem
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            citys: JSON.parse(res.data.data)
          });
        }
      },
    })
  },
  selectOver1: function (event) {
    var selectItem = this.data.city[event.currentTarget.dataset.index];
    console.log(selectItem)
    var selec = selectItem.regionName;
    console.log(selec)
    var tItem = selectItem.areaLevel;
    console.log(tItem)
    var citylse = this.data.citylse
    this.setData({
      selec: selec,
      tItem: tItem,
      citylse: false,
      cityls: true,
    })
    this.Request()
  },
  selectOver2: function (event) {
    var selectItems = this.data.citys[event.currentTarget.dataset.index];
    console.log(selectItems)
    var cityName = selectItems.regionName;
    console.log(cityName)
    var cityCode = selectItems.areaLevel;
    console.log(cityCode)
    var selecs = this.data.selec
    var selecd = selecs + cityName
    this.setData({
      selec: selecd,
      cityName: cityName,
      cityCode: cityCode,
      citylse: false,
      cityls: false,
    })
    this.hideModal()
  },
  selectOver3:function(e){
    console.log(e)
     this.setData({
       bankName: e.currentTarget.dataset.openingbank,
     })
    this.hideModals()
  },
  selectOver4(){
    this.hideModals()
    this.setData({
      bankName: '请选择开户行名称',
    })
  },
  hide(){
    this.hideModals()
    this.setData({
      active:false
    })
  },
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
  },
  showModals: function () {
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
      showModal: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModals: function () {
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
        showModal: false
      })
    }.bind(this), 150)
  },
  onLoad: function (options) {
   
  },
  onShow(){
    var that = this
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];
    if (prevPage.data.img != ''){
      that.uploadheadImg(prevPage.data.img)
    }
  },
  selectOver: function (event) {
    var selectItem = this.data.list[event.currentTarget.dataset.index];
    getApp().globalData.fctInfo = selectItem;
    wx.navigateTo({
      url: '/pages/cars/carsselect/br/list?fctid=' + selectItem.id
    });
  },
  register: function () {
    wx.redirectTo({//关闭当前页跳转
      url: '/pages/users/register/register'
    });
  }
})

