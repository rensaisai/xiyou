/**
 * 小程序配置文件
 */
var debug = false;//测试开关 true测试 false正式
var version = "1.1.3";//版本

// var host = "https://www.cmspq.xyz/cmsweb"//正式
var host = "https://www.tianxiadiaochang.com/zdcweb"
if (debug) {
  host = "http://192.168.1.107:8080"//测试
}
var gaodeKey = "a4c923f7545a647e0086dcfa286e6452"

var config = {
  debug,
  //下面的地址配合云端 Server 工作
  host,
  //获取验证码
  getCodeUrl: `${host}/zdcUser/getCode`,
  //微信绑定接口
  registerWXUrl: `${host}/zdcUser/registerWX`,
  //登录接口
  getUserLoginUrl: `${host}/zdcUser/getUserLogin`,
  //微信信息同步接口
  updateUserWXUrl: `${host}/zdcUser/updateUserWX`,
  //获取个人信息接口
  getUserByIdUrl: `${host}/zdcUser/getUserById`,
  //广告列表接口
  getAllAdImgUrl: `${host}/zdcAdImg/getAllAdImg`,
  //渔汛发布接口
  saveFishInfoUrl: `${host}/zdcFish/saveFishInfo`,
  //渔汛照片上传接口
  uploadPictureUrl: `${host}/zdcFish/uploadPicture`,
  //渔汛列表接口
  getFishInfoByCityUrl: `${host}/zdcFish/getFishInfoByCity`,
  //渔汛搜索接口
  getFishInfoByFishNameUrl: `${host}/zdcFish/getFishInfoByFishName`,
  //渔汛详细信息接口
  getFishInfoByIdUrl: `${host}/zdcFish/getFishInfoById`,
  //获取我发布的渔汛接口
  getFishInfoByUserIdUrl: `${host}/zdcFish/getFishInfoByUserId`,
  //获取统计数据
  getByUserIdUrl: `${host}/zdcUser/getByUserId`,

  //根据定位省市获取城市code
  getCityCodeUrl: `${host}/zdcUser/getCityCode`,
  //手动选择省列表
  getProvicesUrl: `${host}/zdcUser/getProvices`,
  //根据您省code选择城市列表
  getCitiesUrl: `${host}/zdcUser/getCities`,
  //微信端获取openId
  getOpenId: `${host}/zdcUser/getOpenId`,
  //扫描二维码地址
  scanCodeUrl: `${host}/wx/open.ftl`,
  //删除活动
  delFishInfoByIdUrl: `${host}/zdcFish/delFishInfoById`,

  //高德逆地理解析
  gaodeRegeoUrl: `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${gaodeKey}&location=`,
  //微信支付统一下单
  wxPayPreOrderUrl: `https://api.mch.weixin.qq.com/pay/unifiedorder`,
  //微信支付统一下单
  wxCreateOrderUrl: `${host}/order/wxCreateOrder`
};

module.exports = config
