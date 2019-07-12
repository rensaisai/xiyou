
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
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中...',
    })
  }
  if (params.data != null) {
    if (params.data.source == undefined){
      params.data.source = 'wx_ly';
    }
  }
  wx.request({
    url: params.url,
    data: params.data,
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',//                  'application/json':  'application/x-www-form-urlencoded'
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
    complete: function (res) {
      if (params.complete != null) {
        params.complete(res);
      }
      setTimeout(function () {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }, 100)
    }
  })
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
function kmConsoleLog(mes) {
  // if(config.debug){
  console.log(mes);
  // }
}
function whetherlanding(){
  var app = getApp()
  if (app.globalData.kmUserInfo == null){
    wx.navigateTo({
      url: '/pages/user/register/register',
    })
    return false
  }
  return true
}
function checkPhone(value) {
  var reg = /^[1][0-9]{10}$/;
  return reg.test(value)
}
function isCardNo(card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
  //  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  var reg = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
  return reg.test(card)
}

module.exports = {
  formatTime: formatTime,
  kmRequest: kmRequest,
  getUrlParam: getUrlParam,
  kmConsoleLog: kmConsoleLog,
  whetherlanding: whetherlanding,
  checkPhone: checkPhone,
  isCardNo: isCardNo,
}
