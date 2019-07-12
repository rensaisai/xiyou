/**
 * 小程序配置文件
 */ 
var debug = false;//测试开关 true测试 false正式
var version = "1.1.8";//版本
var host = "https://www.tianxiadiaochang.com/xyweb"//正式
if (debug) {
  // host = "http://101.201.232.125:8081/xyweb"//测试
  // var host = "http://192.168.1.197:8080"
  // var host = "http://114.116.49.171:8081/xyweb"
  // var host = "https://www.guorencms.cn:8443/xyweb"
  var host = "http://114.116.49.171:8081/xyweb"
}
var gaodeKey = "a4c923f7545a647e0086dcfa286e6452"
var config = {
  debug,
  //下面的地址配合云端 Server 工作
  host,
  //常量
  // 判断会员商户手机号
  isMemberUrl: `${host}/xyUser/isMember`,
  // 根据手机号获取短信验证码
  getVerificationUrl: `${host}/xyUser/getVerification`,
  // 验证登录
  loginByPhoneUrl: `${host}/xyUser/loginByPhone`,
  // 删除opid
  existByIdAndUserTypeUrl: `${host}/xyUser/existByIdAndUserType`,
  // 所有订单
  queryUserOrderUrl: `${host}/xyTenant/queryUserOrder`,
  // 判断颜色和尺寸
  findStockUrl: `${host}/xyGoods/findStock`,
  // 根据电话号码查会员信息
  getUserInfoByPhoneUrl: `${host}/xyUser/getUserInfoByPhone`,
  // 确认收货订单
  receivedUrl:  `${host}/xyTenant/received`,
  // 本地缓存
  qrFilePath:'qrFilePath',
  // 判断推荐人编码
  isExistByNumberUrl: `${host}/xyUser/isExistByNumber`, 
// 查询会员下的一级会员
  getUserByUserIdAndLevelURL: `${host}/xyUser/getUserByUserIdAndLevel`,
  // 查询会员下的二级会员
  getUserByUserIdAndLevel2Url: `${host}/xyUser/getUserByUserIdAndLevel2`,
  // 查询商户下会员状态
  queryUserStatusUrl: `${host}/xyTenant/queryUserStatus`,
  // 提醒发货
  deliveryUrl: `${host}/xyTenant/delivery`, 
  getTenantAmountFlowByTenantIUrl: `${host}/xyUser/getTenantAmountFlowByTenantI` ,
  // 获取所有商品
  getAllGoodsUrl: `${host}/xyGoods/getAllGoods`,
  //获取用户订单
  // getUserOrdersUrl: `${host}/xyOrder/getUserOrders`,
  // 查看订单
  getFctInfoUrl: `${host}/car/getFctInfo`,
  //获取车型
  getBrInfoUrl: `${host}/car/getBrInfo`,
  getUserInfoByIdAndTypeUrl: `${host}/xyUser/getUserInfoByIdAndType`,
  getConfigByIdUrl: `${host}/xyGoods/getConfigById`,
  //获取年份
  getYearInfoUrl: `${host}/car/getYearInfo`,
  //获取排量
  getCarInfoByYearIdUrl: `${host}/car/getCarInfoByYearId`,
  //根据openid获取用户信息
  loginVipByOpenIdUrl: `${host}/xyUser/loginVipByOpenId`,
  // loginByOpenIdUrl: `${host}/xyUser/loginByOpenId`,
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
  loginUrl: `${host}/xyUser/login`,
  //根据城市和名称查询修理厂
  getRepairsByKeywordsUrl: `${host}/repair/getRepairsByKeywords`,
  //根据定位省市获取城市code
  getCityCodeUrl: `${host}/xyUser/getCityCode`,
  //获取商品尺寸颜色
  // getGoodsAttrConfigsUrl: `${host}/xyGoods/getGoodsAttrConfigs`,
  //手动选择省列表
  getProvicesUrl: `${host}/xyUser/getProvices`,
  //根据您省code选择城市列表
  getCitiesUrl: `${host}/xyUser/getCities`,
  // 获取县
  getCountiesUrl: `${host}/xyUser/getCounties`,
  //获取首页广告列表
  getAdsUrl: `${host}/xyUser/getAds`,
  //微信端获取openId
  getXYOpenIdUrl: `${host}/xyUser/getXYOpenId`,
  //注册非会员用户接口
  registerUserUrl: `${host}/user/registerUser`,
  //新增车辆信息
  saveUserCarUrl: `${host}/user/saveUserCar`,
  //修改车辆信息
  updateUserCarUrl: `${host}/user/updateUserCar`,
  //保存订单
  saveZGOrderUrl: `${host}/xyOrder/saveZGOrder`,
  //删除订单
  delOrderUrl: `${host}/xyOrder/delOrder`,
  //请求资格订单或者充值订单
  createUserOrderUrl: `${host}/order/createUserOrder`,
  //根据userId获取一级会员列表
  getUserByUserIdAndLevelUrl: `${host}/xyUser/getUserByUserIdAndLevel`,
  //获取用户团队成员人数
  getUserTeamCountUrl: `${host}/user/getUserTeamCount`,
  //获取用户余额流水
  getUserAmountUrl: `${host}/user/getUserAmount`,
  //获取用户订单列表
  getUserOrdersUrl: `${host}/xyOrder/getUserOrders`,
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
  getUserInfoByUserIdUrl: `${host}/xyUser/getUserInfoByUserId`,
  //android端新增会员
  saveMemberWithAppUrl: `${host}/user/saveMemberWithApp`,
  //根据userId获取统计数据
  getUserStatisticsByUserIdUrl: `${host}/xyUser/getUserStatisticsByUserId`,
  //微信支付统一下单
  wxPayPreOrderUrl: `https://api.mch.weixin.qq.com/pay/unifiedorder`,
  //微信支付统一下单
  wxCreateOrderUrl: `${host}/xyOrder/wxCreateOrder`,
  //扫描二维码地址
  scanCodeUrl: `${host}/wx/open.ftl`,
  //取消未支付订单
  cancelOrderUrl: `${host}/order/cancelOrder`,
  //获取保养顾问
  getRefereInfoUrl: `${host}/user/getRefereInfo`,
  //添加保养顾问
  insertRefereInfoUrl: `${host}/user/insertRefereInfo`,
  //更新登录密码
  updatePwdUrl: `${host}/xyUser/updatePwd`,
  
  //根据userId获取会员优惠券流水
  getCouponFlowByUserIdUrl: `${host}/xyUser/getCouponFlowByUserId`,
  //获取商户信息
  getTenantInfoByTenantIdUrl: `${host}/xyUser/getTenantInfoByTenantId`,
  //根据商户Id获取商户资金流水
  // getTenantAmountFlowByTenantIdUrl: `${host}/xyUser/getTenantAmountFlowByTenantId`, 
  //根据goodsId获取商品详情
  // getGoodsInfoByGoodsIdUrl: `${host}/xyGoods/getGoodsInfoByGoodsId`,
  //根据商户Id获取所有的会员
  getUsersByTenantIdUrl: `${host}/xyUser/getUsersByTenantId`,
  //获取accesstoken
  getAccessTokenUrl: `${host}/xyWx/getAccessToken`,
  //获取小程序码
  getWxacodeunlimitUrl: `${host}/xyWx/getWxacodeunlimit`,
  //更新用户信息
  updateUserUrl: `${host}/xyUser/updateUser`,
  // 超级商城分类
  getAllGoodsTypeUrl: `${host}/xyGoods/getAllGoodsType`,
  // 获取商城商品
  getAllVipSCGoodsUrl: `${host}/xyGoods/getAllVipSCGoods`,
  // 获取资格商品
  getAllVipZGGoodsUrl: `${host}/xyGoods/getAllVipZGGoods`,
  // 获取商品详情
  getGoodsInfoByGoodsIdUrl: `${host}/xyGoods/getGoodsInfoByGoodsId`,
  // 获取商品规格
  getGoodsAttrConfigsUrl: `${host}/xyGoods/getGoodsAttrConfigs`,
  // 根据分类获取商品
  getGoodsByGoodsTypeIdUrl: `${host}/xyGoods/getGoodsByGoodsTypeId`,
	//获取精品商品
  getAllVipQualityGoodsUrl: `${host}/xyGoods/getAllVipQualityGoods`,
  //根据所选规格商品库存
  getStockByGoodsIdAndAttrIdUrl: `${host}/xyGoods/getStockByGoodsIdAndAttrId`,
  // 微信普通商品下单
  saveScOrderUrl: `${host}/xyOrder/saveScOrder`,
  // 获取邀请码
  checkInviteCodeUrl: `${host}/xyUser/checkInviteCode`,
  // 保存用户信息
  saveVipUserInfoUrl: `${host}/xyUser/saveVipUserInfo`,
  // 查询订单
  queryOrderByUserIdUrl: `${host}/xyOrder/queryOrderByUserId`,
  // 增加邮寄地址
  addUserMailingAddressUrl: `${host}/xyUser/addUserMailingAddress`,
  // 查询用户邮寄地址
  getUserAllMailingAddressUrl: `${host}/xyUser/getUserAllMailingAddress`,
  // 修改默认邮寄地址
  modifyDefaultMailingAddrUrl: `${host}/xyUser/modifyDefaultMailingAddr`,
  // 删除邮寄地址
  deleteUserMailingAddressUrl: `${host}/xyUser/deleteUserMailingAddress`,
  // 修改用户邮寄地址
  modifyUserMailingAddressUrl: `${host}/xyUser/modifyUserMailingAddress`,
  // 查询团队
  getUserTeamUrl: `${host}/xyUser/getUserTeam`,
  // 获取金币流水
  // getVipUserCouponDetailUrl: `${host}/xyUser/getVipUserCouponDetail`,
  getUserCouponDetail1Url: `${host}/xyUser/getUserCouponDetail1`,
  //订单里未付款，第二次支付 
  wxNoPayCreateOrderUrl: `${host}/xyOrder/wxNoPayCreateOrder`,
  //待入账
  getUserNorecordDetail1Url: `${host}/xyUser/getUserNorecordDetail1`,
  //余额
  getUserBalanceDetail1Url: `${host}/xyUser/getUserBalanceDetail1`,
  // 微信获取用户信息
  getUserInfoUrl:`${host}/xyUser/getUserInfo`,
  //物流信息
  getLogisticsUrl:`${host}/xyOrder/getLogistics`,
  //获取订单详细地址
  getMailingAddressUrl: `${host}/xyUser/getMailingAddress`,
  // 本地存储
  // userInfo: 'userInfo',
  //获取access_token接口
  access_tokenUrl:`https://api.weixin.qq.com/cgi-bin/token`,
  //上传log
  uploadingUrl:`https://api.weixin.qq.com/cgi-bin/media/uploadimg`,
  //获取所有线路
  getAllToursUrl: `${host}/xyTouristRoute/getAllTours`,
  //查询线路详情
  getToursInfoUrl: `${host}/xyTouristRoute/getToursInfo`,
  //查询所有热们目的地
  getAllPopularDestinationUrl: `${host}/xyTouristRoute/getAllPopularDestination`,
  //根据城市查询热门目的地
  getPopularDestinationByCodeUrl: `${host}/xyTouristRoute/getPopularDestinationByCode`,
  //获取热门自嗨团
  getAllPopularFromHiUrl: `${host}/xyTouristRoute/getAllPopularFromHi`,
  //查询行程详情
  getToursItineraryDetailsInfoUrl: `${host}/xyTouristRoute/getToursItineraryDetailsInfo`,
  //搜索线路
  getTouristRouteByKeyWordUrl: `${host}/xyTouristRoute/getTouristRouteByKeyWord`,
  //查询线路所有班期
  getAllScheduleDateByTouristIdUrl: `${host}/xyTouristRoute/getAllScheduleDateByTouristId`,
  //获取某年某月班期
  getScheduleDateByYearAndMonthUrl: `${host}/xyTouristRoute/getScheduleDateByYearAndMonth`,
  //获取出游人列表
  getTouristUserByUserIdUrl: `${host}/xyTouristRoute/getTouristUserByUserId`,
  //添加出游人
  saveUserTouristUrl: `${host}/xyTouristRoute/saveUserTourist`,
  //本地文件
  document : 'document',
  //出游人信息保存本地
  visitorinformation:'visitorinformation',
  //修改出游人信息
  updateUserTouristUrl: `${host}/xyTouristRoute/updateUserTourist`,
  //线路附加值
  getTouristAdditionalUrl: `${host}/xyTouristRoute/getTouristAdditional`,
  //获取商户门店
  getTenantAddressAndPhoneUrl: `${host}/xyTenant/getTenantAddressAndPhone`,
  //保存出游信息
  saveTouristOrderUrl: `${host}/xyOrder/saveTouristOrder`,
 //删除出游人
  delTouristUserByIdUrl: `${host}/xyTouristRoute/delTouristUserById`,
//搜索历史本地储存
  searchhistory:'searchhistory',
  //添加银行卡
  addBankCardInfoUrl: `${host}/xyUser/addBankCardInfo`,
  //获取银行卡信息
  getBankCardListUrl: `${host}/xyUser/getBankCardList`,
  //修改银行卡
  modifyBankCardInfoUrl: `${host}/xyUser/modifyBankCardInfo`,
  //提现申请
  withdrawDepositUrl: `${host}/xyUser/withdrawDeposit`,
};

module.exports = config
