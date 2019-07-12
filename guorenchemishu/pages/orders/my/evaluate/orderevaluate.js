const config = require('../../../../config')
const commitCommentUrl = config.commitCommentUrl
var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    entity: {},
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/star.png',
    selectedSrc: '/image/star1.png',
    key: 2,//评分
    key1:2,
    key2:2
  },
  commentRequest:function(e){
    var that = this;
    var err = '';
    if (e.detail.value.content.length == 0) {
      err = '请输入评价内容';
    }
    if(err.length > 0){
      wx.showToast({
        title: err,
        icon: "none"        
      })
      return;
    }
      util.kmRequest({
        data:{
          interfaceName: commitCommentUrl,
          param:{
            orderId: this.data.entity.id,
            comment: e.detail.value.content,
            stars1: this.data.key + 1,
            stars2: this.data.key1 + 1,
            stars3: this.data.key2 + 1
          }
        },
        success:function(res){
          if (res.data.status == 1) {
            wx.switchTab({
              url: "/pages/mine/mine"
            })
            setTimeout(()=>{
              wx.showToast({
                title: "评价成功",
              })
            },500)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
          }
        }
      })
  },
  onLoad: function (options) {
    var entity = options.entity;
    console.log(JSON.parse(entity))
    this.setData({
      entity: JSON.parse(entity)
    })
  },
  evaluate(e){
   console.log(e)
    var key = e.currentTarget.dataset.index
    this.setData({
      key:key
    }) 
  },
  evaluate1(e) {
    console.log(e)
    var key = e.currentTarget.dataset.index
    this.setData({
      key1: key
    })
  },
  evaluate2(e) {
    console.log(e)
    var key = e.currentTarget.dataset.index
    this.setData({
      key2: key
    })
  },
})

