const config = require('../../../../config')
const util = require('../../../../utils/util')
const saveUserCarUrl = config.saveUserCarUrl
const updateUserCarUrl = config.updateUserCarUrl
const hostimg1 = config.hostimg1
var app = getApp()
Page({
  data: {
    width:'',
    heigth:'',
    selectItem:null,
    fct:null,
    br: null,
    basis: null,
    displacement: null,
    year: null,
    fctName: '',
    brName: '',
    cc: '',
    year:'',
    xczImg: '',
    km:'',
    date:'',
    logo:'',
    maxDate: '',
    carInfo:null,
    carno:'',
    changeFct:false,
    hiddenChangeCar:'true',
    provinceArr: ["粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "警", "学", "港", "澳"],
    strArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M",],
    hiddenPro: true,// 省份键盘
    hiddenStr: true,
  },
  // modifier(){
  //  wx.navigateTo({
  //    url: '/pages/cars/carselect/fct/fctlist'
  //  })
  // },
  saveUserCarRequest:function(e){
    var that = this;
    var err = '';
    if (this.data.carno === '请选择车牌号') {
      err = '请选择车牌号码';
    } else if (!util.checkCarNo(this.data.carno)) {
      err = '车牌号码格式错误';
    } else if (e.detail.value.km.length == 0) {
      err = '请输入行驶里程';
    } else if (e.detail.value.km == 0) {
      err = '行驶里程必须大于0';
    } else if (this.data.date == '请选择上路时间') {
      err = '请输入上路时间';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    var url = '';
    if (that.data.selectItem == null){
      var data = {
        interfaceName: saveUserCarUrl,
        param:{
          fctId: that.data.br.id,
          brId: that.data.fct.id,
          splId: that.data.basis.id,
          carNo: this.data.carno,
          km: e.detail.value.km,
          startDate: this.data.date
        }
      };
    }else{
      if (that.data.fct == null){
       var fctId = ''
       var brId= ''
       var splId= ''
      }else{
       var fctId = that.data.br.id
       var  brId = that.data.fct.id
       var splId = that.data.basis.id
      }
      var data = {
        interfaceName: updateUserCarUrl,
        param:{
          userCarId: that.data.selectItem.id,
          fctId: fctId,
          brId: brId,
          splId: splId,
          carNo: this.data.carno,
          km: e.detail.value.km,
          startDate: this.data.date
        }
      };
    }
    util.kmRequest({
      url: url,
      data: data,
      method:"post",
      success: function (res) {
        if (res.data.status == 1) {
          if (url == saveUserCarUrl){
            if (JSON.parse(res.data.data)[0].isUse == 1) {
              app.globalData.carInfo = JSON.parse(res.data.data)[0];
            }
          }
          wx.showToast({
            title: "保存成功",
          })
          setTimeout(function(){
              wx.switchTab({
                url:'/pages/index/index'
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
  show(){
   this.setData({
     hiddenPro: true,
     hiddenStr: true
   })
  },
  selectMyCar: function () {
    this.setData({
      changeFct: true
    });
    wx.navigateTo({
      url: '/pages/cars/carselect/fct/fctlist'
    });
  },
  onLoad: function (options) {
    var that = this
    var selectItem = null
    if (options.selectItem != undefined){
      selectItem = JSON.parse(options.selectItem)
    }
    var fctName = ''
    var brName = ''
    var cc = ''
    var year = ''
    var xczImg = ''
    var km = ''
    var carno = '请选择车牌号'
    var date = '请选择上路时间'
    if (options.fct != undefined ){
      var fctName = JSON.parse(options.fct).brandName
      var brName = JSON.parse(options.br).brName
      var cc = JSON.parse(options.displacement).cc
      var year = JSON.parse(options.year).year
      var xczImg = JSON.parse(options.fct).img
      that.setData({
        fct: JSON.parse(options.fct),
        br: JSON.parse(options.br),
        basis: JSON.parse(options.basis),
        displacement: JSON.parse(options.displacement),
        year: JSON.parse(options.year),
      })
    } else {
        fctName = selectItem.fctName,
        brName = selectItem.brName,
        cc = selectItem.cc,
        year = selectItem.year,
        xczImg = selectItem.img,
        km = selectItem.km,
        carno = selectItem.carNo
        date = selectItem.startDate.slice(0, 10)
    }
     that.setData({
      fctName: fctName,
      brName: brName,
      cc: cc,
      year: year,
      xczImg: xczImg,
      km: km,
      carno: carno,
      date: date,
      selectItem: selectItem
    })

  },
  onShow: function () {
    
  },
  binderrorimg: function (e) {
    var img = "/image/car.png";
    this.setData({
      logo: img
    });
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  
  proTap(e) {//点击省份
    let province = e.currentTarget.dataset.province;
    console.log(province)
    this.setData({
      carno:province,
      hiddenPro: true,
      hiddenStr: false
    })
  },
  strTap(e) {//点击字母数字
    let province = e.currentTarget.dataset.str;
    console.log(province)
    let carnum = this.data.carno;
    console.log(carnum)
    var carnems = carnum + province
    console.log(carnems)
  //   if (carnum.length > 7) return;// 车牌长度最多为8个（新能源车牌8个）
  //   carnum += province;
    this.setData({
      carno: carnems
    })
  },
  backSpace() {//退格
    let carnum = this.data.carno;
    var arr = carnum.split('');
    arr.splice(-1, 1)
    console.log(arr)
    var str = arr.join('')
    if (str == '') {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }
    this.setData({
      carno: str
    })
  },
  backKeyboard() {//返回省份键盘
    this.setData({
      hiddenPro: false,
      hiddenStr: true
    })
  },
  disply:function(){
    this.setData({
      hiddenPro: true,
      hiddenStr: true
    })
  },
  carnos:function(){
    var carnos = this.data.carno
    if (carnos === '请选择车牌号'){
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }else{
      this.setData({
        hiddenPro: true,
        hiddenStr: false
      })
    }
  },
  takePhoto(){
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths[0]
        if (wx.showLoading) {
          wx.showLoading({
            title: '识别中...',
            icon: 'loading'
          })
        }
        wx.uploadFile({
          url: hostimg1,
          filePath: tempFilePaths,
          name: 'file',
          formData: {
            type: 2,
          },
          success: function (res) {
            if (wx.hideLoading) {
              wx.hideLoading();
            }
            var img = JSON.parse(res.data)
            if (img.status == 1) {
              wx.showToast({
                title: '识别成功',
              })
              that.setData({
                carno:img.data
              })
            } else if(img.status == 6){
              wx.showToast({
                title: '识别失败',
                icon: 'none',
              })
              that.setData({
                carno: ''
              })
            }else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
              })
              that.setData({
                carno: ''
              })
            }
          },
          fail: function (res) {
            if (wx.hideLoading) {
              wx.hideLoading();
            }
          }
        })
      }
    })
  },
})

