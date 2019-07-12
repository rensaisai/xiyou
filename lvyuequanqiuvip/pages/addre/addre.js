// pages/addre/addre.js
const config = require('../../config.js')
const addUserMailingAddressUrl = config.addUserMailingAddressUrl
const modifyUserMailingAddressUrl = config.modifyUserMailingAddressUrl
const getProvicesUrl = config.getProvicesUrl
const getCitiesUrl = config.getCitiesUrl
const getCountiesUrl = config.getCountiesUrl
const util=require('../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // region:['所在地区'],
    showModalStatus: false,//是否显示
    city:null,
    citys:null,
    citysel: null,
    cityName: null,
    cityCode: null,
    defaul: [
      { value: '设置默认地址'}
      ],
    // resgiters:'所在地区',
    address:1,
    selec: '所在地区',
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
  name:function(event){
    console.log(event)
   this.setData({
     name:event.detail.value
   })
  },
  phone:function(event){
    console.log(event)
    this.setData({
      phone: event.detail.value
    })
  },
  site:function(event){
    console.log(event)
    this.setData({
      site: event.detail.value
    })
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
      },
    })
  },
  Request: function () {
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
    this.Request()
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
  commitOrder:function(){
    var that = this;
    var datadel = that.data.datadel
    console.log(datadel)
    var list = '所在地区'
    console.log(list)
    var err = '';
    if (that.data.name.length == 0) {
      err = '请输入收货人姓名';
    } else if (that.data.phone.length == 0) {
      err = '请输入手机号';
    } else if (!util.checkPhone(that.data.phone)) {
      err = '手机号格式错误';
    } else if (that.data.selec == list) {
      err = '请选择省市区';
    } else if (that.data.site.length == 0) {
      err = '请输入详细地址';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    var detailAddress = that.data.site
    console.log(detailAddress)
    if (datadel != null){
      var id = datadel.id
      console.log(id)
    }
    var isDefault=''
    if (that.data.checked == false) {
      isDefault=0
    } else {
      isDefault=1
    }
    console.log(isDefault)
    if (datadel == null){
    util.kmRequest({
      url: addUserMailingAddressUrl,
      data:{
        receiver: that.data.name,
        userId: app.globalData.kmUserInfo.id,
        phone: that.data.phone,
        regionCode: that.data.cityCode,
        // region: that.data.cityName,
        detailAddress: detailAddress,
        isDefault: isDefault,
        source:'wx'
      },
      method: 'post',
      success:function(res){
         console.log(res.data)
         if(res.data.status == 1){
           var list = JSON.parse(res.data.data)
            wx.showToast({
              title: "添加成功",
              icon: "none"
            })
           if (that.data.sendType != null){
             setTimeout(() => {
               wx.navigateBack({
                 url:'/pages/suber/place/place'
               })
             }, 500)
           }else{
             setTimeout(() => {
               wx.navigateBack({
                 url:'/pages/location/location'
               })
             }, 500)
           }
         }
      }
    })
    }else{
      if (that.data.checked == false) {
        var isDefault = 0
      } else {
        var isDefault = 1
      }
      util.kmRequest({
        url: modifyUserMailingAddressUrl,
        data: {
          id:id,
          receiver: that.data.name,
          userId: app.globalData.kmUserInfo.id,
          phone: that.data.phone,
          regionCode: that.data.cityCode,
          region: that.data.cityName,
          detailAddress: detailAddress,
          isDefault: isDefault,
          source: 'wx'
        },
        method: 'post',
        success:function(res){
          console.log(isDefault)
          console.log(JSON.parse(res.data.data))
          if(res.data.status == 1){
              wx.showToast({
                title: "修改成功",
                icon: "none"
              })
              setTimeout(()=>{
                wx.navigateBack({
                  url: '/pages/location/location'
                })
              },500)
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
    var that = this
    var datadelt = options.datalet
    if(datadelt != undefined){
    var datadelts = JSON.parse(datadelt)
    var names = datadelts.receiver
    var phones = datadelts.phone
    var site = datadelts.detailaddress
    if (datadelts.isdefault==1){
        this.setData({
          checked:true
        })
      }
    this.setData({
      name: datadelts.receiver,
      phone: datadelts.phone,
      selec: datadelts.addres,
      site: datadelts.detailaddress,
      cityCode: datadelts.regioncode,
      datadel: datadelts,
      cityName: datadelts.region
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 2]
    this.setData({
      sendType: currPage.data.sendType
    })
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