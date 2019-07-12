const config = require('../../../config')
const registerWXUrl = config.registerWXUrl
const saveMemberWithWxUrl = config.saveMemberWithWxUrl
const getUserPhoneUrl = config.getUserPhoneUrl

var app = getApp()
var util = require('../../../utils/util')
var md5 = require('../../../utils/md5')

Page({
  data: {
    refereId:null,//1 推荐人id
    refereName: '注册', //'推荐注册'
    referePhone:'',
    referePhoneDisabled:false
  },
  registerClick: function (e) {
    var that = this;

    var err = '';
    if (e.detail.value.name.replace(/^\s+|\s+$/g, "").length == 0) {
      err = '请输入姓名';
    }else if (e.detail.value.phone.length == 0) {
      err = '请输入手机号';
    } else if (!util.checkPhone(e.detail.value.phone)) {
      err = '手机号格式错误';
    } else if (e.detail.value.pwd.length == 0) {
      err = '请输入密码';
    } else if (!util.checkPwd(e.detail.value.pwd)) {
      err = '请输入6-10位字母或数字密码';
    } else if (e.detail.value.pwd2.length == 0) {
      err = '请输入密码';
    } else if (e.detail.value.pwd != e.detail.value.pwd2) {
      err = '两次密码不一致';
    }
    // else if (e.detail.value.refere.length > 0 && !util.checkPhone(e.detail.value.refere)) {
    //   err = '保养顾问手机号格式错误';
    // }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }

    var headImg= ''
    var nickName= ''
    var contory= ''
    var province= ''
    var city= ''

    if(app.globalData.userInfo != null){
      headImg= app.globalData.userInfo.avatarUrl
      nickName= app.globalData.userInfo.nickName
      contory= app.globalData.userInfo.country
      province= app.globalData.userInfo.province
      city= app.globalData.userInfo.city
    }
    var data = {
      phone: e.detail.value.phone,
      pwd: md5.md5(e.detail.value.pwd),
      openId: app.globalData.openid,
      headImg: headImg,
      nickName: nickName,
      contory: contory,
      province: province,
      city: city,
      userName: e.detail.value.name
    };
    var complete = function (res) {
      if (res.data.status == 1) {
        app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
        wx.showToast({
          title: "注册成功",
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
    };
    if (this.data.refereId == null) {
      this.registerRequest(data, complete);
    } else {
      data.refereId = this.data.refereId;
      this.saveMemberWithWxRequest(data, complete);
    }
  },
  registerRequest: function (data, complete) {
    util.kmRequest({
      url: registerWXUrl,
      data: data,
      success: complete
    })
  },
  saveMemberWithWxRequest: function (data, complete) {
    util.kmRequest({
      url: saveMemberWithWxUrl,
      data: data,
      success: complete
    })
  },
  getUserPhoneRequest: function (userId) {
    var that = this;
    util.kmRequest({
      url: getUserPhoneUrl,
      data: {
        "userId":userId
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            referePhone:res.data.data,
            referePhoneDisabled:true
          });
        }
      }
    })
  },
  onLoad: function (options) {
    var refereId = options.refereId;
    if (refereId != null){
      this.setData({
        refereId: refereId,
        refereName: '推荐注册'
      });
      this.getUserPhoneRequest(refereId);
    }
  }
})

