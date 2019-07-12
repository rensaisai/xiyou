/**
 * 小程序配置文件
 */
var debug =false;//测试开关 true测试 false正式
var version = "1.3.1";//版本
var host = "https://www.cmspq.xyz/cmsweb/grApi"//正式
var host1 = "https://www.cmspq.xyz/obd/grApi"
var hostimg ="https://www.cmspq.xyz/upload/upload/fileUpload"
var hostimg1 = "https://www.cmspq.xyz/upload/upload/getCardNoByFile"//上传图片
if (debug) {
  // var host = "http://39.105.72.30:8880/cmsweb/grApi"
  // var host1 = "http://39.105.72.30:8880/obd/grApi"
  // var hostimg = "http://39.105.72.30:8880/upload/upload/fileUpload"//上传图片
  // var hostimg1 = "http://39.105.72.30:8880/upload/upload/getCardNoByFile"//上传图片
  var host = "http://192.168.1.218:8080/cmsweb/grApi"
  var host1 = "http://192.168.1.218:8080/obd/grApi"
  var hostimg = "http://192.168.1.218:8080/upload/upload/fileUpload"//上传图片
  var hostimg1 = "http://192.168.1.218:8080/upload/upload/getCardNoByFile"//上传图
}
var gaodeKey = "a4c923f7545a647e0086dcfa286e6452"
var config = {
  debug,
  //下面的地址配合云端 Server 工作
  host,
  host1, 
  hostimg, 
  hostimg1,
  token:'token',
  //获取车系和车型
  getFctInfoUrl: 'getFctInfo',
  //获取车型年款
  getYearInfoByCcIdUrl: 'getYearInfoByCcId',
  //获取车型
  getCarSplByCcAndYearAndFctIdUrl: 'getCarSplByCcAndYearAndFctId',
  // 获取一级会员
  getUserTeamUrl:'getUserTeam',
  //获取客户列表
  getUserTeam2Url: 'getUserTeam2',
  //获取商户所有成员
  getUserByTenantIdUrl: 'getUserByTenantId',
  //获取商户所有佣金
  getTenantFlowingUrl: 'getTenantFlowing',
  //获取车型
  getBrInfoUrl: 'getBrInfo',
  addCarQRCodeUrl: 'addCarQRCode', 
  //获取年份
  getYearInfoUrl: 'getYearInfo',
  //获取排量
  getCcInfoByFctIdUrl: 'getCcInfoByFctId',
  //根据openid获取用户信息
  getUserInfoByOpenIdUrl: 'getUserInfoByOpenId',
  //获取用户车辆信息
  getUserCarInfoUrl: 'getUserCarInfo',
  //获取修理厂列表
  getRepairsUrl: 'getRepairs',
  //获取修理厂详情
  getRepairInfoUrl: 'getRepairInfo',
  //获取套餐列表
  getSetmealsUrl: 'getSetmeals',
  //获取修理厂评价
  getCommentsUrl: '/repair/getComments',
  //微信小程序新增推荐会员
  saveMemberWithWxUrl: 'saveMemberWithWx',
  //登录
  loginUrl: 'login',
  //根据城市和名称查询修理厂
  getRepairsByKeywordsUrl: 'getRepairsByKeywords',
  //根据定位省市获取城市code
  getCityCodeUrl: 'getCityCode',
  //手动选择省列表
  getProvicesUrl: 'getProvices',
  //根据您省code选择城市列表
  getCitiesUrl: 'getCities',
  //获取首页广告列表
  getAdsUrl: 'getAds',
  //微信端获取openId钓场
  getOpenIdUrl: 'getOpenId',
  //微信端获取openId喜游
  getXYOpenIdUrl: 'getXYOpenId',
  //微信端获取openId果仁
  getGROpenIdUrl: 'getGROpenId',
  //注册非会员用户接口
  registerUserUrl: 'registerUser',
  //新增车辆信息
  saveUserCarUrl: 'saveUserCar',
  //修改车辆信息
  updateUserCarUrl: 'updateUserCar',
  //提交订单
  commitOrderUrl: 'commitOrder1',
  //请求资格订单或者充值订单
  createUserOrderUrl: 'createUserOrder',
  //获取用户团队成员列表
  getUserTeamUrl: 'getUserTeam',
  //获取用户团队成员人数
  getUserTeamCountUrl: 'getUserTeamCount',
  //获取用户余额流水
  getAmountByUserIdUrl: 'getAmountByUserId',
  //获取用户订单列表
  getUserOrdersUrl: 'getUserOrders',
  //提交银行卡信息
  saveBankInfoUrl: 'saveBankInfo',
  //提交提现申请
  applyCashUrl: 'applyCash',
  //提交评价
  commitCommentUrl: 'commitComment',
  //银行卡列表
  getUserBanksUrl: 'getUserBanks',
  //解绑银行卡
  deleteUserBankUrl: 'deleteUserBank',
  //充值记录列表
  getRechargeListUrl: 'getRechargeList',
  //提现记录列表
  getEnchashmentListUrl: 'getEnchashmentList',
  //高德逆地理解析
  gaodeRegeoUrl: `https://restapi.amap.com/v3/geocode/regeo?output=json&key=${gaodeKey}&location=`,
  //密码校验
  usePwdUrl: 'usePwd',
  //获取用户基本信息
  getUserInfoByUserIdUrl: 'getUserInfoByUserId',
  //android端新增会员
  saveMemberWithAppUrl: 'saveMemberWithApp',
  //获取修理厂保养订单
  getRepairOrdersUrl: 'getRepairOrders',
  //修理厂修改订单状态为保养完成待评价
  setOrderStatusTo2Url: 'setOrderStatusTo2',
  //获取连锁店所有订单
  getChainOrdersUrl: 'getChainOrders',
  //提交关联订单号
  commitKmqpOrderUrl: 'commitKmqpOrder',
  //返回用户统计信息
  getUserStatisticsUrl: 'getUserStatistics',

  //微信支付统一下单
  wxPayPreOrderUrl: `https://api.mch.weixin.qq.com/pay/unifiedorder`,
  //微信支付统一下单
  wxGRCreateOrderUrl: 'wxGRCreateOrder',
  //扫描二维码地址
  scanCodeUrl: 'open.ftl',
  //取消未支付订单
  cancelOrderUrl: 'cancelOrder',
  //获取保养顾问
  getRefereInfoUrl: 'getRefereInfo',
  //添加保养顾问
  insertRefereInfoUrl: 'insertRefereInfo',
  //更新登录密码
  updatePwdUrl: 'updatePwd',
  //删除车辆信息
  deleteUserCarUrl: 'deleteUserCar',
  //获取当前用户所有车辆信息
  getAllUserCarsUrl: 'getAllUserCars',
  //更新用户的信息
  updateUserUrl: 'updateUser',
  //领取OBD
  saveUserOBDUrl: 'saveUserOBD',
  //查询推荐人手机号
  getUserPhoneUrl: 'getUserPhone',
  //修改默认选中车辆
  updateUserChoiceCarUrl: 'updateUserChoiceCar',
  //会员是否已领取OBD
  getUserOBDUrl: 'getUserOBD',
  //会员团购卡升级VIP
  updateUserMemberFlagUrl: 'updateUserMemberFlag',
  //获取短信验证码
  getCodeUrl: 'getCode',
  //验证验证码
  verificationCodeByCodeAndPhoneUrl: 'verificationCodeByCodeAndPhone',
  //保存修改密码的信息
  verificationCodeByCodeAndPhone1Url: 'verificationCodeByCodeAndPhone1',
  // 修改密码
  updateUserPasswordByPhoneUrl: 'updateUserPasswordByPhone',
  // 根据城市和排序规则获取检测线 
  getDetectionLineUrl: 'getDetectionLine', 
  // 获取详情
  getDetectionLineInfoUrl: 'getDetectionLineInfo',
  // 获取检测套餐
  getLineSetmealsUrl: 'getLineSetmeals',
  // // 获取检测站评价
  // getCommentUrl: '/detectionLine/getComments',
  // 获取洗车行
  getCarwashUrl: 'getCarwash',
  //获取洗车行套餐
  getCarwashSetmealsUrl: 'getCarwashSetmeals',
  //获取详情
  getCarwashInfoUrl: 'getCarwashInfo',
  //获取洗车行评价
  getCarwashCommentsUrl: 'getCarwashComments',
  //洗车行生成订单
  carwashCommitOrderUrl: 'carwashCommitOrder',
  //保存洗车行评价
  // saveCarwashCommentsUrl: 'saveCarwashComments',
  //提交审车订单
  coomitUrl: '/detectionLine/commitOrder',
  //保存审车评价
  // saveCommentsUrl: 'saveComments',
  //上传升级人信息
  // uploadZJImgUrl: 'uploadZJImg',
  uploadZJImgUrl: 'fileUpload',
  //查询用户所有卡券
  getValidUserCardByUserIdUrl: 'getValidUserCardByUserId',
  //查询所有卡券
  getAllCardUrl:'getAllCard',
  //获取可以绑定的所有会员卡
  getValidUserCardByUserIdAndIsBuyUrl:'getValidUserCardByUserIdAndIsBuy',
  //卡券绑定时获取短信验证码
  getCardCodeUrl: 'getCardCode',
  //绑定会员验证验证码
  verificationCardCodeByCodeAndPhoneUrl:'verificationCardCodeByCodeAndPhone',
//判断是否可以绑定会员卡
isBindingVipUserUrl: 'isBindingVipUser',
//获取卡券类型
getCardTypeUrl: 'getCardType',
//获取可分配卡券数
getUserVipCardNumUrl:'getUserVipCardNum',
//判断是否可以绑定卡券
isBindingUserCardTicketUrl: 'isBindingUserCardTicket',
//绑定会员卡给用户
  bindingUserCardTicketUrl: 'bindingUserCardTicket',
//保存升级代理人信息
  saveAgentApplyUrl: 'saveAgentApply',
//绑定会员给用户
  bindingVipUserUrl: 'bindingVipUser',
//获取推荐人工号
  getUserByUserNoUrl: 'getUserByUserNo',
//获取银行卡名称
  getBankNameUrl: 'getBankName',
//根据genre和地区查询支行
getBankByGenreAndAreaLevelUrl: 'getBankByGenreAndAreaLevel',
//查询会员购买会员卡价格
getVipCardPriceUrl:'getVipCardPrice', 
//生成卡券订单
saveCardOrderUrl: 'saveCardOrder',
//升级代理人是否有支付订单
  isHaveAgentUserOrderUrl: 'isHaveAgentUserOrder',
//根据车辆id获取服务项目
  getCarGoodsBySplIdUrl: 'getCarGoodsBySplId',
//获取保养记录
  getOrdersByUserIdUrl: 'getOrdersByUserId',
//订单详情
  getOrderInfoUrl: 'getOrderInfo',
// //获取订单可用卡券
//   getCardTicketByUserIdUrl: `${host}/user/getCardTicketByUserId`,
//查询所有的预约时间
  getTimeByRepairIdUrl: 'getTimeByRepairId' ,
//查询自己的预约时间
  getTimeByOrderIdUrl: 'getTimeByOrderId',
//预约保养
  saveTimeByOrderIdUrl: 'saveTimeByOrderId',
//修改预约时
  updateTimeByOrderIdUrl: 'updateTimeByOrderId',
//保存修改车辆信息到本地
  // vehiclemessage:'vehiclemessage',
//更换商品
  getCarGoodsByItemIdAndSplIdUrl: 'getCarGoodsByItemIdAndSplId',
//更换机油商品
  getCarOilsByItemIdAndSplIdUrl: 'getCarOilsByItemIdAndSplId',
//添加1L油
  getCarOilsBySpecAndBrandIdUrl: 'getCarOilsBySpecAndBrandId', 
//获取保养工单
  getMaintainByOrderIdUrl: 'getMaintainByOrderId',
  //查询佣金流水详情
  getAmountInfoByIdUrl: 'getAmountInfoById',
  //分享二维码
  getUserStareByUserId2Url: 'getUserStareByUserId2', 
  //获取热门车型
  getPopularBrInfoUrl: 'getPopularBrInfo',
  //查询服务项目可用卡券
  getCardTicketByUserIdNewUrl: 'getCardTicketByUserIdNew',
  //粉丝列表
  getUserFaseUrl:'getUserFase',
  //车豆流水
  getUserBeanFlowingUrl: 'getUserBeanFlowing',
  //审车订单
  getUserLineOrdersUrl: 'getUserLineOrders',  
  //修改头像
  updateUserHeadImgUrl:'updateUserHeadImg',
  //是否绑定obd
  chenkUserObdDeviceUrl:'chenkUserObdDevice',
  //绑定obd
  saveUserObdDeviceUrl:'saveUserObdDevice',
  //接触obd绑定
  untyingUserObdDeviceUrl:'untyingUserObdDevice',
  //故障检测
  getCurCodeUrl:'getCurCode',
  //修理厂检测信息 
  getRepairCheckUrl:'getRepairCheck',
  //修理厂检测信息详情
  getRepairCheckByIdUrl:'getRepairCheckById', 
  //obd检测历史
  getUserObdHistoryUrl:'getUserObdHistory',
  //obd检测历史详情
  getUserObdByIdUrl:'getUserObdById',
  //扫码拨打电话
  moveCarUrl: 'moveCar', 
  getCarQrCodeByContentUrl:'getCarQrCodeByContent',
  //我的名片
  getUserQrCodeUrl: 'getUserQrCodeUrl',
  //根据卡券号获取验证码
  getCodeByCardNumberUrl:'getCodeByCardNumber',
  //核销卡券
  writeOffCardTicketUrl:'writeOffCardTicket',
  //获取活动卡包
  getActivityCardByCityCodeUrl:'getActivityCardByCityCode',
  checkQrCodeByUserIdUrl: 'checkQrCodeByUserId',
  //判断用户申请信息
  checkUserAgentUrl:'checkUserAgent',
  //提交申请人信息
  saveUserApplyUrl: 'saveUserApply' 
   
};

module.exports = config
