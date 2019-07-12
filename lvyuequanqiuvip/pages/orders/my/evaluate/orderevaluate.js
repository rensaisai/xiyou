const config = require('../../../../config')
const commitCommentUrl = config.commitCommentUrl

var app = getApp()
var util = require('../../../../utils/util')

Page({
  data: {
    entity: {},
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/image/star_normal.png',
    selectedSrc: '/image/star_selected.png',
    halfSrc: '/image/star_half.png',
    key: 0//评分
  },
  commentRequest:function(e){
    var that = this;

    var err = '';
    if (this.data.key == -1){
      err = '请输入评分';
    } else if (e.detail.value.content.length == 0) {
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
      url: commitCommentUrl,
      data: {
        orderId: this.data.entity.orderId,
        comment: e.detail.value.content,
        stars: this.data.key
      },
      success: function (res) {
        if(res.data.status == 1){
          wx.showToast({
            title: "评价成功",
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
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
    this.setData({
      entity: JSON.parse(entity)
    })
  },
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    this.setData({
      key: key
    })

  },
  //点击左边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key: key
    })
  }
})

