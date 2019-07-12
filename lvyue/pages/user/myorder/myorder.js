const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const queryOrderByUserIdUrl = config.queryOrderByUserIdUrl
const queryTourOrderUrl = config.queryTourOrderUrl
const cancelGoodsOrderUrl = config.cancelGoodsOrderUrl
const receivedUrl = config.receivedUrl
const cancelTourOrderUrl = config.cancelTourOrderUrl
const wxCreateOrderUrl = config.wxCreateOrderUrl
const judgementOrderUrl = config.judgementOrderUrl 
const isExistPayPassWordUrl = config.isExistPayPassWordUrl
const verifyPayPassWordUrl = config.verifyPayPassWordUrl
const balancePayUrl = config.balancePayUrl
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    pages:'',
    orderid:'',
    activem:true,
    hiddenNone:true,
    orderlist:null,
    ordercircuit: null,
    windowHeight:'',
    list:[0,1,2,3],
    loding:false,
    loadingType:0,
    page:0,

    showModalStatus: false,//是否显示
    checked: true,
    actives:true,
    title: '确认付款',
    pay: 0,
    select: true,
    payType: '',
    payWayValue: 1,
    length: 6,
    isFocus: true,
    value: '',
    active: false,
  },
  //商品订单列表 
  orderlist(){
    var that = this
   if (that.data.currentData == 0) {
      var orderStatus = ''
    }
    if (that.data.currentData == 1) {
      var orderStatus = 0
    }
    if (that.data.currentData == 2) {
      var orderStatus = 3
    }
    if (that.data.currentData == 3) {
      var orderStatus = 2
    }
    if (that.data.pages != ''){
      var version = 2
    }else{
      var version = ''
    }
        util.kmRequest({
          url: queryOrderByUserIdUrl,
          data:{
            userId: app.globalData.kmUserInfo.id,
            orderStatus: orderStatus,
            orderSource: 'app',
            page: that.data.page,
            version: version,
          },
          success(res){
            if(res.data.status == 1){
              var orderlist = JSON.parse(res.data.data)
              if (orderlist.length < 4){
                that.setData({
                  loading: true,
                  loadingType: 2,
                })
              }
              if (orderlist.length == 0 ){
                 that.setData({
                   loading:true,
                   loadingType:2,
                 })
              }else{
                for (var i = 0; i < orderlist.length; i++) {
                  if (orderlist[i].orderStatus == 0) {
                    orderlist[i].pays = '立即支付'
                    orderlist[i].refund = '取消支付'
                    orderlist[i].active = true
                  }
                  if (orderlist[i].orderStatus == 1) {
                    orderlist[i].pays = '待发货'
                    orderlist[i].active = true
                  }
                  if (orderlist[i].orderStatus == 2) {
                    orderlist[i].pays = '再次购买'
                    orderlist[i].refund = '评价'
                    orderlist[i].active = true
                  }
                  if (orderlist[i].orderStatus == 3) {
                    orderlist[i].pays = '确认收货'
                    orderlist[i].refund = '物流信息'
                    orderlist[i].active = true
                    orderlist[i].active1 = false
                  }
                }
              }
              if (that.data.orderlist != null) {
                var orderlists = that.data.orderlist
                var orderlist = orderlists.concat(orderlist)
              }
            }else if(res.data.status == 6){
        
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
            that.setData({
              orderlist: orderlist,
            })
            if (that.data.orderlist == null || that.data.orderlist.length == 0){
              that.setData({
                hiddenNone : ''
              })
            }else{
              that.setData({
                hiddenNone:true
              })
            }
          }
        })
  },
  //取消商品未支付订单
  cancelgoods(id){
    var that = this
    util.kmRequest({
      url: cancelGoodsOrderUrl,
      data:{
        orderId:id,
      },
      success(res){
        if(res.data.status == 1){
          that.setData({
            loding: false,
            hidden: false,
            page: 0,
            totalPage:0,
            orderlist:null,
          })
          that.orderlist()
          setTimeout(() => {
            wx.showToast({
              title: '取消成功',
            })
          }, 400)
        }
      }
    })
  },
  //旅游订单列表 
  travelorder(){
    var that = this
    var ordercircuit = that.data.ordercircuit
    if (that.data.currentData == 0) {
      var orderStatus = ''
    }
    if (that.data.currentData == 1) {
      var orderStatus = 0
    }
    if (that.data.currentData == 2) {
      var orderStatus = 1
    }
    if (that.data.currentData == 3) {
      var orderStatus = 4
    }
        util.kmRequest({
          url: queryTourOrderUrl,
          data:{
            userId: app.globalData.kmUserInfo.id,
            orderStatus: orderStatus,
            page: that.data.page
          },
          success(res){
            if(res.data.status == 1){
              var travellist = JSON.parse(res.data.data)[0]
              var order = travellist.pageData
              if (order.length < 4){
                that.setData({
                  loding: true,
                  loadingType: 2
                })
              }
              if (order.length ==0){
                 that.setData({
                   loding:true,
                   loadingType:2
                 })
              }else{
                for (var i = 0; i < order.length; i++) {
                  if (order[i].orderStatus == 0) {
                    order[i].pays = '立即支付'
                    order[i].refund = '取消支付'
                    order[i].active = true
                  }
                  if (order[i].orderStatus == 1) {
                    order[i].pays = '联系客服'
                    order[i].active = true
                  }
                  if (order[i].orderStatus == 2) {
                    order[i].pays = '退款中'
                    order[i].active = true
                  }
                  if (order[i].orderStatus == 3) {
                    order[i].pays = '已退款'
                    order[i].active = true
                  }
                  if (order[i].orderStatus == 4) {
                    order[i].pays = '再次购买'
                    order[i].refund = '评价'
                    order[i].active = true
                  }
                }
              }
              if (that.data.ordercircuit != null) {
                var ordercircuits = that.data.ordercircuit
                var order = ordercircuits.concat(order)
              }
            }else if(res.data.status == 6){
      
            }else{
              wx.showToast({
                title: res.data.msg,
                icon:'none'
              })
            }
            that.setData({
              ordercircuit: order,
            })
            if (that.data.ordercircuit == null || that.data.ordercircuit == 0) {
              that.setData({
                hiddenNone: ''
              })
            } else {
              that.setData({
                hiddenNone: true
              })
            }
          }
        })
  },

//  下拉加载更多
  scroll(e) {
    var that = this
    if (this.data.loadingType != 0 || this.data.loding || this.data.hiddenNone == false) {
      return;
    }
    that.setData({
      loadingType: 1
    });
    if (that.data.activem == true){
       setTimeout(()=>{
         that.setData({
           loadingType: 0,
           page: that.data.page + 1
         })
         that.orderlist()
       },1000)
    }else{
      setTimeout(() => {
        that.setData({
          loadingType: 0,
          page: that.data.page + 1
        })
        that.travelorder()
      }, 1000)
   }
  },
  // 点击切换列表
  checkCurrent: function (e) {
    console.log(e)
    var that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.currentTarget.dataset.current,
        scrollLeft: e.currentTarget.dataset.current * 30
      })
    }
  },
   // 滑动切换列表
  eventchange: function (e) {
    var that = this
    var current = e.detail.current
    that.setData({
      currentData: current,
      scrollLeft: current * 30,
      loding: false,
      loadingType: 0,
      page: 0,
      hiddenNone: false,
    })
    if(that.data.activem){
      that.setData({
        orderlist:null
      })
      that.orderlist()
    }else{
      that.setData({
        ordercircuit: null
      })
      that.travelorder()
    }
  },
  goods(){
   this.setData({
     activem:true,
     loding: false,
     page: 0,
     orderlist: null,
     ordercircuit: null,
     loadingType:0,
   })
    this.orderlist()
  },
  line(){
    this.setData({
      activem: false,
      loding: false,
      orderlist: null,
      ordercircuit: null,
      page: 0,
      loadingType: 0,
    })
    this.travelorder()
  },
  btn(e){
   var that = this
   if(that.data.activem){
     var orderlist = that.data.orderlist
     var order = orderlist[e.currentTarget.dataset.index]
     if (order.orderStatus == 0 && e.currentTarget.dataset.pays == '立即支付'){
       order.active = true
       orderlist[e.currentTarget.dataset.index] = order
       that.setData({
         orderid: order.id
       })
       if (order.orderType == 6 || order.orderType == 7){
         util.kmRequest({
           url: judgementOrderUrl,
           data:{
             orderId: order.id
           },
           success:(res)=>{
             if(res.data.status == 1){
              //  that.wxPreOrder(order.id) 
               that.payment(order.payType, order.id)
             }else{
               wx.showToast({
                 title: '此订单已失效',
                 icon:'none'
               })
             }
           }
         })
       }else{
         that.payment(order.payType, order.id)
        //  that.wxPreOrder(order.id) 
       }
       that.setData({
         pay: order.cashAmount
       })
    }
     if (order.orderStatus == 0 && e.currentTarget.dataset.pays == '取消支付'){
       order.active = false
       orderlist[e.currentTarget.dataset.index] = order
       that.cancelgoods(order.id)
     }
     if (order.orderStatus == 2 && e.currentTarget.dataset.pays == '再次购买'){
       wx.redirectTo({
         url: '/pages/suber/goods/goods?id=' + order.goodsId + '&source=' + order.goodsSource
              })
     }
     if (order.orderStatus == 2 && e.currentTarget.dataset.pays == '评价'){
       order.active = false
       wx.navigateTo({
         url: '/pages/suber/evaluate/evaluate?id=' + order.goodsId + '&type=' + 1 + '&img=' + order.imageUrl + '&orderid=' + order.id,
       })
     }
     if (order.orderStatus == 3 && e.currentTarget.dataset.pays == '确认收货'){
       order.active = true
       orderlist[e.currentTarget.dataset.index] = order
       that.affirm(order.id)
     }
     if (order.orderStatus == 3 && e.currentTarget.dataset.pays == '物流信息') {
       order.active = false
       orderlist[e.currentTarget.dataset.index] = order
       wx.navigateTo({
         url: '/pages/user/logistics/logistics?expressNo=' + order.expressNo + '&addresid=' + order.address,
       })
     }
     that.setData({
       orderlist: orderlist
     })
   }else{
     var ordercircuit = that.data.ordercircuit
     var order = ordercircuit[e.currentTarget.dataset.index]
     console.log(order)
     if (order.orderStatus == 0 && e.currentTarget.dataset.pays == '立即支付') {
       order.active = true
       ordercircuit[e.currentTarget.dataset.index] = order
       that.wxPreOrder(order.orderId)
     }
     if (order.orderStatus == 0 && e.currentTarget.dataset.pays == '取消支付') {
       order.active = false
       ordercircuit[e.currentTarget.dataset.index] = order
       that.delete(order.orderId)
     }
     if (order.orderStatus == 1 && e.currentTarget.dataset.pays == '联系客服'){
       wx.showModal({
         title: '是否联系客服',
          content: '400-0098-365',
          success(res) {
            if (res.confirm) {
              wx.makePhoneCall({
                phoneNumber: '400-0098-365',
                success: function () {
                  console.log("成功拨打电话")
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
     }
     if (order.orderStatus == 2 && e.currentTarget.dataset.pays == '联系客服') {
       wx.showModal({
         title: '是否联系客服咨询退款进度',
         content: '400-0098-365',
         success(res) {
           if (res.confirm) {
             wx.makePhoneCall({
               phoneNumber: '400-0098-365',
               success: function () {
                 console.log("成功拨打电话")
               }
             })
           } else if (res.cancel) {
             console.log('用户点击取消')
           }
         }
       })
     }
     if (order.orderStatus == 4) {
       if (order.refund == '评价'){
         order.active = false
         if (order.routeType == 0){
           var type = 2
         }else{
           var type = 3
         }
         wx.navigateTo({
           url: '/pages/suber/evaluate/evaluate?id=' + order.routeId + '&type=' + type + '&img=' + order.img + '&orderid=' + order.orderId,
         })
       }else{
         if (order.routeType == 0) {
           wx.redirectTo({
             url: '/pages/line/sincedetails/sincedetails?id=' + order.routeId
           })
         } else if (order.routeType == 1) {
           wx.redirectTo({
             url: '/pages/line/scattered/scattered?id=' + order.routeId
           })
         }
       }
      }
      that.setData({
        ordercircuit: ordercircuit
      })
   }
  },
  wxPreOrder(orderid) {
    var that = this
    var data = {
      openId: app.globalData.openid,
      orderId: orderid,
      ip: '127.0.0.1',
    }
    util.kmRequest({
      url: wxCreateOrderUrl,
      data: data,
      success: function (res) {
        if (res.data.status == 1) {
          var order = JSON.parse(res.data.data)
          that.wxPay(JSON.parse(res.data.data)[0]);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  wxPay: function (data) {
    var that = this;
    wx.requestPayment({
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.packageStr,
      signType: data.signType,
      paySign: data.sign,
      success: function (res) {
        if (res.errMsg == 'requestPayment:ok') {
          wx.redirectTo({
            url: '/pages/payment/payment?price=' + that.data.pay
          })
        } else {
          setTimeout(() => {
            wx.showToast({
              title: res.errMsg,
              icon: "none"
            })
          }, 200)
        }
      },
      fail: function (res) {
        if (res.errMsg != null && res.errMsg.indexOf("cancel") > 0) {
          res.errMsg = "取消支付";
        }
        that.setData({
          loading: false
        })
        wx.showToast({
          title: res.errMsg,
          icon: "none"
        })
      }
    })
  },
  //商品确认收货 
  affirm(id) {
    var that = this
    util.kmRequest({
      url: receivedUrl,
      data: {
        orderId: id
      },
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            loding: false,
            hidden: false,
            page: 0,
            totalPage: 0,
            orderlist: null,
          })
          that.orderlist()
          setTimeout(()=>{
            wx.showToast({
              title: '收货成功',
            })
          },400)
        }
      }
    })
  },
  // 线路取消支付
  delete(id) {
    var that = this
    util.kmRequest({
      url: cancelTourOrderUrl,
      data: {
        orderId: id
      },
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            loding: false,
            hidden: false,
            page: 0,
            totalPage: 0,
            ordercircuit: null,
          })
          that.travelorder()
          wx.showToast({
            title: '取消成功',
          })
        }
      }
    })
  },
  goodsdetail(e){
    var that = this
      that.setData({
      orderid:''
      })
      wx.navigateTo({
          url: '/pages/user/orddetail/orddetail?id=' + e.currentTarget.dataset.id,
      })
  },
  circuitdetail(e){
    var that = this
    that.setData({
      orderid: ''
    })
    wx.navigateTo({
      url: '/pages/user/orderstatus/orderstatus?id=' + e.currentTarget.dataset.id,
    })
  },
  payment(payType, id) {
    console.log(payType, id)
    var that = this
    if (app.globalData.kmUserInfo.appBalance >= that.data.pay) {
      var active1 = true
    } else {
      var active1 = false;
    }
    if (payType == 0 || payType == 1) {
      var payWayValue = 1
      var select = true
    } else if (payType == 2) {
      var payWayValue = 2
      var select = false
    }
    that.setData({
      payType: payType,
      payWayValue: payWayValue,
      active1: active1,
      select: select,
      orderid: id,
      checked: true
    })
    that.showModal()
  },
  select(e) {
    var that = this
    if (e.currentTarget.dataset.text === "weixin") {
      that.setData({
        select: true,
        payWayValue: 1
      })
    } else if (e.currentTarget.dataset.text === "yve" && that.data.active1 == true) {
      that.setData({
        select: false,
        payWayValue: 2
      })
    }
  },
  button() {
    var that = this
    if (that.data.payWayValue == 1 && that.data.actives == true && that.data.select == true) {
      that.wxPreOrder(that.data.orderid)
      that.setData({
        loading: true
      })
    } else if (that.data.payWayValue == 2 && that.data.active1 == true && that.data.select == false) {
      that.balance()
      that.setData({
        loading: true
      })
    } else if (that.data.payType == 2 && that.data.active1 == false) {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
    }
  },
  balance() {
    var that = this
    util.kmRequest({
      url: isExistPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          that.setData({
            checked: false,
            title: '输入密码'
          })
        } else if (res.data.status == 0) {
          wx.showModal({
            title: '请先设置支付密码',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/patcode/paycode'
                })
              }
            }
          })
        }
      }
    })
  },
  paybalance() {
    var that = this
    if (that.data.value == '' && that.data.value.length != 6) {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none'
      })
      return
    }
    util.kmRequest({
      url: verifyPayPassWordUrl,
      data: {
        userId: app.globalData.kmUserInfo.id,
        passWord: that.data.value
      },
      method: "post",
      success(res) {
        if (res.data.status == 1) {
          util.kmRequest({
            url: balancePayUrl,
            data: {
              orderId: that.data.orderid
            },
            method: "post",
            success(res) {
              if (res.data.status == 1) {
                wx.redirectTo({
                  url: '/pages/payment/payment?price=' + that.data.pay
                })
              } else {
                setTimeout(() => {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }, 400)
              }
            }
          })
        } else {
          setTimeout(() => {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }, 400)
        }
      }
    })
  },
  focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    if (inputValue.length == 6) {
      that.setData({
        active: true,
        isFocus: false,
      })
    } else {
      that.setData({
        active: false,
        isFocus: true
      })
    }
    that.setData({
      value: inputValue,
    })
  },
  tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  //显示对话框
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
  hide() {
    this.hideModal()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
    currentData: 0,
    page:0,
   })
    this.orderlist()
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
        windowHeight = res.windowHeight-88;
      }
    })
    this.setData({
      windowHeight: windowHeight
    })
    var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[pages.length - 1]; 
    if (that.data.active && that.data.orderid != ''){
      var orderlist = that.data.orderlist
      orderlist.forEach(i=>{
        if (i.id == that.data.orderid){
          orderlist.splice(i,1)
          that.setData({
            orderlist: orderlist
          })
        }
      })
    } else if (that.data.active== false && that.data.orderid != ''){
      var ordercircuit = that.data.ordercircuit
      ordercircuit.forEach(i => {
        if (i.orderId == that.data.orderid) {
          ordercircuit.splice(i, 1)
          that.setData({
            ordercircuit: ordercircuit
          })
        }
      })
    }
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