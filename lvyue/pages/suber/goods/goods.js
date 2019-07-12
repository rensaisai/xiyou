
const config=require('../../../config.js')
const getGoodsInfoByGoodsIdUrl = config.getGoodsInfoByGoodsIdUrl
const getGoodsAttrConfigsUrl = config.getGoodsAttrConfigsUrl
const getStockByGoodsIdAndAttrIdUrl = config.getStockByGoodsIdAndAttrIdUrl
const getXYOpenIdUrl = config.getXYOpenIdUrl
const loginByOpenIdUrl = config.loginByOpenIdUrl
const getAllCommentsUrl = config.getAllCommentsUrl
const likeCommentUrl = config.likeCommentUrl
const cancelLikeCommentUrl = config.cancelLikeCommentUrl
var app=getApp()
console.log(app)
var util=require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,//是否显示
    evaluate:null,
    totalCount:0,
    reputably:'',
    // userType: '',
    price:0,
    isRun:'',
    shops:null,
    imgs:null,
    goodsSource:'',
    goodsstatus:'ru',
    runType:'',
    runTimeId:'',
    maxNum:'',
    runId:'',
    shoplist:null,
    goodsdard:[],
    states:0,
    stae:0,
    num: 1,
    activity:'',
    save:'',
    // shposcolor:null,
    // shopsize:null,
    // colorid:'',
    // sizeid:'',
    standard:'',
    repertory:null,
    active:false,
    id:'',
    // chit:'',
    // goodscolor:'',
    // shopsize:''
    islike: [],
  },
  openid() {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          util.kmRequest({
            url: getXYOpenIdUrl,
            data: {
              code: res.code
            },
            success: function (res) {
              console.log(res)
              if (res.errMsg == "request:ok") {
                var open = JSON.parse(res.data.data)
                app.globalData.openid = open.openid
                util.kmRequest({
                  url: loginByOpenIdUrl,
                  data: {
                    openId: open.openid,
                  },
                  success: function (res) {
                    console.log(res)
                    if (res.data.status == 1) {
                      var user = JSON.parse(res.data.data)[0];
                      app.globalData.kmUserInfo = user
                      that.showModal()
                    }
                    if (res.data.status == 4) {
                      wx.navigateTo({
                        url: '/pages/user/register/register',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  //商品详情 
  commodity: function (id) {
    var that = this
    if (that.data.runType != '') {
      if (that.data.runTimeId == 'undefined' || that.data.runTimeId == ''){
        var runTimeId = ''
      }else{
        var runTimeId = that.data.runTimeId
      }
      var data = {
        goodsId: id,
        goodsSource: that.data.goodsstatus,
        runId: that.data.runId,
        runTimeId: runTimeId,
        source: 'ru',
      }
    } else {
      var data = {
        goodsId: id,
        goodsSource: that.data.goodsSource,
      }
    }
    util.kmRequest({
      url: getGoodsInfoByGoodsIdUrl,
      data:data,
      success: function (res) {
        if (res.data.status == 1) {
          var goods = JSON.parse(res.data.data)[0]
          var imgs=[]
          var img=goods.img
          var imgs=img.split(',')
          if (app.globalData.kmUserInfo == null){
            var price = goods.fansPrice
          }else{
            if (app.globalData.kmUserInfo.isApp == 1) {
              var price = goods.fansPrice
              var save = price - goods.memberPrice
            } else if (app.globalData.kmUserInfo.isApp > 1) {
              var price = goods.memberPrice
              var save = ''
            } 
          }
          that.setData({
            shops: goods,
            imgs: imgs,
            price: price,
            img: imgs[0],
            save: save
          })
        }
      }
    })
  },
  //获取商品规格 
  models:function(id){
    var that=this
     util.kmRequest({
       url: getGoodsAttrConfigsUrl,
       data:{
         goodsId:id,
       },
       success:function(res){
         if(res.data.status == 1){
           var shoplist=JSON.parse(res.data.data)
           that.setData({
             shoplist: shoplist,
           })
           }
           } 
     })
  },
    // 商品颜色
  goodcolor:function(e){
    var that=this
    var shoplist = that.data.shoplist
    console.log(shoplist)
    var goodsdard = that.data.goodsdard 
    for (var i = 0; i < shoplist.length; i++){
      for (var j = 0; j < shoplist[i].specList.length; j++){
        if (shoplist[i].title == e.currentTarget.dataset.title) {
          shoplist[i].specList[j].checked = false
          var standard = shoplist[i].specList[e.currentTarget.dataset.index]
          standard.checked = true
          goodsdard.push(standard)
      }
     }
    }
    var goods = []
    var index = []
    for (var i = 0; i < goodsdard.length; i++){
      for (var j = i + 1; j < goodsdard.length; j++){
        if (goodsdard[i].attrId == goodsdard[j].attrId || goodsdard[i].attrName == goodsdard[j].attrName){
          i++;
          j = i
        }
      }
      goods.push(goodsdard[i])
      index.push(i)
    }
    that.setData({
      shoplist: shoplist,
      goodsdard: goods
    })
    if (shoplist.length == goods.length) {
      that.shopstandard()
    } 
  },
//  拼接规格id
  shopstandard:function(){
    var that = this
    var standard = ''
    var goodsdard = that.data.goodsdard
    for (var i = 0; i < goodsdard.length; i++){
      standard += goodsdard[i].attrId+','
    }
    that.setData({
      standard: standard
    })
    that.repertory()
  },
  click:function(){
    if (app.globalData.kmUserInfo == null) {
      this.openid()
      return
    }
    this.showModal()
  },
  serve:function(){
    if (app.globalData.kmUserInfo == null){
      this.openid()
      return
    }
    this.showModal()
  },
  aptitude:function(){
    if (this.data.shops.supplierImg != undefined && this.data.shops.supplierImg != null && this.data.shops.supplierImg != ''){
      wx.navigateTo({
        url: '/pages/suber/business/business?img=' + this.data.shops.supplierImg,
      })
    } 
  },

  // 判断库存
  repertory:function(){
    var that=this
    if (that.data.runType != ''){
      var data = {
        goodsId: that.data.id,
        attrId: that.data.standard,
        source: 'ru',
        goodsSource: that.data.goodsstatus
      }
    }else{
      var data = {
        goodsId: that.data.id,
        attrId: that.data.standard,
        goodsSource: that.data.goodsSource,
      }
    }
    util.kmRequest({
      url: getStockByGoodsIdAndAttrIdUrl,
      data:data,
      success: function (res) {
        if(res.data.status==1){
          var repertory=JSON.parse(res.data.data)[0]
          console.log(repertory)
          var shoplist = that.data.shoplist
          console.log(shoplist)
          var goodsdard = that.data.goodsdard
          if (app.globalData.kmUserInfo.isApp == 1) {
            var price = repertory.fansPrice
          } else if (app.globalData.kmUserInfo.isApp > 1) {
            var price = repertory.memberPrice
          }
          if (repertory.stockNum <= 0){
            for (var i = 0; i < shoplist.length; i++){
              for (var j = 0; j < shoplist[i].specList.length; j++)
                shoplist[i].specList[j].checked = false
            }
            console.log(shoplist)
            that.setData({
              shoplist: shoplist,
              goodsdard:[]
            })
            wx.showToast({
              title:'库存不足',
              icon:'none'
            })
          }else{
            that.setData({
              repertory: repertory,
            })
          }
          that.setData({
            price:price,
            img:repertory.img
          })
        }
      }
    })
  },
  purchase: function () {
    var that = this
    var data = {
      goodsName: that.data.shops.goodsName,
      goodsdetails: that.data.repertory,
      goodsdard: that.data.goodsdard,
      goodsid: that.data.shops.id,
      num:that.data.num,
      price:that.data.price,
      supplier: that.data.shops.supplier
    }
    if (that.data.goodsdard.length != that.data.shoplist.length){
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
    } else if (that.data.goodsdard.length == that.data.shoplist.length && that.data.isRun == 3){
      wx.showToast({
        title: '活动未开启,请稍后再试',
        icon:'none'
      })
      return
    }else if (that.data.goodsdard.length == that.data.shoplist.length){
      wx.navigateTo({
        url: '/pages/suber/place/place?data=' + JSON.stringify(data) + '&runType=' + that.data.runType + '&runTimeId=' + that.data.runTimeId
      })
    }
  },
  close:function(){
    this.hideModal()
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
    var that = this
    var goods = that.data.shops
    if (app.globalData.kmUserInfo == null) {
      var price = goods.fansPrice
    } else {
      if (app.globalData.kmUserInfo.isApp == 1) {
        var price = goods.fansPrice
        var save = price - goods.memberPrice
      } else if (app.globalData.kmUserInfo.isApp > 1) {
        var price = goods.memberPrice
        var save = ''
      }
    }
    that.setData({
      price: price,
      save: save,
    })
  },
  add:function(){
    var that = this
    if (that.data.goodsdard.length != that.data.shoplist.length) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
      return
    } 
    var num = that.data.num;
     var numbe=num+1
    if (that.data.maxNum != '' && that.data.maxNum < numbe){
      var numbe = that.data.maxNum
      wx.showToast({
        title: "活动商品最多可购买" + numbe + "件",
        icon: "none"
      })
    }
    that.setData({
       num: numbe,
     })
  },
  subtract:function(){
    if (this.data.goodsdard.length != this.data.shoplist.length) {
      wx.showToast({
        title: "请选择规格",
        icon: "none"
      })
      return
    } 
    var num = this.data.num;
    var numbe = num - 1
    if(num <= 1){
      var numbe = 1
    }else{
    }
    this.setData({
      num: numbe,
    })
  },
  imges:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current:current,
      urls: this.data.imgs,
    })
  },
  reasonable:function(){
    var fansPrice = this.data.shops[0].fansPrice
    var img=this.data.imgs[0]
    var data = ({fansPrice, img})
    console.log(data)
    this.setData({
      repertory: data 
    })
  },
  evaluate(id){
   var that = this
   util.kmRequest({
     url: getAllCommentsUrl,
     data:{
       busiId:id,
       busiType:0,
       userId: app.globalData.kmUserInfo.id,
       page:1,
     },
     method:"post",
     success:(res)=>{
       console.log(res)
       if(res.data.status == 1){
         var evaluate = JSON.parse(res.data.data)[0].pageData[0].data
         var reputably = JSON.parse(res.data.data)[0].pageData[0].favorableRate
         var totalCount = JSON.parse(res.data.data)[0].totalCount
         console.log(evaluate)
         if (evaluate.length > 3){ 
           var evaluate = evaluate.slice(0,3)
         }
         that.setData({
           evaluate: evaluate,
           totalCount: totalCount,
           reputably: reputably
         })
       }
     }
   })
  },
  allcomment(){
    var that = this
    that.data.islike = []
    wx.navigateTo({
     url: '/pages/evaluate/evaluate?id='+that.data.id+'&type='+1,
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    if (options.runType != undefined){
      if (options.runType  == 1){
        var activity = '限时购'
      }else{
        var activity = '限量购'
      }
      var runType = options.runType
      var runTimeId = options.runTimeId
      var isRun = options.isRun
      var maxNum = options.maxNum
      var runId = options.runId
      console.log()
    }else{
      var runType = ''
      var runTimeId = ''
      var isRun = ''
      var maxNum = ''
      var activity = ''
      var runId = ''
     }
    console.log(options.source)
    if (options.source == undefined){
      var goodsSource= 'sc'
    }else{
      var goodsSource = options.source
    }
    this.setData({
      id:id,
      goodsSource: goodsSource,
      runType: runType,
      runTimeId: runTimeId,
      isRun: isRun,
      maxNum: maxNum,
      isApp: app.globalData.kmUserInfo.isApp,
      activity:activity,
      runId: runId,
    })
    this.commodity(id)
    this.models(id)
    this.evaluate(id)
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
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length -1] //获取当前页面的对象
    console.log(currentPage)
    if (currentPage.data.islike.length > 0){
      currentPage.data.islike.forEach((i)=>{
        if (i.isLile == 1){
          util.kmRequest({
            url: likeCommentUrl,
            data: {
              userId: app.globalData.kmUserInfo.id,
              commentId: i.commentId
            },
            method: "post",
            success: (res) => {
              console.log(res)
            }
          })
        }else{
          util.kmRequest({
            url: cancelLikeCommentUrl,
            data: {
              userId: app.globalData.kmUserInfo.id,
              commentId: i.commentId
            },
            method: "post",
            success: (res) => {
              console.log(res)
            }
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