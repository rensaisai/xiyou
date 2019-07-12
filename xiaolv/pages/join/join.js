// pages/upgrade/joinus/joinus.js
const config = require('../../config.js')
const util = require('../../utils/util.js')
const uploadZJImgUrl = config.uploadZJImgUrl
const saveUserApplyUrl = config.saveUserApplyUrl
const getUserByUserNoUrl = config.getUserByUserNoUrl
const getCardNoByFileUrl = config.getCardNoByFileUrl
const hostimg1 = config.hostimg1
var app = getApp()
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;//是否在绘制中
var arrx = [];//动作横坐标
var arry = [];//动作纵坐标
var arrz = [];//总做状态，标识按下到抬起的一个组合
// var canvasw = 0;//画布宽度
// var canvash = 0;//画布高度
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    // showModalStatus: true,
    tempFilePaths: null,
    tempFilePaths1: null,
    // canvasimgsrc:'',
    active: false,
    // actives: false,
    image1: '',
    image2: '',
    image3: '',
    name: '',
    identity: '',
    // number: '',
    // forbid: false,
    user: null,
  },
  uploading() {
    this.setData({
      type: 1,
      image1: ''
    })
    wx.navigateTo({
      url: '/pages/identity/identity',
    })
  },
  uploading1() {
    this.setData({
      type: 2,
      image2: ''
    })
    wx.navigateTo({
      url: '/pages/identity/identity',
    })
  },
  uploadings(img) {
    var that = this
    wx.uploadFile({
      url: hostimg1,
      filePath: img,
      name: 'file',
      formData: {
        type: 0,
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var cad = JSON.parse(res.data)
        console.log(cad)
        if (cad.status == 1) {
          var cade = JSON.parse(cad.data)[0]
          wx.showToast({
            title: '识别成功',
          })
          that.uploadingimg(img)
          that.setData({
            name: cade.name,
            identity: cade.number,
          })
        } else if (cad.status == 6) {
          wx.showToast({
            title: '识别失败',
            icon: 'none',
          })
          that.setData({
            name: '',
            identity: '',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          that.setData({
            name: '',
            identity: '',
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
  uploadingimg(img) {
    if (wx.showLoading) {
      wx.showLoading({
        title: '上传中...',
        icon: 'loading'
      })
    }
    var that = this
    wx.uploadFile({
      url: config.hostimg,
      filePath: img,
      name: 'file',
      formData: {
        userId: app.globalData.kmUserInfo.id,
        projectName: 'cmsweb',
        folderName: 'imgs/zjImgs',
        waterTypes: 0,
        type: 0,
        businessType: uploadZJImgUrl,
        expirationDate: 0,
        source: 'wx_xl'
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        console.log(res)
        var img = JSON.parse(res.data)
        if (img.status == 1) {
          that.setData({
            image1: img.data
          })
          wx.showToast({
            title: '上传成功',
            icon: 'none',
          })
        } else {
          that.setData({
            tempFilePaths: null,
          })
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
  uploadingimg1(img) {
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '上传中...',
        icon: 'loading'
      })
    }
    wx.uploadFile({
      url: config.hostimg,
      filePath: img,
      name: 'file',
      formData: {
        userId: app.globalData.kmUserInfo.id,
        projectName: 'cmsweb',
        folderName: 'imgs/zjImgs',
        waterTypes: 0,
        type: 0,
        businessType: uploadZJImgUrl,
        expirationDate: 0,
        source: 'wx_xl'
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading();
        }
        var img = JSON.parse(res.data)
        if (img.status == 1) {
          that.setData({
            image2: img.data
          })
          wx.showToast({
            title: '上传成功',
            icon: 'success',
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
  uploadingimg2() {
    var that = this
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function (res) {
        // console.log(res.tempFilePath)
        wx.uploadFile({
          url: config.hostimg,
          filePath: res.tempFilePath,
          name: 'file',
          formData: {
            userId: app.globalData.kmUserInfo.id,
            projectName: 'cmsweb',
            folderName: 'imgs/zjImgs',
            waterTypes: 0,
            type: 0,
            businessType: uploadZJImgUrl,
            expirationDate: 0,
            source: 'wx_xl'
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
                image3: img
              })
              that.applications()
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
  name(e) {
    this.setData({
      name: e.detail.value
    })
  },
  identity(e) {
    this.setData({
      identity: e.detail.value
    })
  },
  number(e) {
    this.setData({
      number: e.detail.value
    })
  },
  //事件监听
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  //开始
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
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
  //清除画布
  cleardraw: function () {
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    // context.clearRect(0, 0, canvasw, canvash);
    context.draw(false);
  },
  submit: function () {
    var that = this;
    if (that.data.tempFilePaths == null || that.data.tempFilePaths1 == null) {
      wx.showToast({
        title: '请上传身份证信息',
        icon: 'none',
      })
      return
    }
    if (that.data.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return
    }
    if (that.data.identity == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
      })
      return
    }
    if (!util.isCardNo(that.data.identity)) {
      wx.showToast({
        title: '身份证号错误',
        icon: 'none',
      })
      return
    }
    if (arrx.length == 0) {
      wx.showToast({
        title: '签名内容不能为空',
        icon: 'none',
      })
      return
    };
    that.uploadingimg2()
  },
  applications() {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: saveUserApplyUrl,
        param: {
          certificatesNo: that.data.identity,
          frontUrl: that.data.image1,
          reverseUrl: that.data.image2,
          userSignUrl: that.data.image3,
          userName: that.data.name,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },400)
          wx.showToast({
            title: '提交成功',
            icon:'none'
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  links() {
    wx.navigateTo({
      url: '/pages/upgrade/declarant/declarant',
    })
  },
  radio() {
    this.setData({
      active: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');

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
    arrx = [];
    arry = [];
    arrz = [];
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 1];
    console.log(prevPage)
    if (prevPage.data.type == 1 && prevPage.data.tempFilePaths != null && prevPage.data.image1 == '') {
      that.setData({
        tempFilePaths: prevPage.data.tempFilePaths
      })
      that.uploadings(prevPage.data.tempFilePaths)
    } else if (prevPage.data.type == 2 && prevPage.data.tempFilePaths1 != null && prevPage.data.image2 == '') {
      that.setData({
        tempFilePaths1: prevPage.data.tempFilePaths1
      })
      that.uploadingimg1(prevPage.data.tempFilePaths1)
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