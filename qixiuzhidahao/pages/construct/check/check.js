const config = require('../../../config.js')
const util = require('../../../utils/util.js')
const getMaintainByOrderIdUrl = config.getMaintainByOrderIdUrl
const uploadCommentImgsUrl = config.uploadCommentImgsUrl
const updateMaintainUrl = config.updateMaintainUrl
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
    list:null,
    loading:false,
    img1:'',
    img2:'',
  },
  check(orderid){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getMaintainByOrderIdUrl,
        param:{
          orderId: orderid
        }
      },
      method:"post",
      success:(res)=>{
        if(res.data.status == 1){
          var list = JSON.parse(res.data.data)[0]
          console.log(list)
          list.time = list.caerteTime.slice(0,16)
          that.setData({
            list:list
          })
        }else{
          wx.showToast({
            title:res.data.msg,
            icon:'none'
          })
        }
      }
    })
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
                img2: img
              })
              setTimeout(()=>{
                that.submer()
              },200)
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
  btn(){
   var that = this
   var err = ''
   if(arrx.length == 0){
     err="签名内容不能为空"
   } else if (arrx1.length == 0){
     err = "签名内容不能为空"
   }
   if(err.length > 0){
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
    wx.showModal({
      title: '是否确认提交',
      content: '记得提醒客户前往app进行评价哦!',
      success(res) {
        if (res.confirm) {
          that.setData({
            loading: true
          })
          util.kmRequest({
            data: {
              interfaceName: updateMaintainUrl,
              param:{
                id: that.data.list.maintainId,
                userSign: that.data.img1,
                technicianSign: that.data.img2,
              }
            },
            success: function (res) {
              console.log(res.data.data)
              if (res.data.status == 1) {
                wx.showToast({
                  title: '提交成功',
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 500)
              } else {
                that.setData({
                  loading: false
                })
              }
            }
          })
        } else if (res.cancel) {
         
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
    this.check(options.orderid)
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