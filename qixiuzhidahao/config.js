/**
 * 小程序配置文件
 */
var debug = true;//测试开关 true测试 false正式
var version = "1.0.9";//版本
var host = "https://www.cmspq.xyz/cmsweb/grApi"//正式
var hostimg = "https://www.cmspq.xyz/upload/upload/fileUpload"
var hostimg1 = "https://www.cmspq.xyz/upload/upload/getCardNoByFile"//上传图片
if (debug) {
  var host = "http://192.168.1.218:8080/cmsweb/grApi"//测试
  // var host = "http://39.105.72.30:8880/cmsweb/grApi"//测试
  // var hostimg = "http://39.105.72.30:8880/upload/upload/fileUpload"
  // var hostimg1 = "http://39.105.72.30:8880/upload/upload/getCardNoByFile"//上传图片
}
var gaodeKey = "a4c923f7545a647e0086dcfa286e6452"
var config = {
  debug,
  //下面的地址配合云端 Server 工作
  host,
  hostimg,
  hostimg1,
  token:'token',
  //登录
  verificationCodeByCodeAndPhoneUrl: 'verificationCodeByCodeAndPhone',
  //获取修理厂预约数量
  getTimeNumByRepairIdUrl: 'getTimeNumByRepairId',
  //获取修理厂预约时间
  getTimeByRepairIdUrl: 'getTimeByRepairId',
  //修改不可预约时间 
  saveTimeByRepairIdUrl:'saveTimeByRepairId',
  //修改可预约时间 
  delTimeByIdUrl: 'delTimeById',
  //获取保养列表
  getRepairOrdersByRepairIdAndStatusUrl: 'getRepairOrdersByRepairIdAndStatus',
//获取保养详情
  getOrderInfoUrl: 'getOrderInfo',
  //验收施工
  getMaintainByOrderIdUrl: 'getMaintainByOrderId', 
  //施工列表 
  getOrderOngoingByRepairIdUrl: 'getOrderOngoingByRepairId',
  // 删除员工
  delStaffByIdUrl: 'delStaffById', 
  //获取验证码
  getCodeUrl: 'getCode',
  //登录
  repairLoginUrl: `${host}/user/repairLogin`, 
  // 通过手机号获取用户所有车辆
  getAllUserCarsByPhoneUrl: `${host}/user/getAllUserCarsByPhone`,
  //获取员工列表
  getStaffByMechanismIdUrl: 'getStaffByMechanismId',
  // 获取技师接口
  getTechnicianByRepairIdUrl:'getTechnicianByRepairId',
  //获取车品牌
  getFctInfoUrl: `${host}/car/getFctInfo`,
  //获取车型
  getBrInfoUrl: `${host}/car/getBrInfo`,
  //获取年份
  getYearInfoUrl: `${host}/car/getYearInfo`,
  //获取排量
  getCarInfoByYearIdUrl: `${host}/car/getCarInfoByYearId`,
  //根据openid获取用户信息
  getStaffInfoByOpenIdUrl: 'getStaffInfoByOpenId',
  //获取用户车辆信息
  getUserCarInfoUrl: `${host}/user/getUserCarInfo`,
  //获取修理厂列表
  getRepairsUrl: `${host}/repair/getRepairs`,
  //获取修理厂详情
  getRepairInfoUrl: `${host}/repair/getRepairInfo`,
  //获取套餐列表
  getSetmealsUrl: `${host}/order/getSetmeals`,
  //获取修理厂评价
  getCommentsUrl: `${host}/repair/getComments`,
  //微信小程序新增推荐会员
  saveMemberWithWxUrl: `${host}/user/saveMemberWithWx`,
  //登录
  cmsglLoginUrl: `${host}/user/cmsglLogin`,
  //根据城市和名称查询修理厂
  getRepairsByKeywordsUrl: `${host}/repair/getRepairsByKeywords`,
  //根据定位省市获取城市code
  getCityCodeUrl: `${host}/repair/getCityCode`,
  //手动选择省列表
  getProvicesUrl: `${host}/repair/getProvices`,
  //根据您省code选择城市列表
  getCitiesUrl: `${host}/repair/getCities`,
  //获取首页广告列表
  getAdsUrl: `${host}/repair/getAds`,
  //微信端获取openId
  getOpenId: `${host}/user/getOpenId`,
  //微信端获取openId喜游
  getXYOpenId: `${host}/user/getXYOpenId`,
  //微信端获取openId喜游汽修直达号
  getRepairOpenId: 'getRepairOpenId',
  //注册非会员用户接口
  registerUserUrl: `${host}/user/registerUser`,
  //新增车辆信息
  saveUserCarUrl: `${host}/user/saveUserCar`,
  //修改车辆信息
  updateUserCarUrl: `${host}/user/updateUserCar`,
  //提交订单
  commitOrderUrl: `${host}/order/commitOrder`,
  //请求资格订单或者充值订单
  createUserOrderUrl: `${host}/order/createUserOrder`,
  //获取用户团队成员列表
  getUserTeamUrl: `${host}/user/getUserTeam`,
  //获取用户团队成员人数
  getUserTeamCountUrl: `${host}/user/getUserTeamCount`,
  //获取用户余额流水
  getUserAmountUrl: `${host}/user/getUserAmount`,
  //获取用户订单列表
  getUserOrdersUrl: `${host}/order/getUserOrders`,
  //提交银行卡信息
  saveBankInfoUrl: `${host}/user/saveBankInfo`,
  //提交提现申请
  applyCashUrl: `${host}/user/applyCash`,
  //提交评价
  commitCommentUrl: `${host}/order/commitComment`,
  //银行卡列表
  getUserBanksUrl: `${host}/user/getUserBanks`,
  //解绑银行卡
  deleteUserBankUrl: `${host}/user/deleteUserBank`,
  //充值记录列表
  getRechargeListUrl: `${host}/user/getRechargeList`,
  //提现记录列表
  getEnchashmentListUrl: `${host}/user/getEnchashmentList`,
  //高德逆地理解析
  gaodeRegeoUrl: `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${gaodeKey}&location=`,
  //密码校验
  usePwdUrl: `${host}/user/usePwd`,
  //获取用户基本信息
  getUserInfoByUserIdUrl: `${host}/user/getUserInfoByUserId`,
  //android端新增会员
  saveMemberWithAppUrl: `${host}/user/saveMemberWithApp`,
  //获取修理厂保养订单
  getRepairOrdersUrl: 'getRepairOrders',
  //修理厂修改订单状态为保养完成待评价
  setOrderStatusTo2Url: 'setOrderStatusTo2',
  //获取连锁店所有订单
  getChainOrdersUrl: `${host}/chain/getChainOrders`,
  //提交关联订单号
  commitKmqpOrderUrl: `${host}/chain/commitKmqpOrder`,
  //返回用户统计信息
  getUserStatisticsUrl: `${host}/user/getUserStatistics`,

  //微信支付统一下单
  wxPayPreOrderUrl: `https://api.mch.weixin.qq.com/pay/unifiedorder`,
  //微信支付统一下单
  wxCreateOrderUrl: `${host}/order/wxCreateOrder`,
  //扫描二维码地址
  scanCodeUrl: `${host}/wx/open.ftl`,
  //取消未支付订单
  cancelOrderUrl: `${host}/order/cancelOrder`,
  //获取保养顾问
  getRefereInfoUrl: `${host}/user/getRefereInfo`,
  //添加保养顾问
  insertRefereInfoUrl: `${host}/user/insertRefereInfo`,
  //更新登录密码
  updatePwdUrl: `${host}/user/updatePwd`,
  //查询配件适配车型
  getOemAndCarAndSizeUrl: `${host}/repair/getOemAndCarAndSize`,
  //查询适配具体车型
  getCarTypeUrl: `${host}/repair/getCarType`,
  //保存修理厂检测结果
  addRepairCheckUrl: 'addRepairCheck',
  //行车证图片上传
  uploadXczPictureUrl: `${host}/repair/uploadXczPicture`,
  //保存员工信息
  saveStaffUrl: 'saveStaff',
  //查询旗下所有技师
  // getTechnicianByRepairIdUrl: `${host}/repair/getTechnicianByRepairId`,
  //修理厂检测的记录
  getRepairCheckUrl: `${host}/repair/getRepairCheck`,
  //根据手机号获取用户所有车辆
  // getAllUserCarsByPhoneUrl: `${host}/repair/getAllUserCarsByPhone`,
  //保存OBD检测结果
  saveOBDCheckUrl: `${host}/repair/saveOBDCheck`,
  //保存登录信息到本地
  // logins:'logins', 
//上传图片
uploadCommentImgsUrl: 'uploadCommentImgs',
//保存保养工单
saveMaintainUrl: 'saveMaintain', 
//完成订单
updateMaintainUrl: 'updateMaintain',
//取消施工
cancelOrderByIdUrl: 'cancelOrderById',
//根据车牌号获取车辆详情
  getCarInfoByCarNoUrl: 'getCarInfoByCarNo',
//根据编号查商品
  getGoodsAndStockByGoodsNoUrl:"getGoodsAndStockByGoodsNo", 
//车牌
  getBrInfoUrl:"getBrInfo",
//车系
getFctInfoUrl:"getFctInfo",
//排量
getCcInfoByFctIdUrl:"getCcInfoByFctId",
//时间
  getYearInfoByCcIdUrl:"getYearInfoByCcId",
  // 车辆信息
  getCarSplByCcAndYearAndFctIdUrl: "getCarSplByCcAndYearAndFctId",
  //根据车辆查商品
  getGoodsAndStockByCarSplUrl:"getGoodsAndStockByCarSpl", 
//获取车辆使用商品
  getCarSplByGoodsIdUrl:"getCarSplByGoodsId",
//出库
  outStockByGoodsIdUrl:"outStockByGoodsId",
//补货单
  getPurchaseByMechanismIdUrl:"getPurchaseByMechanismId",
  //补货单详情
  getPurchaseByInfoUrl:'getPurchaseByInfo',
  //文字识别
  getGoodsStockByNameUrl:'getGoodsStockByName',
  //上级的补货单
  getReplenishByMechanismIdUrl:'getReplenishByMechanismId',
  //上级订单详情
  getReplenishInfoUrl:'getReplenishInfo',
  //余额支付
  createStockOrderByAmountUrl:'createStockOrderByAmount',  
  //微信支付
  createStockOrderUrl:'createStockOrder',
  //获取用户所有卡券
  getAllUserCardUrl:'getAllUserCard',
  //核销卡券
  writeOffCardTicketByUserCardIdUrl:'writeOffCardTicketByUserCardId',
  //修理厂当天结算
  getRepairOrderAndPriceUrl:'getRepairOrderAndPrice',
  //修理厂月度结算
  getRepairMonthOrderUrl:'getRepairMonthOrder' ,
  //月度订单和总额
  getRepairMonthOrderPriceUrl:'getRepairMonthOrderPrice',
  //洗车订单
  getAllCarwashOrderUrl:'getAllCarwashOrder',
  // 核销洗车订单
  cancellationOrderUrl:'cancellationOrder'
};


module.exports = config
