const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const upng = require('../../../utils/upng.js')
const getOrderInfoUrl = config.getOrderInfoUrl
const getTechnicianByRepairIdUrl = config.getTechnicianByRepairIdUrl
const uploadCommentImgsUrl = config.uploadCommentImgsUrl
const saveMaintainUrl = config.saveMaintainUrl
const hostimg1 = config.hostimg1
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var context1 = null;
var isButtonDown = false;//是否在绘制中
var isButtonDown1 = false;
var arrx = [];//动作横坐标
var arry = [];//动作纵坐标
var arrz = [];//总做状态，标识按下到抬起的一个组合
var arrx1 = [];//动作横坐标
var arry1 = [];//动作纵坐标
var arrz1 = [];//总做状态，标识按下到抬起的一个组合
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shows: false,
    loading:false,
    indexs:'',
    details:null,
    technician:null,
    technicianid:'',
    // tempFilePaths:'',
    kilometre:'',
    // img:'',
    img1:'',
    img2:'',
    vin:'',
  },
  particulars(orderid){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getOrderInfoUrl,
        param:{
          orderId: orderid
        }
      },
      success:function(res){
        console.log(res.data)
        if(res.data.status == 1){
          var details = JSON.parse(res.data.data)[0]
          console.log(details)
          var service ='' 
          for (var i = 0; i < details.itemsList.length; i++){
           service += details.itemsList[i].itemName + ','+' '
          }
          details.service = service
          that.setData({
            details: details
          })
        }
      }
    })
  },
  technician(){
   var that = this
   util.kmRequest({
     data:{
       interfaceName: getTechnicianByRepairIdUrl,
       param:{
         repairId: app.globalData.kmUserInfo.repairId,
       }
     },
     success:(res)=>{
       if(res.data.status == 1){
         var technician = JSON.parse(res.data.data)
         console.log(technician)
         that.setData({
           technician: technician
         })
       }
     }
   })
  },
  amend(){
   wx.navigateTo({
     url: '/pages/order/amend/amend?carSplName=' + this.data.details.carSplName + '&carNo=' + this.data.details.carNo,
   })
  },
  selectTaps() {
    this.setData({
      shows: !this.data.shows
    });
  },
  optionTaps(e) {
    var technician = this.data.technician
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let technicianid = technician[e.currentTarget.dataset.index].id
    this.setData({
      indexs: Index,
      technicianid: technicianid,
      shows: !this.data.shows
    });
  },
 
  uploadingimg1() {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function (res) {
        wx.uploadFile({
          url: config.hostimg,
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            // type: 'qm'
            projectName: 'cmsweb',
            folderName: 'imgs/repairs/qmImg',
            waterTypes: 0,
            type: 0,
            businessType: uploadCommentImgsUrl,
            expirationDate: 0,
            source: 'wx_jd'
          },
          success: function (res) {
            var image = JSON.parse(res.data)
            var img = image.data
            if (image.status == 1) {
              wx.showToast({
                title: '上传成功',
                icon: 'none',
              })
              that.setData({
                img1: img
              })
              that.uploadingimg2()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  uploadingimg2() {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas1',
      success: function (res) {
        wx.uploadFile({
          url: config.hostimg,
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            projectName: 'cmsweb',
            folderName: 'imgs/repairs/qmImg',
            waterTypes: 0,
            type: 0,
            businessType: uploadCommentImgsUrl,
            expirationDate: 0,
            source: 'wx_jd'
          },
          success: function (res) {
            var image = JSON.parse(res.data)
            var img = image.data
            if (image.status == 1) {
              wx.showToast({
                title: '上传成功',
                icon: 'none',
              })
              that.setData({
                img2: img
              })
            that.submer()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
            }
          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
      },
    })
  },
  kilometre(e){
   console.log(e)
   this.setData({
     kilometre: e.detail.value
   })
  },
  framevin(e){
    this.setData({
      vin: e.detail.value
    })
  },
  btn(){
   var that = this
   var err = ''
    if (that.data.kilometre == ''){
       err = '请输入公里数'
    } else if (that.data.vin == '' && that.data.details.carVin == null){
        err = '请输入车架号'
    } else if (!util.onblurjs(that.data.vin) && that.data.details.carVin == null){
      err = '车架号格式错误'
    }else if (that.data.technicianid == ''){
      err = '请选择技工'
    } else if(arrx.length ==0){
      err='签名内容不能为空'
    } else if (arrx1.length == 0) {
      err = '签名内容不能为空'
    }
    if(err.length >0){
     wx.showToast({
       title: err,
       icon:'none'
     })
     return
    }
    that.uploadingimg1()
  },
  submer(){
   var that = this
    if (that.data.vin == ''){
      var vin = ''
   }else{
      var vin = that.data.vin
   }
   that.setData({
     loading:true
   })
   util.kmRequest({ 
     data:{
       interfaceName: saveMaintainUrl,
       param:{
         orderId: that.data.details.id,
         userId: that.data.details.userId,
         km: that.data.kilometre,
         xczImg: vin,
         userCarId: that.data.details.userCarId,
         repairId: that.data.details.repairId,
         userSign: that.data.img1,
         technicianSign: that.data.img2,
         technicianId: that.data.technicianid
       }
     },
     success:function(res){
       if(res.data.status == 1){
          wx.showToast({
            title: '提交成功',
          })
          setTimeout(function(){
            wx.reLaunch({
              url:'/pages/index/index'
            })
          },500)
       }else{
         that.setData({
           loading:false
         })
       }
     }
   })
  },
  //事件监听
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasIdErrorCallback1: function (e) {
    console.error(e.detail.errMsg)
  },
  //开始
  canvasStart: function (event) {
    console.log(event)
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  canvasStart1: function (event) {
    console.log(event)
    isButtonDown1 = true;
    arrz1.push(0);
    arrx1.push(event.changedTouches[0].x);
    arry1.push(event.changedTouches[0].y);
  },
  //过程
  canvasMove: function (event) {
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);

    };
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };

    };
    // context.clearRect(0, 0, canvasw, canvash);
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(false);
  },
  canvasEnd: function (event) {
    isButtonDown = false;
  },
  canvasMove1: function (event) {
    if (isButtonDown1) {
      arrz1.push(1);
      arrx1.push(event.changedTouches[0].x);
      arry1.push(event.changedTouches[0].y);

    };
    for (var i = 0; i < arrx1.length; i++) {
      if (arrz1[i] == 0) {
        context1.moveTo(arrx1[i], arry1[i])
      } else {
        context1.lineTo(arrx1[i], arry1[i])
      };

    };
    // context.clearRect(0, 0, canvasw, canvash);
    context1.setStrokeStyle('#000000');
    context1.setLineWidth(4);
    context1.setLineCap('round');
    context1.setLineJoin('round');
    context1.stroke();
    context1.draw(false);
  },
  canvasEnd1: function (event) {
    isButtonDown1 = false;
  },
  //清除画布
  cleardraw: function () {
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    // context.clearRect(0, 0, canvasw, canvash);
    context.draw(false);
  },
  cleardraw1: function () {
    //清除画布
    arrx1 = [];
    arry1 = [];
    arrz1 = [];
    // context.clearRect(0, 0, canvasw, canvash);
    context1.draw(false);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.particulars(options.orderid)
    this.technician()
    var that = this
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context1 = wx.createCanvasContext('canvas1');
    context1.beginPath()
    context1.setStrokeStyle('#000000');
    context1.setLineWidth(4);
    context1.setLineCap('round');
    context1.setLineJoin('round');
  },
  sweep(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        console.log(tempFilePaths)
        that.uploadings(tempFilePaths)
      }
    })
  },
  uploadings(img) {
    wx.showToast({
      title: '识别中',
    })
    var that = this
    wx.uploadFile({
      url: hostimg1,
      filePath: img,
      name: 'file',
      formData: {
        type: 3,
      },
      success: function (res) {
        console.log(res)
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var cad = JSON.parse(res.data)
        console.log(cad)
        if (cad.status == 1) {
          if (!util.onblurjs(cad.data)){
            wx.showToast({
              title: '失败',
            })
            that.setData({
              vin:''
            })
          }else{
            that.setData({
              vin: cad.data
            })
            wx.showToast({
              title: '成功',
            })
          }
        } else if (cad.status == 6) {
          that.setData({
            vin: ''
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
      }
    })
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
    arrx = [];//动作横坐标
    arry = [];//动作纵坐标
    arrz = [];//总做状态，标识按下到抬起的一个组合
    arrx1 = [];//动作横坐标
    arry1 = [];//动作纵坐标
    arrz1 = [];//总做状态，标识按下到抬起的一个组合
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