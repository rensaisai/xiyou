const config = require('../../../config')
const saveFishInfoUrl = config.saveFishInfoUrl
const uploadPictureUrl = config.uploadPictureUrl
const getCityCodeUrl = config.getCityCodeUrl
const gaodeRegeoUrl = config.gaodeRegeoUrl

var app = getApp()
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')

Page({
  data: {
    imageList: [],
    countIndex: 8,
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    locationAddress: '',
    lat: 0.0,
    lon: 0.0,
    minDate: '',
    startDate:'',
    startTime:'00:00',
    endDate:'',
    endTime:'23:59',
    addImgHidden:'',
    imageUrls:[],
    placeMin:null,
    placeMax:null,
    updateImgCount:0,
    updateData:{},
    entity:{},
    peopleLimit:null,
    city:null
  },
  registerClick: function (e) {
    var that = this;
    console.log(e.detail.value.fishDesc.length);
    var err = '';
    var startTime = this.data.startDate + ' ' + this.data.startTime + ':00';
    var endTime = this.data.endDate + ' ' + this.data.endTime + ':00';
    var startDate = new Date(startTime);
    var entDate = new Date(endTime);
    if (e.detail.value.fishName.replace(/^\s+|\s+$/g, "").length == 0) {
      err = '请输入钓场名称';
    } else if (startDate > entDate) {
      err = '开始时间不能大于结束时间';
    } else if (this.data.locationAddress.length == 0) {
      err = '请选择钓场地址';
    } else if (e.detail.value.tele.length == 0) {
      err = '请输入活动热线';
    } else if (!util.checkPhone(e.detail.value.tele)) {
      err = '手机号格式错误';
    } else if (e.detail.value.fishAmount.length == 0) {
      err = '请输入活动费用';
    } else if (this.data.placeMin == null) {
      err = '请输入起始钓台号';
    } else if (this.data.placeMax == null) {
      err = '请输入结束钓台号';
    } else if (this.data.peopleLimit == null) {
      err = '请输入限号人数';
    } else if (e.detail.value.fishCount.length == 0) {
      err = '请输入放鱼数量';
    } else if (e.detail.value.fishDesc.length == 0) {
      err = '请输入活动介绍';
    } 
    // else if (e.detail.value.fishDesc.length > 300){
    //   err = '活动介绍必须少于300字';
    // } 
    else if (this.data.imageList.length == 0) {
      err = '请上传至少一张宣传图';
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    var countUpLoaded = 0;
    for (var i = 0; i < this.data.imageList.length; i++) {
      var imgurl = this.data.imageList[i];
      var host = 'www.cmspq.xyz'
      if (config.debug) {//>>>>>>
        host = '101.201.232.125'
      }
      if (imgurl.indexOf(host) != -1) {
        countUpLoaded++;
      }
    }
    this.setData({
      updateImgCount: countUpLoaded
    });
    var upImg = false; 
    if (countUpLoaded < 9){
      if (this.data.imageList.length > 0) {
        for (var i = 0; i < this.data.imageList.length; i++) {
          var imgurl = this.data.imageList[i];
          var host = 'www.cmspq.xyz'
          if (config.debug) {//>>>>>>
            host = '101.201.232.125'
          }
          if (imgurl.indexOf(host) == -1) {
            upImg = true;
            console.log(imgurl)
            this.uploadImage(imgurl);
          }
        }
      }
    }
    var data = {
      fishName: e.detail.value.fishName,
      startTime: startTime,
      endTime: endTime,
      place: this.data.locationAddress,
      lat: this.data.lat,
      lon: this.data.lon,
      tele: e.detail.value.tele,
      fishAmount: e.detail.value.fishAmount,
      placeMin: e.detail.value.placeMin,
      placeMax: e.detail.value.placeMax,
      peopleLimit: this.data.peopleLimit,
      fishCount: e.detail.value.fishCount,
      fishDesc: e.detail.value.fishDesc,
      city: this.data.city,
      userId: app.globalData.kmUserInfo.id,
      img: ''
    };
    this.data.updateData = data;
    console.log(this.data.imageUrls);
    if (!upImg){
      this.registerRequest();
    }
  },
  getImgUrls: function (){
    var urls = '';
    if (this.data.imageUrls.length > 0){
      for (var i = 0; i < this.data.imageUrls.length; i++){
        urls += this.data.imageUrls[i];
        urls += ';';
        console.log(urls);
      }
    }
    return urls;
  },
  registerRequest: function () {
    this.data.updateData.img = this.getImgUrls();
    console.log(this.data.updateData.img)
    this.positionRequest(this.data.lon, this.data.lat);
  },
  onLoad: function (options) {
    this.setData({
      startDate: util.getNowFormatDate(false),
      endDate: util.getNowFormatDate(false),
      minDate: util.getNowFormatDate(false)
    })
    var entityStr = options.entity;
    if(entityStr != null){
      var entity = JSON.parse(entityStr);
      if (config.debug) {//>>>>>>
        for (var i = 0; i < entity.img.length; i++) {
          var imgurl = entity.img[i];
          entity.img[i] = imgurl.replace('https://www.cmspq.xyz', 'http://101.201.232.125:8081')
        }
      }
      var addImgHidden = '';
      if (entity.img.length == 9){
        addImgHidden = 'true';
      }
      this.setData({
        entity:entity,
        locationAddress: entity.place,
        lat: entity.lat,
        lon: entity.lon,
        minDate: '',
        startDate: entity.startTime.substr(0, 10),
        startTime: entity.startTime.substr(11, 5),
        endDate: entity.endTime.substr(0, 10),
        endTime: entity.endTime.substr(11, 5),
        addImgHidden: addImgHidden,
        imageUrls: entity.img,
        imageList: entity.img,
        placeMin: entity.placeMin,
        placeMax: entity.placeMax,
        peopleLimit: entity.peopleLimit,
        city:entity.city
      });
    }
  },
  bindStartDateChange: function (e) {
    this.setData({
      startDate: e.detail.value
    })
    if(this.data.startDate > this.data.endDate){
      this.setData({
        endDate: e.detail.value
      })
    }
  },
  bindEndDateChange: function (e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindStartTimeChange: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: ['album','camera'],
      sizeType: ['compressed'],//压缩或原图
      count: 9 - this.data.imageList.length,
      success: function (res) {
        // console.log(res)
        var imgCount = that.data.imageList.length + res.tempFilePaths.length;
        if (imgCount >= 9){
          that.setData({
            addImgHidden:'true'
          });
        }
        that.setData({
          imageList: that.data.imageList.concat(res.tempFilePaths)
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  uploadImage:function(imgUrl){
    console.log(imgUrl)
    var that = this;
    wx.uploadFile({
      url: uploadPictureUrl,
      filePath: imgUrl,
      name: 'file',
      success: function (res) {
        console.log('res:', res)
        var resData = JSON.parse(res.data);
        if (resData.status == 1){
          // console.log('data:', resData.data)
          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1000
          })
          that.data.imageUrls.push(resData.data)
          that.setData({
            updateImgCount:that.data.updateImgCount + 1
          })
          if(that.data.updateImgCount == that.data.imageList.length){
            that.registerRequest();
          }
        }else{
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: function ({ errMsg }) {
        console.log('上传失败, errMsg is', errMsg)
      }
    })
  },
  chooseLocation: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          locationAddress: res.address,
          lat:res.latitude,
          lon:res.longitude
        })
      }
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
  },
  deleteImage: function (event) {
    for (var i = 0; i < this.data.imageUrls.length; i++){
      if (this.data.imageList[event.currentTarget.dataset.index] == this.data.imageUrls[i]){
        this.data.imageUrls.splice(i, 1);
        break;
      }
    }
    this.data.imageList.splice(event.currentTarget.dataset.index, 1);
    this.setData({
      imageList:this.data.imageList,
      addImgHidden:''
    })
  },
  bindPlaceMinInput: function (e) {
    if (e.detail.vallue < 1) {
      wx.showToast({
        title: '必须大于0',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.placeMax != null && e.detail.vallue >= this.data.placeMax){
      wx.showToast({
        title: '必须小于结束号' + this.data.placeMax,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.peopleLimit != null && e.detail.vallue >= this.data.peopleLimit) {
      wx.showToast({
        title: '必须小于限号人数' + this.data.peopleLimit,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var limit = 0;
    if (this.data.placeMax != null) {
      limit = Math.abs(this.data.placeMax - e.detail.value) + 1
    }
    this.setData({
      placeMin: e.detail.value,
      peopleLimit: limit
    })
  },
  bindPlaceMaxInput: function (e) {
    if (e.detail.vallue < 1) {
      wx.showToast({
        title: '必须大于0',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.placeMin != null && e.detail.vallue <= this.data.placeMin) {
      wx.showToast({
        title: '必须大于起始号' + this.data.placeMin,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.peopleLimit != null && e.detail.vallue > this.data.peopleLimit) {
      wx.showToast({
        title: '必须小于等于限号人数' + this.data.peopleLimit,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    var limit = 0;
    if (this.data.placeMin != null){
      limit = Math.abs(e.detail.value - this.data.placeMin) + 1
    }
    this.setData({
      placeMax: e.detail.value,
      peopleLimit: limit
    })
  },
  bindPeopleLimitInput: function (e) {
    if (e.detail.vallue < 1) {
      wx.showToast({
        title: '必须大于0',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.placeMin != null && e.detail.vallue <= this.data.placeMin) {
      wx.showToast({
        title: '必须大于起始号' + this.data.placeMin,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (this.data.placeMax != null && e.detail.vallue > this.data.placeMax) {
      wx.showToast({
        title: '必须小于等于结束号' + this.data.placeMax,
        icon: 'none',
        duration: 1000
      })
      return;
    }
    this.setData({
      peopleLimit: e.detail.value
    })
  },
  positionRequest: function (lon, lat) {//经度，维度
    var that = this;
    var province = '山西省';
    var city = '太原市';
    util.kmRequest({
      url: gaodeRegeoUrl + lon + ',' + lat,
      data: {},
      success: function (res) {
        if (res.data.status == 1) {
          province = res.data.regeocode.addressComponent.province;
          city = res.data.regeocode.addressComponent.city;
          if(city == null || city.length == 0){
            city = province;
          }
          that.cityCodeRequest(city);
        }
      }
    })
  },
  cityCodeRequest: function (city) {
    var that = this;
    if(city == null || city.length == 0){
      city = '太原市';
    }
    util.kmRequest({
      url: getCityCodeUrl,
      data: {
        regionName: city
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.status == 1 || res.data.status == 6) {
          var data = JSON.parse(res.data.data)
          console.log(data)
          var cityCode = JSON.parse(res.data.data)[0].areaLevel;
          that.data.city = cityCode;
          that.data.updateData.city = cityCode;
          that.uploadData();
        }
      }
    })
  },
  uploadData: function(){
    util.kmRequest({
      url: saveFishInfoUrl,
      method: 'post',
      data: this.data.updateData,
      success: function (res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: "发布成功",
          })
          wx.switchTab({
            url: '/pages/mine/mine'
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none"
            // duration: 1000
          })
        }
      }
    })
  }
})

