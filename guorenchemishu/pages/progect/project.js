const config = require('../../config.js')
const util = require('../../utils/util.js')
const WxParse = require('../../wxParse/wxParse.js');
const getRepairInfoUrl = config.getRepairInfoUrl
const getCommentsUrl = config.getCommentsUrl
const getCarGoodsBySplIdUrl = config.getCarGoodsBySplIdUrl
const getOrdersByUserIdUrl = config.getOrdersByUserIdUrl
const getCarOilsBySpecAndBrandIdUrl = config.getCarOilsBySpecAndBrandIdUrl
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalloading:true,
    isHideLoadMore:true,
    hiddenNone: 'true',
    hiddenNones: 'true',
    loadmore:false,
    selectItem:null,
    list:null,
    oil:null,
    price:0,
    num:0,
    goods:null,
    currentData:0,
    active:false,
    editor:false,
    entity:null,
    loading:false,
    commentsList:null,
    maintenance:null,
    hiddenNone:true,
    clickstate:'点击展开',
    projectid:'',
    page:0,
    index:'',
  },
  serviceproject(){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: getCarGoodsBySplIdUrl,
       param:{
         splId: app.globalData.carInfo.splId,
         repairId: that.data.selectItem.id
       }
     },
     success:function(res){
       if(res.data.status == 1){
         var list = JSON.parse(res.data.data)
         var prices = 0
         var num = 0
         for(var i=0; i<list.length; i++){
           list[i].active = false
           list[i].show = false
           list[0].active = true
         }
         for (var j = 0; j < list[0].carGoods.length; j++) {
          //  if (list[0].carGoods[j].goodsPackage === '1L' && list[0].carGoods[j].num==0){
          //    list[0].carGoods.splice(j,1)
          //  }
           prices += list[0].carGoods[j].sellingPrice * list[0].carGoods[j].num
           console.log(prices)
           num += list[0].carGoods[j].num
         }
         var price = prices.toFixed(2)
         that.setData({
           list:list,
           price:price,
           num:num,
         })
         that.addition1L()
       }else if(res.data.status == 6){

       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
       }
       if (that.data.list == null || that.data.list.length == 0) {
         that.setData({
           hiddenNone: '',
           showModalloading: false,
         })
       } else {
         that.setData({
           hiddenNone: 'true',
           showModalloading: false,
         })
       }
     }
   })
  },
  //判断是否显示添加1L装
  addition1L(){
    var that = this
    var list = that.data.list
    var oil =[]
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].carGoods.length; j++) {
        if (list[i].carGoods[j].goodsPackage === '1L') {
          oil.push(list[i].carGoods[j])
        } else if (list[i].carGoods[j].goodsPackage === '4L') {
          oil.push(list[i].carGoods[j])
        }
      } 
    }
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].carGoods.length; j++) {
        if (oil.length == 2) {
          if (list[i].carGoods[j].oil != undefined && list[i].carGoods[j].oil == 4){
            list[i].carGoods[j].oil = null
          }
        } else if (oil.length == 1) {
          if (list[i].carGoods[j].id == oil[0].id && oil[0].goodsPackage === '4L') {
            list[i].carGoods[j].oil = 4
          }
        }
      }
    }
    that.setData({
      list:list,
      oil:oil
    })
  },
  maintenance(e){
    var that = this
    var list = that.data.list
    var lists = list[e.currentTarget.dataset.index]
    for(var i= 0; i<list.length; i++){
      if(list[i].id == lists.id){
        if (list[i].active == true){
          list[i].active = false
          list[i].show = false
          that.calculateprice()
        }else{
          list[i].active = true
          if (list[i].carGoods.length == 1 && list[i].carGoods[0].id == 0){
            that.mainproject(lists.id)
          }else{
            that.calculateprice()
          }
        }
      }
    }
    that.setData({
      list:list
    })
  },
  //点击时没有都删完重新计算价格
  calculateprice(){
    var that = this
    var list = that.data.list
    var prices = 0
    var num = 0
    for(var i=0; i<list.length; i++){
      for (var j = 0; j < list[i].carGoods.length; j++){
        if (list[i].active == true) {
            prices += list[i].carGoods[j].sellingPrice * list[i].carGoods[j].num
            num += list[i].carGoods[j].num
        }
      }
    }
    var price = prices.toFixed(2)
    that.setData({
      list: list,
      price: price,
      num: num
    })
  }, 
  //删除完之后点击重新获取数据计算
  mainproject(lists){
    var that = this
    var list = that.data.list 
    util.kmRequest({
      data: {
        interfaceName: getCarGoodsBySplIdUrl,
        param:{
          splId: app.globalData.carInfo.splId,
          repairId: that.data.selectItem.id
        }
      },
      success(res){
        if(res.data.status == 1){
          var project = JSON.parse(res.data.data)  
          for(var i=0; i<list.length; i++){
            if (list[i].id == lists){
            for (var j = 0; j < project.length; j++){
              if (list[i].id == project[j].id){
                list[i] = project[j]
                list[i].active = true
                list[i].show = false
              }
            }
           }
          }
          that.setData({
            list:list
          })
          that.calculateprice()
          that.addition1L()
        }
      }  
    })
  }, 
  maintenancerecord(){
    var that = this
   util.kmRequest({
     url: getOrdersByUserIdUrl,
     data:{
       interfaceName: getOrdersByUserIdUrl,
       param:{
         carId: app.globalData.carInfo.id
       }
     },
     success:function(res){
       if(res.data.status == 1){
         var maintenance = JSON.parse(res.data.data)
         console.log(maintenance)
         if (maintenance.length >= 2){
           var history = maintenance[1].recordList
           for (var i = 0; i < history.length; i++) {
             var time = history[i].orderTime.slice(0, 10)
             history[i].time1 = time
           }
         }
         that.setData({
           maintenance: maintenance
         })
       }else if(res.data.status == 6){

       }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
       }
     }
   })
  },
  editor(e){
    var that = this
    var list = that.data.list
    var lists = list[e.currentTarget.dataset.index]
    for (var i = 0; i < list.length; i++) {
      if (list[i].active == true){
        if (list[i].id == lists.id) {
          list[i].show = true
        }
      }
    }
    that.setData({
      list: list
    })
  },
  determine(e){
    var that = this
    var list = that.data.list
    var prices = 0
    var num = 0
    var lists = list[e.currentTarget.dataset.index]
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == lists.id) {
        list[i].show = false
      }
      for (var j = 0; j < list[i].carGoods.length; j++) {
          if (list[i].active == true) {
            prices += list[i].carGoods[j].sellingPrice * list[i].carGoods[j].num
            num += list[i].carGoods[j].num
          }
        }
    }
    var price = prices.toFixed(2)
    that.setData({
      price: price,
      num: num,
      list: list
    })
  },
  an(){
   var that = this
    if(that.data.active == false){
      that.setData({
        active: true,
        clickstate: '点击收起'
      })
    }else{
      that.setData({
        active: false,
        clickstate: '点击展开'
      })
    }
  },
  checkCurrent(e){
    var current = e.currentTarget.dataset.index
    this.setData({
      currentData: current,
      scrollLeft: current
    })
  },
  eventchange: function (e) {
  var current = e.detail.current
   this.setData({
     currentData: current,
     scrollLeft: current
   })
  },
  details(repairId){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getRepairInfoUrl,
        param:{
          repairId: repairId
        }
      },
      success:function(res){
        if(res.data.status == 1){
          var img1 = 'img1'
          var img2 = 'img2'
          var entity = JSON.parse(res.data.data)[0]
          var stars = new Array();
          var count = parseInt(Math.round(entity.evaluate));
          for (var j = 0; j < count; j++) {
            stars.push(img1);
          }
          if (stars.length < 5){
            var sta = 5 - stars.length
            console.log(sta)
            for(var i= 0; i<sta; i++){
              stars.push(img2)
            }
          }
          entity.stars = stars;
        }
        let ceshi = entity.repairDesc;
        WxParse.wxParse('article', 'html', ceshi, that, 5); 
        that.setData({
          entity: entity
        })
      }
    })
  },
  commentsRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getCommentsUrl,
        param:{
          repairId: that.data.selectItem.id,
          pageNum: that.data.page
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var img1 = 'img1'
          var img2 = 'img2'
          var list = JSON.parse(res.data.data);
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var time = item.createTime
            item.time = time.slice(0,10)
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
            if(item.stars.length <5){
              var str = 5 - item.stars.length
              for(var s=0; s<str; s++){
                item.stars.push(img2)
              }
            }
          }
          if (that.data.commentsList != null){
            var evaluationlist = that.data.commentsList
            var list = evaluationlist.concat(list)
          }
          that.setData({
            commentsList: list
          });
        }else if(res.data.status == 6){
          if(that.data.page > 0){
            that.setData({
              page: that.data.page - 1,
              loadmore:true
            });
          }
        }
      }
    })
  },
  scroll(){
   var that = this
    if (that.data.loadmore == false && that.data.isHideLoadMore == true ){
      that.setData({
        isHideLoadMore: false,
      })
      setTimeout(() => {
        that.setData({
          isHideLoadMore: true,
          page:that.data.page+1
        })
        that.commentsRequest()
      },1000)
    }
  },
  btn(){
  var that = this
  var price = that.data.price
  var num = that.data.num
  delete that.data.entity.repairDesc;
  var entity = that.data.entity
  var order= []
  var list = that.data.list
  for(var i=0; i<list.length; i++){
    if(list[i].active == true){
      order.push(list[i])
    }
  }
  if(price == 0 && num == 0){
    wx.showToast({
      title: '请选择保养项目',
      icon:'none'
    })
  }else{
    that.setData({
      loading:true
    })
    wx.navigateTo({
      url: '/pages/order/order?order=' + JSON.stringify(order) + '&entity=' + JSON.stringify(entity) ,
    })
  }
  },
  phone(){
    wx.showModal({
      content:'400-992-5550',
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
  phones(e){
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
  address(){
    var that = this
    delete that.data.entity.repairDesc;
    var list = that.data.entity
    wx.openLocation({
      latitude: list.lat,
      longitude: list.lon,
      scale: 18,
      name: list.repairName,
      address: list.address
    })
  },
  replace(e){
  var that = this
  var list = that.data.list
  this.setData({
    projectid: e.currentTarget.dataset.id,
    index: e.currentTarget.dataset.index,
    goods:null
  })
  for(var i=0; i<list.length; i++){
    for (var j = 0; j < list[i].carGoods.length; j++){
      if (list[i].id == e.currentTarget.dataset.id){
        var goodslist = list[i].carGoods[e.currentTarget.dataset.index]
      }
    }
  }
   wx.navigateTo({
     url: '/pages/goodslist/goodslist?id=' + e.currentTarget.dataset.id + '&goodslist=' + JSON.stringify(goodslist) + '&repairId=' + that.data.selectItem.id + '&oil='+JSON.stringify(that.data.oil)
   })
  },
  //点击添加1L装 
  addition(e){
    console.log(e)
      var that = this
      var list = that.data.list
      for(var i=0; i<list.length; i++){
        if (list[i].id == e.currentTarget.dataset.id){
          var oilspec = list[i].carGoods[e.currentTarget.dataset.index]
        }
      }
      var goodsoil = null
      util.kmRequest({
        data:{
          interfaceName: getCarOilsBySpecAndBrandIdUrl,
          param:{
            splId: app.globalData.carInfo.splId,
            brandId: oilspec.brandId,
            spec: oilspec.spec,
            viscosity: oilspec.viscosity,
            catLvl: oilspec.catLvl
          }
        
        },
        method:"post",
        success(res){
          if(res.data.status == 1){
            var oillist = JSON.parse(res.data.data)[0]
            console.log(oillist)
            for (var i = 0; i < list.length; i++) {
              if (list[i].id == e.currentTarget.dataset.id) {
                var oil4 = list[i].carGoods[e.currentTarget.dataset.index]
                var length = list[i].carGoods.length - 1
                goodsoil = oillist
                goodsoil.num = 1
                list[i].carGoods.splice(length, 0, goodsoil)
                }
            }
           }else if(res.data.status == 6){

           }else{
             wx.showToast({
               title: res.data.msg,
               icon:'none'
             })
           }
          that.setData({
            list: list
          })
          that.calculateprice()
          that.addition1L()
        }
      })
  },
  delete(e){
  console.log(e)
  var that = this
  var list = that.data.list
  for(var i=0; i<list.length; i++){
      if (list[i].id == e.currentTarget.dataset.id) {
        list[i].carGoods.splice(e.currentTarget.dataset.index, 1)
      if (list[i].carGoods.length == 1 && list[i].carGoods[0].id == 0){
        list[i].active = false
        list[i].show = false
      }
    }
  }
  that.setData({
    list:list
  })
  that.price()
  that.addition1L()
  },
  subtract(e){
   var that = this
    var list = that.data.list
    for(var i=0; i<list.length; i++){
      if (list[i].id == e.currentTarget.dataset.id){
        if (list[i].carGoods[e.currentTarget.dataset.index].num == 1){
          list[i].carGoods[e.currentTarget.dataset.index].num =1
        }else {
          var num = list[i].carGoods[e.currentTarget.dataset.index].num -1
          list[i].carGoods[e.currentTarget.dataset.index].num = num
        }
       
      }
    }
    that.setData({
      list:list
    })
    that.price()
  },
  add(e){
    console.log(e)
    var that = this
    var list = that.data.list
    for (var i = 0; i < list.length; i++) {
      if (list[i].id == e.currentTarget.dataset.id) {
        var num = list[i].carGoods[e.currentTarget.dataset.index].num +1
        list[i].carGoods[e.currentTarget.dataset.index].num = num
      }
    }
    that.setData({
      list: list
    })
    that.price()
  },
  price(){
   var that = this
    var list = that.data.list
    var prices = 0
    var num = 0
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].carGoods.length; j++) {
        if (list[i].active == true) {
          prices += list[i].carGoods[j].sellingPrice * list[i].carGoods[j].num
          num += list[i].carGoods[j].num
        }
      }
    }
    var price = prices.toFixed(2)
    that.setData({
      price: price,
      num: num,
      list: list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var selectItem = JSON.parse(options.selectItem)
    this.setData({
      selectItem: selectItem
    })
    this.details(selectItem.id)
    this.serviceproject()
    this.maintenancerecord()
    this.commentsRequest()
    
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
    var pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    var prevPage = pages[pages.length - 1];
    if (app.globalData.carInfo != null){
      wx.setNavigationBarTitle({
        title: app.globalData.carInfo.fctName + '—' + app.globalData.carInfo.brName
      })
    }
    var windowHeight = ''
    wx.getSystemInfo({
      success: function (res) {
        windowHeight = res.windowHeight-46;
      }
    })
    that.setData({
      windowHeight: windowHeight,
      loading:false
    })
    if(that.data.goods != null){
     var prices = 0
     var num = 0
     var list = that.data.list
     var goods = that.data.goods
      console.log(goods)
      for (var i = 0; i < goods.length; i++){
          for(var j=0; j<list.length; j++){
            if (list[j].id == that.data.projectid){
              for (var s = 0; s < list[j].carGoods.length; s++){
                if (goods[i] != null) {
                if (goods[i].goodsPackage != null && goods[i].goodsPackage !='' && goods[i].goodsPackage != undefined){
                  if (list[j].carGoods[s].goodsPackage == goods[i].goodsPackage) {
                      list[j].carGoods[s] = goods[i]
                    console.log(goods[i])
                  } else if ((list[j].carGoods[s].goodsPackage != null && list[j].carGoods[s].goodsPackage != '') && (list[j].carGoods[s].goodsPackage != goods[i].goodsPackage) && (that.data.oil.length == 1)){
                    list[j].carGoods.splice(s+1, 0, goods[i])
                  }
                  // if (list[j].carGoods[s].num == 0 && goods[i].num ==0){
                  //   list[j].carGoods.splice(s,1)
                  // }
                }else{
                  list[j].carGoods[that.data.index] = goods[i]
                }
              }else{
                  if ((list[j].carGoods[s].goodsPackage != null && list[j].carGoods[s].goodsPackage != '' && list[j].carGoods[s].goodsPackage == '4L' && that.data.oil.length == 2)){
                    list[j].carGoods.splice(s+1,1)
                }
              }
            }
          }
        }
      }
    for(var i=0; i< list.length; i++){
      for (var j = 0; j < list[i].carGoods.length ;j++){
        if (list[i].id == that.data.projectid){
        if (list[i].carGoods[j].goodsPackage === '1L'){
          var goodsPackage1 = list[i].carGoods[j]
          var s1 = j
        } else if (list[i].carGoods[j].goodsPackage === '4L'){
          var goodsPackage4 = list[i].carGoods[j]
          var s2 = j
        }
        if (s2 > s1){
          list[i].carGoods[s1] = goodsPackage4
          list[i].carGoods[s2] = goodsPackage1
         }
        }
        if (list[i].active == true) {
          prices += list[i].carGoods[j].sellingPrice * list[i].carGoods[j].num
          num += list[i].carGoods[j].num
        }
      }
     }
    var price = prices.toFixed(2)
    that.setData({
      list: list,
      price: price,
      num: num
    })
    that.addition1L()
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