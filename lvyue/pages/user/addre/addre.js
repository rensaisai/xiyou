// pages/addre/addre.js
const config = require('../../../config.js')
const addUserMailingAddressUrl = config.addUserMailingAddressUrl
const modifyUserMailingAddressUrl = config.modifyUserMailingAddressUrl
const getProvicesUrl = config.getProvicesUrl
const getCitiesUrl = config.getCitiesUrl
const getCountiesUrl = config.getCountiesUrl
const util=require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,//是否显示
    city:null,
    citys:null,
    citysel: null,
    cityName: null,
    cityCode: null,
    defaul: [
      { value: '设置默认地址'}
      ],
    address:1,
    selec: '所在地区',
    datadelts:null,
    tItem: '',
    name:'',
    phone:'',
    site:'',
    checked:false,
    datadel:null,
    citylse: true,
    cityls: false,
    cityl: false,
    sendType:null,
    goodscolor: '',
    goodssize: ''
  },
  radioChange:function(){
    if (this.data.checked == false){
      this.setData({
        checked: true
      })
    }else{
      this.setData({
        checked: false
      })
    }
  },
  resgiter:function(){
    this.showModal()
    this.dataRequest()
    this.setData({
      citylse: true,
      cityls: false,
      cityl: false,
    })
  },
  dataRequest: function () {
    var that = this;
    util.kmRequest({
      url: getProvicesUrl,
      data: {
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            city: JSON.parse(res.data.data),
          });
        }
      }
    })
  },
  request: function () {
    var that = this;
    util.kmRequest({
      url: getCitiesUrl,
      data: {
        proviceCode: this.data.tItem
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
  county: function () {
    var that = this
    util.kmRequest({
      url: getCountiesUrl,
      data: {
        cityCode: that.data.cityCode
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            citysel: JSON.parse(res.data.data)
          })
        }
      }
    })
  },
  selectOver: function (event) {
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
      cityl: false
    })
    this.request()
  },
  selectOverss: function (event) {
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
      cityl: true,
    })
    this.county()
    },
  selectOvercity: function (event) {
    var selectItems = this.data.citysel[event.currentTarget.dataset.index];
    console.log(selectItems)
    var cityName = selectItems.regionName;
    console.log(cityName)
    var cityCode = selectItems.areaLevel;
    console.log(cityCode)
    var selecs = this.data.selec
    var selecd = selecs + cityName
    this.hideModal()
    this.setData({
      selec: selecd,
      cityName: cityName,
      cityCode: cityCode,
      citylse: false,
      cityls: false,
      cityl: false,
    })
  },
  formSubmit(e){
   console.log(e)
   var that = this
   var err = '';
   var isDefault = '';
   var list = '所在地区'
  if (e.detail.value.name.length == 0){
      err = '请输入收货人姓名';
    } else if (e.detail.value.phone.length == 0){
      err = '请输入手机号';
  } else if (!util.checkPhone(e.detail.value.phone)){
      err = '手机号格式错误';
    } else if (that.data.selec == list){
    err = '请选择省市区';
  } else if (e.detail.value.site.length == 0){
    err = '请输入详细地址';
  }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    if (that.data.checked == false) {
      isDefault = 0
    } else {
      isDefault = 1
    }
    if (that.data.datadelts == null){
      util.kmRequest({
        url: addUserMailingAddressUrl,
        data: {
          receiver: e.detail.value.name,
          userId: app.globalData.kmUserInfo.id,
          phone: e.detail.value.phone,
          regionCode: that.data.cityCode,
          detailAddress: e.detail.value.site,
          isDefault: isDefault,
        },
        method: 'post',
        success: function (res) {
          console.log(res.data)
          if (res.data.status == 1) {
            wx.showToast({
              title: "添加成功",
              icon: "none"
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
    }else{
      util.kmRequest({
        url: modifyUserMailingAddressUrl,
        data:{
          id: that.data.datadelts.id,
          receiver: e.detail.value.name,
          userId: app.globalData.kmUserInfo.id,
          phone: e.detail.value.phone,
          regionCode: that.data.cityCode,
          detailAddress: e.detail.value.site,
          isDefault: isDefault,
        },
        method: 'post',
        success:function(res){
          console.log(res.data)
          if(res.data.status == 1){
            wx.showToast({
              title: "修改成功",
              icon: "none"
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
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
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.datalet != undefined){
    var datadelts = JSON.parse(options.datalet)
      console.log(datadelts)
      if (datadelts.isDefault == 1){
      var checked = true
      }else{
      var checked = false
      }
    this.setData({
      datadelts: datadelts,
      name: datadelts.receiver,
      phone: datadelts.phone,
      selec: datadelts.addres,
      site: datadelts.detailAddress,
      cityCode: datadelts.regionCode,
      checked: checked
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