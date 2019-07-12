const config = require('../../../config.js');
const getToursItineraryDetailsInfoUrl = config.getToursItineraryDetailsInfoUrl;
const util = require('../../../utils/util.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dayes: 1,
    id:'',
    showModalStatus: false,
    toView:'',
    journey:null,
    box_itemh_h:null,
    clientHeight: '',
    scrollTop:0,
  },
  journey(id) {
    var that = this
    util.kmRequest({
      url: getToursItineraryDetailsInfoUrl,
      data: {
        toursId: id
      },
      success: function (res) {
        if (res.data.status == 1) {
          var journey = JSON.parse(res.data.data)
          console.log(journey)
          for (var i = 0; i < journey.length; i++){
            journey[i].id = 'a' +journey[i].id
            if (journey[i].breakfast==0){
              journey[i].cereal='无'
            } else if (journey[i].breakfast == 1){
              journey[i].cereal = '有'
            }
            if (journey[i].dinner==0){
              journey[i].supper = '无'
            } else if (journey[i].dinner == 1){
              journey[i].supper = '有'
            }
          }
          that.setData({
            journey: journey,
            toView: journey[0].id
          })
          that.height()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    this.journey(id)
  },
  numbe(){
    this.showModal();
  },
  choiceWordindex: function (event) {
    console.log(event)
    this.hideModal()
    let wordindex = event.currentTarget.dataset.id;
    let dayes = event.currentTarget.dataset.days
    console.log(dayes)
    this.setData({
        toView: wordindex,
        dayes: dayes
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
    animation.translateY(-300).step()
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
    animation.translateY(-300).step()
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

  height:function(){
    var that =this
    var height=[]
    var query = wx.createSelectorQuery();
    var that = this;
    query.selectAll('.sky').boundingClientRect(function (rect) {
    }).exec(function(rect){
      var res = rect[0]
      for (var i = 0; i < res.length; i++) {
        var numb = res[i].height-4
        height.push(numb)
      }
      that.setData({
        box_itemh_h: height,
      })
    });
  },
  scroll: function (e){
   var that = this;
    var arr = []
    var h = 0;
    for (var i = 0; i < this.data.journey.length; i++) {
      for (var i = 0; i < this.data.box_itemh_h.length; i++) {
        var id = this.data.journey[i].id;
        var dye = this.data.journey[i].days
        h = h + this.data.box_itemh_h[i];
        arr.push({ id: id, scrolltoph: h, days: dye})
      }
    };
   var scrollTop = e.detail.scrollTop;
    for (var i = 0; i < arr.length; i++) {
      if (scrollTop <= arr[i].scrolltoph) {
        this.setData({
          dayes:arr[i].days,
        })
        break;
      }
    };
  },
  
  // img:function(e){
  //   var current = e.target.dataset.src;
  //   wx.previewImage({
  //     current: current,
  //     urls: imgs,
  //   })
  // },
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