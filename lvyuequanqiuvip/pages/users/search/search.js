// pages/users/search/search.js
const config = require('../../../config.js')
const registerUserUrl = config.registerUserUrl
const saveMemberWithWxUrl = config.saveMemberWithWxUrl
const queryUserOrderUrl = config.queryUserOrderUrl
var app = getApp()
console.log(app)
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:[
    ],
    currentData: 0,
    list:[],
    list1:[],
    list2:[],
    list3:[],
    list4: [],
    value:'',
    show: false,
    selectData: ['姓名' , '收货地址'],
    index: 0,
    menuTapCurrent: 0,
    isHideLoadMore: true,
    hiddenNone: 'true',
    hiddenNone1: 'true',
    hiddenNone2: 'true',
    hiddenNone3: 'true',
    hiddenNone4: 'true',
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    that.allorders()
  },
  showNone: function () {
    if (this.data.list == null || this.data.list.length == 0) {
      this.setData({
        hiddenNone: ''
      })
    } else {
      this.setData({
        hiddenNone: 'true'
      })
    }
  },
  showNone1: function () {
    if (this.data.list1 == null || this.data.list1.length == 0) {
      this.setData({
        hiddenNone1: ''
      })
    } else {
      this.setData({
        hiddenNone1: 'true'
      })
    }
  },
  showNone2: function () {
    if (this.data.list2 == null || this.data.list2.length == 0) {
      this.setData({
        hiddenNone2: ''
      })
    } else {
      this.setData({
        hiddenNone2: 'true'
      })
    }
  },
  showNone3: function () {
    if (this.data.list3 == null || this.data.list3.length == 0) {
      this.setData({
        hiddenNone3: ''
      })
    } else {
      this.setData({
        hiddenNone3: 'true'
      })
    }
  },
  showNone4: function () {
    if (this.data.list4 == null || this.data.list4.length == 0) {
      this.setData({
        hiddenNone4: ''
      })
    } else {
      this.setData({
        hiddenNone4: 'true'
      })
    }
  },
  allorders :function(){
    var that=this
    util.kmRequest({
      url: queryUserOrderUrl,
      data:{
        tenantId: app.globalData.kmUserInfo.tenantId,
        userName: '',
        orderStatus:'',
        address:''
      },
      success:function(res){
        if(res.data.data != ''){
        var list=JSON.parse(res.data.data) 
        console.log(list)
        console.log(list.length)
        for(var i=0; i<list.length; i++){
          if (list[i].orderStatus == 0) {
            list[i].orderStatus = "未支付"
          }
          if (list[i].orderStatus == 1) {
            list[i].orderStatus = "已支付待发货"
          }
          if (list[i].orderStatus == 2) {
            list[i].orderStatus = "已完成"
          }
          if (list[i].orderStatus == 3) {
            list[i].orderStatus = "已支付待收货"
          }
        }
        that.setData({
          list:list,
        })
        }
        that.showNone()
      }
    })
  },
  checkCurrent1:function(e){
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
     util.kmRequest({
       url: queryUserOrderUrl,
       data:{
         tenantId: app.globalData.kmUserInfo.tenantId,
         userName: '',
         orderStatus: 1,
         address: ''
       },
       success:function(res){
         if(res.data.data != ''){
           var list1 = JSON.parse(res.data.data)
         for (var i = 0; i < list1.length; i++) {
           if (list1[i].orderStatus == 0) {
             list1[i].orderStatus = "未支付"
           }
           if (list1[i].orderStatus == 1) {
             list1[i].orderStatus = "已支付待发货"
           }
           if (list1[i].orderStatus == 2) {
             list1[i].orderStatus = "已完成"
           }
           if (list1[i].orderStatus == 3) {
             list1[i].orderStatus = "已支付待收货"
           }
         }
           that.setData({
             list1: list1,
           })
         }
         that.showNone1()
       }
     })
  },
  checkCurrent2: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    util.kmRequest({
      url: queryUserOrderUrl,
      data: {
        tenantId: app.globalData.kmUserInfo.tenantId,
        userName: '',
        orderStatus: 3,
        address: ''
      },
      success: function (res) {
        if(res.data.data != ''){
        var list2 = JSON.parse(res.data.data)
        console.log(list2)
        for (var i = 0; i < list2.length; i++) {
          if (list2[i].orderStatus == 0) {
            list2[i].orderStatus = "未支付"
          }
          if (list2[i].orderStatus == 1) {
            list2[i].orderStatus = "已支付待发货"
          }
          if (list2[i].orderStatus == 2) {
            list2[i].orderStatus = "已完成"
          }
          if (list2[i].orderStatus == 3) {
            list2[i].orderStatus = "已支付待收货"
          }
        }
        that.setData({
          list2: list2,
        })
        }
        that.showNone2()
      }
    })
  },
  checkCurrent3: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    util.kmRequest({
      url: queryUserOrderUrl,
      data: {
        tenantId: app.globalData.kmUserInfo.tenantId,
        userName: '',
        orderStatus: 0,
        address: ''
      },
      success: function (res) {
        if(res.data.data != ''){
        var list3 = JSON.parse(res.data.data)
        console.log(list3)
        for (var i = 0; i < list3.length; i++) {
          if (list3[i].orderStatus == 0) {
            list3[i].orderStatus = "未支付"
          }
          if (list3[i].orderStatus == 1) {
            list3[i].orderStatus = "已支付待发货"
          }
          if (list3[i].orderStatus == 2) {
            list3[i].orderStatus = "已完成"
          }
          if (list3[i].orderStatus == 3) {
            list3[i].orderStatus = "已支付待收货"
          }
        }
        that.setData({
          list3: list3,
        })
        }
        that.showNone3()
      }
    })
  },
  checkCurrent4: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
    util.kmRequest({
      url: queryUserOrderUrl,
      data: {
        tenantId: app.globalData.kmUserInfo.tenantId,
        userName: '',
        orderStatus: 2,
        address: ''
      },
      success: function (res) {
        if(res.data.data != ''){
        var list4 = JSON.parse(res.data.data)
        console.log(list4)
        for (var i = 0; i < list4.length; i++) {
          if (list4[i].orderStatus == 0) {
            list4[i].orderStatus = "未支付"
          }
          if (list4[i].orderStatus == 1) {
            list4[i].orderStatus = "已支付待发货"
          }
          if (list4[i].orderStatus == 2) {
            list4[i].orderStatus = "已完成"
          }
          if (list4[i].orderStatus == 3) {
            list4[i].orderStatus = "已支付待收货"
          }
        }
        that.setData({
          list4: list4,
        })
        }
        that.showNone4()
      }
    })
  },
  accesstoall:function(){
    util.kmRequest({
      url: queryUserOrderUrl,
      data: {
        tenantId: '',
        userName: '',
        orderStatus:'',
        address: ''
      },
      success:function(res){
      //  console.log(res.data)
      //  console.log(JSON.parse(res.data.data))
      }
    })
  },
  click:function(e){
    var value=e.detail.value;
    this.setData({
      value:value
    })
  },
  suo:function(){
    var that=this
    var index = that.data.index
    var selectData = that.data.selectData[index]
    var value=that.data.value;
    console.log(selectData)
    console.log(value)
    that.setData({
       list:null    
       })
    if (selectData== '姓名'){
      console.log(111111111111)
      util.kmRequest({
        url: queryUserOrderUrl,
        data: {
          tenantId: app.globalData.kmUserInfo.tenantId,
          userName: value,
          orderStatus: '',
          address: ''
        },
        success:function(res){
          if(res.data.data != ''){
          var list= JSON.parse(res.data.data)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            if (list[i].orderStatus == 0) {
              list[i].orderStatus = "未支付"
            }
            if (list[i].orderStatus == 1) {
              list[i].orderStatus = "已支付待发货"
            }
            if (list[i].orderStatus == 2) {
              list[i].orderStatus = "已完成"
            }
            if (list[i].orderStatus == 3) {
              list[i].orderStatus = "已支付待收货"
            }
          }
          that.setData({
            list: list,
          })
          }
          that.showNone()
        }
      })
    } else if (selectData == '收货地址'){
      console.log(666666666666)
      util.kmRequest({
        url: queryUserOrderUrl,
        data: {
          tenantId: app.globalData.kmUserInfo.tenantId,
          userName: '',
          orderStatus:'',
          address: value
        },
        success: function (res) {
          if(res.data.data){
          var list = JSON.parse(res.data.data)
          console.log(list)
          for (var i = 0; i < list.length; i++) {
            if (list[i].orderStatus == 0) {
              list[i].orderStatus = "未支付"
            }
            if (list[i].orderStatus == 1) {
              list[i].orderStatus = "已支付待发货"
            }
            if (list[i].orderStatus == 2) {
              list[i].orderStatus = "已完成"
            }
            if (list[i].orderStatus == 3) {
              list[i].orderStatus = "已支付待收货"
            }
          }
          that.setData({
            list: list,
          })
          }
          that.showNone()
        }
      })
    }
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
    this.allorders();
    // this.accesstoall();
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