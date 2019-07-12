const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getBankCardListUrl = config.getBankCardListUrl
const withdrawDepositUrl = config.withdrawDepositUrl
const contractStatusUrl = config.contractStatusUrl
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
    selec:'',
    cityCode:'',
  },
  list(){
    var that = this
    util.kmRequest({
      url: getBankCardListUrl,
      data:{
        userId: app.globalData.kmUserInfo.id
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          that.setData({
            name: list.realName,
            identity: list.identity,
            cardnumber: list.bankCardNo,
            bank: list.bankName,
            phone: list.phone,
            selec: list.province + list.city,
            cityCode: list.addressCode
          })
        }else {
          wx.showModal({
            content: '是否立即绑定银行卡',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/addbank/addbank',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  formSubmit(e){
    console.log(e)
    var that = this
    if (e.detail.value.price === ''){
      wx.showToast({
        title: '请输入提现金额',
        icon:'none'
      })
      return
    }
    if (e.detail.value.price < 500){
      wx.showToast({
        title: '提现金额必须不低于500',
        icon: 'none'
      })
      return
    }
    util.kmRequest({
      url: withdrawDepositUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        useCash: app.globalData.kmUserInfo.appBalance,
        cash: e.detail.value.price,
        realName: e.detail.value.name,
        bankCardNo: e.detail.value.cardnumber,
        bankName: e.detail.value.bank,
        bankAddress: e.detail.value.selec,
        addressCode: that.data.cityCode,
        phone: e.detail.value.phone
      },
      method:"post",
      success:function(res){
        if(res.data.status == 1){
          wx.showToast({
            title: '提交成功',
            icon:'none',
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/personalcenter/personalcenter'
            })
          },300)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
    })
  },
  contractstatus() {
    var that = this
    util.kmRequest({
      url: contractStatusUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          var contract = JSON.parse(res.data.data)[0]
          if (contract.status == 0 && app.globalData.kmUserInfo.isApp >=3) {
            wx.showModal({
              content: '签署合同后，即可进行提现',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/contract/deal/deal',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
             that.list()
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      appBalance: app.globalData.kmUserInfo.appBalance
    })
    this.contractstatus()
   
   
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