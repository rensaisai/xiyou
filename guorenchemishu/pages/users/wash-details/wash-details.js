const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getCarwashSetmealsUrl = config.getCarwashSetmealsUrl
const getCarwashInfoUrl = config.getCarwashInfoUrl
// const getCarwashCommentsUrl = config.getCarwashCommentsUrl
const getCommentsUrl = config.getCommentsUrl

var app = getApp()
Page({

  /**    
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    windowHeight: '',
    clickstate: '点击展开',
    active: true,
    list: null,
    selectItem:null,
    showModalloading:true,
    page:0,
    projectlist:null,
    price: 0,
    hiddenNone:true,
    loadmore: false,
    isHideLoadMore: true,
    commentsList: null,
  },
  eventchange: function (e) {
    var current = e.detail.current
    this.setData({
      currentData: current,
    })
  },
  checkCurrent(e) {
    var current = e.currentTarget.dataset.index
    this.setData({
      currentData: current,
    })
  },
  an() {
    var that = this
    if (that.data.active == false) {
      that.setData({
        active: true,
        clickstate: '点击收起'
      })
    } else {
      that.setData({
        active: false,
        clickstate: '点击展开'
      })
    }
  },
  address() {
    var that = this
    var list = that.data.list
    wx.openLocation({
      latitude: list.lat,
      longitude: list.lon,
      scale: 18,
      name: list.carwashName,
      address: list.address
    })
  },
  detal: function () {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarwashInfoUrl,
        param:{
          id: that.data.selectItem.id
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)[0]
          var img1 = 'img1'
          var img2 = 'img2'
          var stars = new Array();
          var count = parseInt(Math.round(list.evaluate1));
          for (var j = 0; j < count; j++) {
            stars.push(img1);
          }
          if (stars.length < 5) {
            var sta = 5 - stars.length
            for (var i = 0; i < sta.length; i++) {
              stars.push(img2)
            }
          }
          list.stars = stars;
          that.setData({
            list: list
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
      }
    })
  },
  btn(){
    var that = this
    var order = []
    var list = that.data.projectlist
    for (var i = 0; i < list.length; i++) {
      if (list[i].checked == true) {
        order.push(list[i])
      }
    }
    that.setData({
      loading: true
    })
    wx.navigateTo({
      url: '/pages/users/wash-order/order?entity=' + JSON.stringify(that.data.list) + '&order=' + JSON.stringify(order),
    })
  },
  vehicle: function () {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCarwashSetmealsUrl,
        param:{
          carwashId: that.data.selectItem.id,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var projectlist = JSON.parse(res.data.data)
          projectlist[0].checked = true
          var price = projectlist[0].price
          var prices = price.toFixed(2)
          that.setData({
            projectlist: projectlist,
            price: prices,
            showModalloading: false,
          })
        } else {
          that.setData({
            showModalloading: false,
          })
          wx.showToast({
            title: res.data.msg,
            icon: "none"
          })
        }
        if (that.data.projectlist == null || that.data.projectlist.length == 0){
          that.setData({
            hiddenNone:''
          })
        }else{
          that.setData({
            hiddenNone:true
          })
        }
      }
    })
  },
  maintenance(e) {
    var that = this
    var projectlist = that.data.projectlist
    var project = projectlist[e.currentTarget.dataset.index]
    var price = 0
    for (var i = 0; i < projectlist.length; i++) {
      if (projectlist[i].id == project.id) {
        if (projectlist[i].checked == false || projectlist[i].checked == undefined) {
          projectlist[i].checked = true
        }
        price = projectlist[i].price
        //  else if (projectlist[i].checked == true) {
        //   projectlist[i].checked = false
        // }
      }else{
        projectlist[i].checked = false
      }
    }
    var prices = price.toFixed(2)
    that.setData({
      projectlist: projectlist,
      price: prices
    })
  },
  evaluate: function () {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getCommentsUrl,
        param:{
          // id: that.data.selectItem.id
          repairId: that.data.selectItem.id,
          pageNum: that.data.page
        }
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1) {
          var img1 = 'img1'
          var img2 = 'img2'
          var list = JSON.parse(res.data.data);
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var time = item.createTime
            item.time = time.slice(0, 10)
            if (item.nickName != null && item.nickName.length != 0) {
              item.title = item.nickName;
            } else {
              var phone = "";
              if (item.phone != null && item.phone.length == 11) {
                var tempStr = item.phone.slice(3, 8);
                phone = item.phone.replace(tempStr, "*****");
              }
              item.title = phone;
            }
            var stars = new Array();
            var count = parseInt(Math.round(item.evaluate));
            console.log(count)
            for (var j = 0; j < count; j++) {
              stars.push(img1);
            }
            item.stars = stars;
            if (item.stars.length < 5) {
              var str = 5 - item.stars.length
              for (var s = 0; s < str; s++) {
                item.stars.push(img2)
              }
            }
          }
          if (that.data.commentsList != null) {
            var evaluationlist = that.data.commentsList
            var list = evaluationlist.concat(list)
          }
          that.setData({
            commentsList: list
          });
        }else if(res.data.status == 6){
          if (that.data.page > 0) {
            that.setData({
              page: that.data.page - 1,
              loadmore: true
            });
          }
        }
      }
    })
  },
  // mapShow: function () {
  //   wx.openLocation({
  //     latitude: this.data.list.lat,
  //     longitude: this.data.list.lon,
  //     name: this.data.list.carwashName,
  //     address: this.data.list.address
  //   })
  // },
  phone() {
    wx.showModal({
      content: '400-992-5550',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-992-5550',
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  phones(e) {
    var phone = e.currentTarget.dataset.phone
    wx.showModal({
      content: phone,
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  scroll() {
    var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true) {
      that.setData({
        isHideLoadMore: false,
      })
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page: that.data.page + 1
        })
        that.evaluate()
      }, 1000)
    }
  },
  // showFrom: function () {
  //   this.setData({
  //     active: (this.data.active ? false : true)
  //   })
  // },
  // selected: function (e) {
  //   this.setData({
  //     selected1: false,
  //     selected: true
  //   })
  // },
  // selected1: function (e) {
  //   this.setData({
  //     selected: false,
  //     selected1: true
  //   })
  // },
  // radioChange: function (e) {
  //   var items = this.data.price;
  //   for (var i = 0; i < items.length; i++) {
  //     if (i == e.detail.value) {
  //       items[i].checked = true;
  //       this.setData({
  //         selectSetmeal: items[i]
  //       });
  //     } else {
  //       items[i].checked = false;
  //     }
  //   }
  //   this.setData({
  //     price: items
  //   });
  // },
  // checkOrder: function () {
  //   if (this.data.selectSetmeal == null) {
  //     wx.showToast({
  //       title: "请选择保养套餐",
  //       icon: "none"
  //     })
  //     return;
  //   }
  //   if (app.globalData.kmUserInfo.memberFlag == 0) {
  //     wx.showModal({
  //       title: "提示",
  //       content: "您还未加入VIP会员，现在加入",
  //       showCancel: false,
  //       confirmText: "马上加入",
  //       confirmColor: "#fd4200",
  //       success: function (res) {
  //         if (res.confirm == true) {
  //           wx.switchTab({
  //             url: '/pages/proxy/proxy',
  //           })
  //         }
  //       }
  //     })
  //   } else {
  //     wx.navigateTo({
  //       url: '/pages/users/confirm/confirm?entity=' + JSON.stringify(this.data.list) + '&setmeal=' + JSON.stringify(this.data.selectSetmeal)
  //     });
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var selectItem = JSON.parse(options.selectItem)
    this.setData({
      selectItem: selectItem,
    })
    this.detal()
    this.vehicle()
    this.evaluate()
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
    var that = this
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight - 46;
      }
    })
    that.setData({
      windowHeight: windowHeight,
      loading: false
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