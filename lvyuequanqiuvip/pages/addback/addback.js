const config = require('../../config.js')
const util = require('../../utils/util.js')
const addBankCardInfoUrl = config.addBankCardInfoUrl
const getVerificationUrl = config.getVerificationUrl
const getBankCardListUrl = config.getBankCardListUrl
const modifyBankCardInfoUrl = config.modifyBankCardInfoUrl
const getProvicesUrl = config.getProvicesUrl
const getCitiesUrl = config.getCitiesUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    identity: '',
    cardnumber: '',
    bank: '',
    phone: '',
    showModalStatus: false,//是否显示
    cityCode: '',
    city: null,
    id:'',
    citys: null,
    selec: '选择省市',
    send: true,
    alreadySend: false,
    second: 60,
  },
  resgiter: function () {
    this.showModal()
    this.dataRequest()
    this.setData({
      citylse: true,
      cityls: false,
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
  selectOver: function (event) {
    var selectItem = this.data.city[event.currentTarget.dataset.index];
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
    })
    this.hideModal()
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
  sendMsg() {
    util.kmRequest({
      url: getVerificationUrl,
      data: {
        phone: app.globalData.kmUserInfo.phone,
      },
      success: function (res) {
        var data = res.data.data
        console.log(data)
      }
    })
    this.timer()
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1,
            alreadySend: true,
            send: false
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  formSubmit(e) {
    var that = this
    console.log(e)
    var err = ''
    if (e.detail.value.name == '') {
      err = "请输入真实姓名"
    } else if (e.detail.value.identity == '') {
      err = "请输入身份证号"
    } else if (!util.isCardNo(e.detail.value.identity)) {
      err = "身份证号格式错误"
    } else if (e.detail.value.cardnumber == '') {
      err = "请输入本人银行卡号码"
    } else if (!util.cardnumber(e.detail.value.cardnumber)) {
      err = "银行卡号格式错误"
    } else if (e.detail.value.bank == '') {
      err = "请输入发卡银行"
    } else if (e.detail.value.phone == '') {
      err = "请输入银行卡绑定的手机号"
    } else if (that.data.selec == '选择省市') {
      err = "请选择银行卡地区"
    } else if (e.detail.value.num == '') {
      err = "请输入验证码"
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: 'none'
      })
      return
    }
    if(that.data.id != ''){
      var date = modifyBankCardInfoUrl
      var data  = {
        userId: app.globalData.kmUserInfo.id,
        realName: e.detail.value.name,
        identity: e.detail.value.identity,
        bankCardNo: e.detail.value.cardnumber,
        bankName: e.detail.value.bank,
        addressCode: that.data.cityCode,
        phone: e.detail.value.phone,
        code: e.detail.value.num,
        id:that.data.id
      }
    }else {
      var date = addBankCardInfoUrl
      var data = {
        userId: app.globalData.kmUserInfo.id,
        realName: e.detail.value.name,
        identity: e.detail.value.identity,
        bankCardNo: e.detail.value.cardnumber,
        bankName: e.detail.value.bank,
        addressCode: that.data.cityCode,
        phone: e.detail.value.phone,
        code: e.detail.value.num,
      }
    }
    util.kmRequest({
      url: date,
      data: data,
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {
          wx.showToast({
            title: '添加成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 300)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  details() {
    var that = this
    util.kmRequest({
      url: getBankCardListUrl,
      data: {
        userId: app.globalData.kmUserInfo.id
      },
      method: "post",
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          wx.setNavigationBarTitle({
            title: '银行卡信息',
          })
          that.setData({
            name: list.realName,
            identity: list.identity,
            cardnumber: list.bankCardNo,
            bank: list.bankName,
            phone: list.phone,
            selec: list.province + list.city,
            cityCode: list.addressCode,
            id: list.id,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加银行卡',
    })
    this.details()
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