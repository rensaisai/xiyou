const config = require('../config')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function kmRequest(params) {
  if (wx.showLoading) {
    wx.showLoading({
      title: '加载中...',
    })
  }
  kmConsoleLog('----start----' + params.url + '\n_' + JSON.stringify(params.data))
  if (params.data != null){
    params.data.source = 'wx';
  }
  wx.request({
    url: params.url,
    data: params.data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8' //默认值application/json  application/x-www-form-urlencoded
    },
    method: params.method == null ? 'get' : params.method,
    success: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      kmConsoleLog('--------' + params.url + '\n_' + JSON.stringify(params.data) + '\n_' + JSON.stringify(res));
      params.success(res);
    },
    fail: function (res) {
      if (wx.hideLoading) {
        wx.hideLoading();
      }
      wx.showToast({
        title: "网络不给力啊",
        icon: "none",
        duration: 1000
      })
    },
    complete:function(res){
      if (params.complete != null){
        params.complete(res);
      }
    }
    // params.isShowWait
  })
  // wx.hideToast()
  
}
function kmConsoleLog(mes){
  // if(config.debug){
    console.log(mes);
  // }
}
function guid() {
  return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function getUrlParam(url) {
  var params = new Object();
  kmConsoleLog(url);
  var index = url.indexOf("?");
  if (index != -1) {
    var str = url.substr(index + 1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      var map = strs[i].split("=");
      params[map[0]] = map[1];
      // params[map[0]] = unescape(map[1]);
    }
  }
  kmConsoleLog(params);
  return params;
}
function getNowFormatDate(time) {//yyyy-mm-dd hh:mm:ss
  var date = new Date();

  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  if(time == true){
    currentdate = currentdate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
  }
  return currentdate;
}

function checkUserInfo() {
  var app = getApp()
  if (app.globalData.kmUserInfo == null) {
    wx.showModal({
      title: "提示",
      content: "您还未登录，登录即可尊享服务",
      showCancel: false,
      confirmText: "马上登录",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          wx.navigateTo({
            url: '/pages/users/login/login'
          });
        }
      }
    })
    return false;
  }
  return true;
}

function checkUserMemberFlag() {
  var app = getApp()
  if (app.globalData.kmUserInfo == null || app.globalData.kmUserInfo.memberFlag == 0) {
    wx.showModal({
      title: "提示",
      content: "您还未购买VIP会员，加入即可尊享服务",
      showCancel: false,
      confirmText: "马上加入",
      confirmColor: "#1296db",
      success: function (res) {
        if (res.confirm == true) {
          wx.switchTab({
            url: '/pages/proxy/proxy'
          });
        }
      }
    })
    return false;
  }
  return true;
}
function checkPhone(value){
  var reg = /^[1][0-9]{10}$/;
  return reg.test(value)
}
function checkBankNo(value){
  var reg = /^(\d{16}|\d{19})$/;
  return reg.test(value)
}//
function checkCarNo(value) {
  var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[a-zA-Z]{1}[a-zA-Z0-9]{4,5}[a-zA-Z0-9挂学警港澳]{1}$/;
  return reg.test(value)
}
function checkPwd(value) {
  var reg = /^[a-zA-Z0-9]{6,10}$/;
  return reg.test(value);
}
module.exports = {
  formatTime: formatTime,
  kmRequest: kmRequest,
  guid: guid,
  getUrlParam: getUrlParam,
  getNowFormatDate: getNowFormatDate,
  checkUserInfo: checkUserInfo,
  checkUserMemberFlag: checkUserMemberFlag,
  checkPhone: checkPhone,
  checkBankNo: checkBankNo,
  checkCarNo: checkCarNo,
  checkPwd: checkPwd,
  kmConsoleLog: kmConsoleLog
}
