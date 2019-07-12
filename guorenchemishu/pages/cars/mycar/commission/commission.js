const config = require('../../../../config.js')
const getAmountByUserIdUrl = config.getAmountByUserIdUrl
const getAmountInfoByIdUrl = config.getAmountInfoByIdUrl
var app = getApp()
var util = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    hiddenNone: 'true',
    showModal: false,
    water: null,
    animationData: '',
  },
  commission:function(){
    var that=this
    var arr=[]
    util.kmRequest({
      data:{
        interfaceName: getAmountByUserIdUrl,
        param:{}
      },
      method:"post",
      success:function(res){
        if(res.data.status==1){
          var list = JSON.parse(res.data.data)
          console.log(list)
          var letter = new Array();
          var fctList = new Array();
          var currentLetter = '';
          var currentData;
          for(var i=0; i<list.length; i++){
            var time = list[i].createTime.slice(0, 10) 
            list[i].time = time
            // if(list[i].amountType == 1){
            //   list[i].atems ='成为会员赠送'
            // }
            // if(list[i].amountType == 2){
            //   list[i].atems = '发展会员赠送'
            // }
            // if (list[i].amountType == 3){
            //   list[i].atems = '保养消费'
            // }
            // if (list[i].amountType == 4) {
            //   list[i].atems = '提现'
            // }
            // if (list[i].amountType == 5) {
            //   list[i].atems = '充值'
            // }
            if (list[i].numType == 0){
              list[i].active = true
            }
            if (list[i].numType == 1) {
              list[i].active = false
            }
            if (currentLetter != list[i].time) {
              currentLetter = list[i].time;
              currentData = new Array();
              currentData.push(list[i]);
              fctList.push({ letter: currentLetter, data: currentData });
            }else{
              currentData.push(list[i]);
            }
          }
          that.setData({
            list: fctList
          })
        }
        that.showNone()
      },
    })
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length==0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  runningwater(id) {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getAmountInfoByIdUrl,
        param:{
          amountId: id
        }
      },
      success: function (res) {
        console.log(res.data)
        var water = null
        if (res.data.status == 1) {
          that.showModal()
          var water = JSON.parse(res.data.data)[0]
          var phone = water.userPhone.slice(3, 7)
          water.phone = water.userPhone.replace(phone, '****')
          water.time = water.createTime.slice(0, 10)
          console.log(water)
        }else if(res.data.status == 6){
          that.hideModal()
        }
        that.setData({
          water: water
        })
      }
    })
  },
  list(e) {
    var that = this
    var status = e.currentTarget.dataset.status
    var id = e.currentTarget.dataset.id
    if (status == 0) {

    } else {
      this.runningwater(id)
    }
  },
  hider() {
    this.hideModal()
  },
  showModal: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    // 动画开始时
    animation.scale3d(0, 0, 0).step()
    this.setData({
      // 执行动画
      animationData: animation.export(),
    })
    setTimeout(function () {
      // 动画结束时
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModal: true
      })
    }.bind(this), 300)
  },
  hideModal: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModal: false
      })
    }.bind(this), 300)
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
    this.commission()
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