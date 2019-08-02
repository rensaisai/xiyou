var debug = false;//测试开关 true测试 false正式
var version = "1.1.2";//版本
var host = "https://www.tianxiadiaochang.com/xyweb"//正式
if (debug) {
  // var host = "http://114.116.49.171:8081/xyweb"//测试
  var host = "http://47.94.130.113:8081/xyweb"
}
var config = {
  //手机号登录
  loginByPhoneUrl: `${host}/xyUser/loginByPhone`,
  //根据手机号获取验证码
  getVerificationUrl: `${host}/xyUser/getVerification`,
  //效验手机号验证码
  verfiyCodeValidUrl: `${host}/xyUser/verfiyCodeValid`,
  //登录成功后保存用户信息到本地
  saveuserinformation:'saveuserinformation',
  //获取用户信息
  getUserInfoByUserIdUrl: `${host}/xyUser/getUserInfoByUserId`, 
  //微信一键登录
  loginByOpenIdUrl: `${host}/xyUser/loginByOpenId`, 
  //获取openid
  getXYOpenIdUrl: `${host}/xyUser/getXYOpenId`,
  //首页轮播图
  getAdsUrl: `${host}/xyUser/getAds`,
  //自嗨团详情
  // getAllToursUrl: `${host}/xyTouristRoute/getAllTours`,
  //获取热门目的地
  getAllPopularDestinationUrl: `${host}/xyTouristRoute/getAllPopularDestination`,
  //根据code查询目的地
  getPopularDestinationByCodeUrl: `${host}/xyTouristRoute/getPopularDestinationByCode`,
  //全部热门目的地列表
  getAllToursUrl: `${host}/xyTouristRoute/getAllTours`,
  //获取商城分类
  getAllGoodsTypeUrl: `${host}/xyGoods/getAllGoodsType`,
  //获取商城列表
  getGoodsByGoodsTypeIdUrl: `${host}/xyGoods/getGoodsByGoodsTypeId`,
  //线路详情
  getToursInfoUrl: `${host}/xyTouristRoute/getToursInfo`,
  //查询线路所有班期
  getAllScheduleDateByTouristIdUrl: `${host}/xyTouristRoute/getAllScheduleDateByTouristId`,
  //线路附加值
  getTouristAdditionalUrl: `${host}/xyTouristRoute/getTouristAdditional`,
  //获取商户门店
  getTenantAddressAndPhoneUrl: `${host}/xyTenant/getTenantAddressAndPhone`,
  //保存出游信息
  saveTouristOrderUrl: `${host}/xyOrder/saveTouristOrder`,
  //微信支付统一下单
  wxCreateOrderUrl: `${host}/xyOrder/wxCreateOrder`,
  // //本地文件
  // document: 'document',
  //出游人信息保存本地
  visitorinformation: 'visitorinformation',
  //查询行程详情
  getToursItineraryDetailsInfoUrl: `${host}/xyTouristRoute/getToursItineraryDetailsInfo`,
  // 获取商品详情
  getGoodsInfoByGoodsIdUrl: `${host}/xyGoods/getGoodsInfoByGoodsId`,
  // 获取商品规格
  getGoodsAttrConfigsUrl: `${host}/xyGoods/getGoodsAttrConfigs`,
  //根据所选规格商品库存
  getStockByGoodsIdAndAttrIdUrl: `${host}/xyGoods/getStockByGoodsIdAndAttrId`,
  // 查询用户邮寄地址
  getUserAllMailingAddressUrl: `${host}/xyUser/getUserAllMailingAddress`,
  // 修改默认邮寄地址
  modifyDefaultMailingAddrUrl: `${host}/xyUser/modifyDefaultMailingAddr`,
  // 删除邮寄地址
  deleteUserMailingAddressUrl: `${host}/xyUser/deleteUserMailingAddress`,
  // 增加邮寄地址
  addUserMailingAddressUrl: `${host}/xyUser/addUserMailingAddress`,
  //手动选择省列表
  getProvicesUrl: `${host}/xyUser/getProvices`,
  //根据您省code选择城市列表
  getCitiesUrl: `${host}/xyUser/getCities`,
  // 获取县
  getCountiesUrl: `${host}/xyUser/getCounties`,
  // 增加邮寄地址
  addUserMailingAddressUrl: `${host}/xyUser/addUserMailingAddress`,
  // 删除邮寄地址
  deleteUserMailingAddressUrl: `${host}/xyUser/deleteUserMailingAddress`,
  // 修改用户邮寄地址
  modifyUserMailingAddressUrl: `${host}/xyUser/modifyUserMailingAddress`,
  //获取出游人列表
  getTouristUserByUserIdUrl: `${host}/xyTouristRoute/getTouristUserByUserId`,
  //修改出游人信息
  updateUserTouristUrl: `${host}/xyTouristRoute/updateUserTourist`,
  //出游人信息保存本地
  visitorinformation: 'visitorinformation',
  //删除出游人
  delTouristUserByIdUrl: `${host}/xyTouristRoute/delTouristUserById`,
  //本地文件
  document: 'document',
  //提交身份证信息 
  uploadUserInfoUrl: `${host}/xyUser/uploadUserInfo`,
  //添加银行卡
  addBankCardInfoUrl: `${host}/xyUser/addBankCardInfo`,
  //获取银行卡列表
  getBankCardListUrl: `${host}/xyUser/getBankCardList`,
  //修改银行卡信息
  modifyBankCardInfoUrl: `${host}/xyUser/modifyBankCardInfo`,
  //查询用户订单
  queryOrderByUserIdUrl: `${host}/xyOrder/queryOrderByUserId`,
  //提现申请
  withdrawDepositUrl: `${host}/xyUser/withdrawDeposit`,
  //余额明细
  getUserBalanceDetailUrl: `${host}/xyUser/getUserBalanceDetail`,
  //金币明细
  getUserCouponDetailUrl: `${host}/xyUser/getUserCouponDetail`,
  //团队列表
  getUserTeamUrl: `${host}/xyUser/getUserTeam`,
  //获取团队人数
  getPersonalInfoUrl: `${host}/xyUser/getPersonalInfo`,
  //保存用户头像
  saveHedeImgUrl: `${host}/xyUser/saveHedeImg`,
  //图片上传
  uploadPictureUrl: `${host}/xyUser/uploadPicture`,
  //微信头像信息
  userInfos:'userInfos',
  //保存注册信息
  saveUserInfoUrl: `${host}/xyUser/saveUserInfo`,
  //添加出游人
  saveUserTouristUrl: `${host}/xyTouristRoute/saveUserTourist`,
  //或取app分享二维码
  getUserQRUrl: `${host}/xyUser/getUserQR`, 
  //修改个人信息
  modifyUserInfoUrl: `${host}/xyUser/modifyUserInfo`,
  //搜索线路
  getTouristRouteByKeyWordUrl: `${host}/xyTouristRoute/getTouristRouteByKeyWord`, 
  searchhistory:'searchhistory',
  //合同状态
  contractStatusUrl: `${host}/xyContract/contractStatus`,
  //获取合同时间
  isExistContractUrl: `${host}/xyContract/isExistContract`,
  //创建合同
  createSimpleContractUrl:`${host}/xyContract/createSimpleContract`,
  //签署合同
  simpleSignUrl: `${host}/xyContract/simpleSign`,
  //查看未签署合同文本 
  notsignedtextUrl: `${host}/pdf/web/contractTemplate.pdf`,
  //已签署合同
  signedcontractUrl: `${host}/contract2.html`,
  //签署成功预览
  contracthtmlurl:'contracthtmlurl',
//商品订单详情
  queryGoodsOrderInfoUrl: `${host}/xyOrder/queryGoodsOrderInfo`, 
//取消商品订单
  cancelGoodsOrderUrl: `${host}/xyOrder/cancelGoodsOrder`, 
//旅游订单列表
  queryTourOrderUrl: `${host}/xyOrder/queryTourOrder`,
//旅游订单详情
  queryTourOrderInfoUrl: `${host}/xyOrder/queryTourOrderInfo`,
//取消旅游订单
  cancelTourOrderUrl: `${host}/xyOrder/cancelTourOrder`,
//确认收货
  receivedUrl: `${host}/xyTenant/received`, 
//保存商城订单
  saveAppScOrderUrl: `${host}/xyOrder/saveAppScOrder`,
//获取支付方式
  getPayWaysUrl: `${host}/xyPay/getPayWays`,
//判断支付密码是否存在
  isExistPayPassWordUrl: `${host}/xyPay/isExistPayPassWord`,
//教验支付密码是否重复
  isRepeatPayPassWordUrl: `${host}/xyPay/isRepeatPayPassWord`,
//保存支付密码
  savePayPassWordUrl: `${host}/xyPay/savePayPassWord`,
//效验验证码
  verifyPayPassWordUrl: `${host}/xyPay/verifyPayPassWord`,
//余额支付
  balancePayUrl: `${host}/xyPay/balancePay`,
//修改出游人信息
updateUserTouristUrl: `${host}/xyTouristRoute/updateUserTourist`,  
//物流信息
getLogisticsUrl: `${host}/xyOrder/getLogistics`,
//获取收货地址
getMailingAddressUrl: `${host}/xyUser/getMailingAddress`,  
//获取已成团线路
getAllPopularFromHiUrl: `${host}/xyTouristRoute/getAllPopularFromHi`,
//限时抢购时间
queryAllRunTimeUrl:`${host}/xyGoods/queryAllRunTime`,
//限时商品
queryRunTimeAppGoodsUrl: `${host}/xyGoods/queryRunTimeAppGoods`,
//判断活动是否结束
isRunUrl: `${host}/xyOrder/isRun`,
//限时订单
saveAppRunTimeOrderUrl: `${host}/xyOrder/saveAppRunTimeOrder`,
//限量订单
saveAppGoodsNumGoodsUrl: `${host}/xyOrder/saveAppGoodsNumGoods`, 
//获取限量商品
queryAppGoodsNumAllUrl: `${host}/xyGoods/queryAppGoodsNumAll`,
//判断订单是否失效
judgementOrderUrl: `${host}/xyOrder/judgementOrder`,
//发现
getAllTopicsUrl: `${host}/xyCommunity/getAllTopics`,
//关注
myFollowUrl: `${host}/xyCommunity/myFollow`, 
//点赞
likeTopicUrl: `${host}/xyCommunity/likeTopic`,
//发现详情
topicDetailsUrl: `${host}/xyCommunity/topicDetails`, 
//关注 
  followUrl: `${host}/xyCommunity/follow`,
//取消关注
cancelFollowUrl: `${host}/xyCommunity/cancelFollow`, 
//发表评论
  saveReplyUrlm: `${host}/xyCommunity/saveReply`,
//点赞帖子
  likeTopicReplyUrl: `${host}/xyCommunity/likeTopicReply`,
//全部评论
  getAllTopicReplysUrl: `${host}/xyCommunity/getAllTopicReplys`,
//发布内容
  saveTopicContentUrl: `${host}/xyCommunity/saveTopicContent`,
  //上传发布内容图片 
  uploadTopicImageUrl: `${host}/xyCommunity/uploadTopicImage`, 
  //分享帖子
  shareTopicUrl: `${host}/xyCommunity/shareTopic`, 
  //保存商品评价
  saveWXCommentContentUrl: `${host}/xyComment/saveWXCommentContent`,
  //上传商品评价图片 
  uploadWXCommentImageUrl: `${host}/xyComment/uploadWXCommentImage`,
  //点赞商品评论
  likeCommentUrl: `${host}/xyComment/likeComment`, 
  //取消点赞商品
  cancelLikeCommentUrl: `${host}/xyComment/cancelLikeComment`, 
  //评论详情
  commentDetailsUrl: `${host}/xyComment/commentDetails`,
  //评论列表
  getAllCommentsUrl: `${host}/xyComment/getAllComments`, 
  //保存回复商品评论
  saveReplyURLS: `${host}/xyComment/saveReply`,
  //获取所有评论
  getAllGoodsReplysUrl: `${host}/xyGoods/getAllGoodsReplys`,
  //保存线路评论
  saveReplyUrls: `${host}/xyTouristRoute/saveReply`,
  //线路评价
  getAllTouristReplysUrl: `${host}/xyTouristRoute/getAllTouristReplys`,
  //搜索商品
  goodsseek:'goodsseek',
  searchGoodsUrl:`${host}/xyGoods/searchGoods`,
  //热销商品
  getAllHotGoodsNameListUrl:`${host}/xyGoods/getAllHotGoodsNameList`,
  //点赞回复
  likeCommentReplyUrl: `${host}/xyComment/likeCommentReply`,
  //取消回复点赞
  cancelLikeCommentReplyUrl: `${host}/xyComment/cancelLikeCommentReply`,
  //商品选择列表
  getGoodsListUrl: `${host}/xyCommunity/getGoodsList`,
  //
  getGoodsVersionUrl: `${host}/xyGoods/getGoodsVersion`, 

}
module.exports = config