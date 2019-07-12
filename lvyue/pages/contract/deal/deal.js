const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const isExistContractUrl = config.isExistContractUrl
const notsignedtextUrl = config.notsignedtextUrl
const createSimpleContractUrl = config.createSimpleContractUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   loading:false,
   active:false,
   active1: false,
   active2: true,
   checked:false,
   startDate: '',
   endDate:'',
   validPeriod:'',
   time:'',
   type:'',
  },
  //预览未签署合同 
  btn(){
    var that = this
    that.setData({
      active: true,
      active1: false,
      active2: false,
      loading:true
    })
    wx.downloadFile({
      url: notsignedtextUrl,
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success(res) {
            console.log('打开文档成功')
            that.setData({
              loading:false
            })
          }
        })
      }
    })
  },
  btn1() {
    this.setData({
      active1: true,
      active:false,
      active2:false,
    })
    wx.switchTab({
      url:'/pages/personalcenter/personalcenter'
    })
  },
  //创建合同信息 
  formSubmit(e){
  var that = this
  console.log(e)
  that.setData({
    active2: true,
    active: false,
    active1: false
  })
  var err = ''
  if(e.detail.value.name == ''){
    err='请输入员工姓名'
  } else if (e.detail.value.card == ''){
    err = '请输入身份证号'
  } else if (!util.isCardNo(e.detail.value.card)){
    err = '身份证号格式有误'
  } else if (e.detail.value.address == ''){
    err = '请输入住址'
  } else if (e.detail.value.phone == ''){
    err = '请输入联系电话'
  } else if (!util.checkPhone(e.detail.value.phone)){
    err = '手机号格式有误'
  }
  if(err.length >0){
    wx.showToast({
      title: err,
      icon:'none'
    })
    return
  }
  if(that.data.checked == false){
    wx.showToast({
      title: '请勾选阅读并同意服务协议',
      icon: 'none'
    })
    return
  }
  util.kmRequest({
    url: createSimpleContractUrl,
    data:{
      userId:app.globalData.kmUserInfo.id,
      userName: e.detail.value.name,
      userAddress: e.detail.value.address,
      certifyNum: e.detail.value.card,
      userPhone: e.detail.value.phone,
      startDate: that.data.startDate,
      endDate: that.data.endDate,
      validPeriod: that.data.validPeriod,
      contractTemplateId:'1',
      validPeriodType:that.data.type,
    },
    method:"post",
    success(res){
      if(res.data.status == 1){
        var code = JSON.parse(res.data.data)[0]
        wx.navigateTo({
          url: '/pages/contract/code/code?contractId=' + code.contractId + '&signerId=' + code.signerId,
        })
      }else{
        setTimeout(()=>{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          }) 
        },400)
      }
    }
  })
  },
  agreement(){
    if (this.data.checked ){
      this.setData({
        checked: false,
      })
    }else{
      this.setData({
        checked: true,
      })
    }
  },
  //获取合同有限期限 
  contractdate(){
    var that = this
    util.kmRequest({
      url: isExistContractUrl,
      data:{
        userId: app.globalData.kmUserInfo.id,
        contractTemplateId:'1',
        version:''
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          var date = JSON.parse(res.data.data)[0]
          console.log(date)
          var time = ''
          if(date.validPeriodType  = 0){
            time = date.validPeriod+'年'
          }
          if (date.validPeriodType = 1){
            time = date.validPeriod + '月'
          }
          if (date.validPeriodType = 1) {
            time = date.validPeriod + '天'
          }
          that.setData({
            startDate: date.startDate,
            endDate: date.endDate,
            validPeriod: date.validPeriod,
            time:time,
            type: date.validPeriodType,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.contractdate()
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
   this.setData({
     loading:false
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