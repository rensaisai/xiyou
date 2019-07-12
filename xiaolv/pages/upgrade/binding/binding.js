const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCardCodeUrl = config.getCardCodeUrl
const getValidUserCardByUserIdAndIsBuyUrl = config.getValidUserCardByUserIdAndIsBuyUrl
const verificationCardCodeByCodeAndPhoneUrl = config.verificationCardCodeByCodeAndPhoneUrl
const isBindingVipUserUrl = config.isBindingVipUserUrl
const getCardTypeUrl = config.getCardTypeUrl
const getUserVipCardNumUrl = config.getUserVipCardNumUrl
const bindingVipUserUrl = config.bindingVipUserUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenNone: 'true',
    currentTab:0,
    send: true,
    alreadySend: false,
    second: 60,
    img:'/image/headdefault.png',
    phone:'',
    code:'',
    msg:'',
    filtrate:null,
    actives:true,
    carde:'',
    pop:''
  },
  swichNav:function(e){
    var that = this
    var cunt = e.currentTarget.dataset.current
    if (that.data.currentTab == cunt){
      return false;
    }else{
      that.setData({
        currentTab: cunt
      })
    }
  },
switchTab:function(e){
  this.setData({
    currentTab: e.detail.current
  });
  if(e.detail.current == 0){
    this.height()
}
if (e.detail.current == 1) {
  this.heights()
}
  },
phone(e){
  this.setData({
    phone: e.detail.value
  })
},
code(e){
  this.setData({
    code: e.detail.value
  })
},
sendMsg(){
  var that = this
  if(that.data.phone==''){
    wx.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }
  if (!util.checkPhone(that.data.phone)){
    wx.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }
  that.pop()
  },
  getcode(){
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCardCodeUrl,
        param:{
          phone: that.data.phone
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
    that.setData({
      alreadySend: true,
      send: false
    })
    that.timer()
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0)   {
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
  btn(){
    var that = this
    if(that.data.phone==''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }else if (that.data.phone != ''  && that.data.code==''){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else if (that.data.phone != '' && that.data.code != ''){
      util.kmRequest({
        data:{
          interfaceName: verificationCardCodeByCodeAndPhoneUrl,
          param:{
            phone: this.data.phone,
            code: this.data.code,
          }
        },
        success:function(res){
         if(res.data.status ==1){
           that.bindinguser()
         }else{
           wx.showToast({
             title: res.data.msg,
             icon: 'none'
           })
         }
        }
      })
    }
  },
  cancels(){
    this.hideModal()
    this.setData({
      phone:''
    })
  },
  cancel() {
    this.hideModal()
    this.setData({
      phone: ''
    })
    wx.showToast({
      title: '绑定失败',
      icon: 'none'
    })
  },
  affirm(){
    this.hideModal()
    this.getcode()
  },
  affirms(){
   this.hideModal()
   this.setData({
     phone: '',
   })
  },
  pop(){
    var that = this
   util.kmRequest({
     data:{
       interfaceName: isBindingVipUserUrl,
       param:{
         phone: that.data.phone
       }
     },
     success:function(res){
       if(res.data.status == 1){
         var pop = JSON.parse(res.data.data)
         that.showModal()
         that.setData({
           active:true,
           pop:pop
         })
       }else{
        that.showModal()
        that.setData({
          active:false,
          msg:res.data.msg,
        })
       }
     }
   })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
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
      // duration: 200,
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
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModa: true
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
      // duration: 200,
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
        showModa: false
      })
    }.bind(this), 150)
  },
  screen(){
    this.showModals()
    this.setData({
      active: true
    })
  },
  all(){
    var type=''
  var screen = this.data.filtrate
    for (var i = 0; i < screen.length;i++){
      screen[i].active = false
    }
   this.setData({
     actives:true,
     filtrate: screen
   })
    this.binding(type)
    this.hideModals()
  },
  else(e){
    console.log(e)
    this.setData({
      actives: false
    })
    var type = e.currentTarget.dataset.type
    console.log(type)
    var screen = this.data.filtrate
    for (var i = 0; i < screen.length; i++){
      screen[i].active = false
      if (screen[i].type == type){
        screen[i].active=true
      }
    }
    this.setData({
      filtrate: screen
    })
    this.binding(type)
    this.hideModals()
  },
  binding: function (type){
    var that = this
   util.kmRequest({
     data:{
       interfaceName: getValidUserCardByUserIdAndIsBuyUrl,
       param:{
         type: type
       }
     },
     success:function(res){
       that.setData({
         list: [],
         hiddenNone: 'true'
       })
       if(res.data.status==1){
         var list = JSON.parse(res.data.data)
         console.log(list)
         for (var i = 0; i < list.length; i++) {
           var time = list[i].dueTime.slice(0, 10)
           var timel = time.replace(/\-/g, '\.')
           list[i].finish = timel
           var times= list[i].startTime.slice(0,10)
           var timels = times.replace(/\-/g, '\.')
           list[i].start = timels
          //  if (list[i].type == 0) {
          //    list[i].name = '无门槛'
          //  } else if (list[i].type == 1) {
          //    list[i].name = '满减券'
          //  }
         }
         that.setData({
           list: list
         })
       }else if(res.data.status == 6){
         if (that.data.list == null || that.data.list.length == 0) {
           that.setData({
             hiddenNone: ''
           })
         } else {
           that.setData({
             hiddenNone: 'true'
           })
         }
       }else{
         wx.showToast({
           title: res.data.msg,
           icon: 'none'
         })
       }
     }
   })
  },
  filtrate:function(){
    var that =this
    util.kmRequest({
      data:{
        interfaceName: getCardTypeUrl,
        param:{}
      },
      success:function(res){
        if(res.data.status == 1){
          var filtrate = JSON.parse(res.data.data)
          console.log(filtrate)
          for (var i = 0; i < filtrate.length; i++){
            filtrate[i].active=false
          }
          that.setData({
            filtrate: filtrate
          })
        }
      }
    })
  },
  cardnumber(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getUserVipCardNumUrl,
        param:{}
      },
      success:function(res){
        if(res.data.status ==1){
          var carde =JSON.parse(res.data.data)
          that.setData({
            carde: carde
          })
        }
      }
    })
  },
  bindings(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/upgrade/member/member?id='+id,
    })
  },
  bindinguser(){
    var that  = this
    util.kmRequest({
      data:{
        interfaceName: bindingVipUserUrl,
        param:{
          phone: that.data.phone
        }
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status ==1){
          wx.showToast({
            title: '绑定成功',
            icon:'success'
          })
          that.cardnumber()
          that.setData({
            send: true,
            alreadySend: false,
            second: 60,
            phone: '',
            code: '',
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }else{
          that.setData({
            send: true,
            alreadySend: false,
            second: 60,
            code: '',
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
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
    this.filtrate()
    var type =''
    this.binding(type)
    this.cardnumber()
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