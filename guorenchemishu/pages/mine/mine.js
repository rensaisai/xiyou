const config = require('../../config')
const  util = require('../../utils/util')
const getUserStatisticsUrl = config.getUserStatisticsUrl
const getRefereInfoUrl = config.getRefereInfoUrl
const insertRefereInfoUrl = config.insertRefereInfoUrl
const updateUserHeadImgUrl = config.updateUserHeadImgUrl
const getUserInfoByOpenIdUrl = config.getUserInfoByOpenIdUrl
var app = getApp()

Page({
  data: {
    kmUserInfo:null,
    headimg:null,
    nickname:'',
    member:0,
    bean:0,
    entity:null,
    memberType:null,
    memberFlag:null,
    userNo:''
  },
  userStatisticsRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getUserStatisticsUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1) {
          var statistics = JSON.parse(res.data.data)[0];
          console.log(statistics)
          that.setData({
            member: statistics.cardNum,
            bean: statistics.bean,
          });
        }
      }
    })
  },
  order(){
  if (!util.checkUserInfo()) {
    return;
  }
   wx.navigateTo({
     url: '/pages/users/myorder/myorder',
   })
  },
  codevh(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/celcoupon/celcoupon',
    })
  },
  header(){
    if (!util.checkUserInfo()) {
      return;
    }
  },
  headerimg(){
    var that = this
    if (!util.checkUserInfo()) {
      return;
    }
    wx.showModal({
      title: '提示',
      confirmColor:'#E84A2E',
      content: '是否修改头像',
      success(res) {
        if (res.confirm) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
              var tempFilePaths = res.tempFilePaths[0]
              that.uploadingimg(tempFilePaths)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  uploadingimg(img){
    var  that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '上传中...',
        icon: 'loading'
      })
    }
    var headImage = 'headImage'
    wx.uploadFile({
      url: config.hostimg,
      filePath: img,
      name: 'file',
      formData: {
        userId: app.globalData.kmUserInfo.id,
        projectName: 'cmsweb',
        folderName: 'imgs/headImage',
        waterTypes: 0,
        type: 0,
        businessType: headImage,
        expirationDate: 0,
        source: 'wx_gr'
      },
      success: function (res) {
        var data = JSON.parse(res.data)
       
         if(data.status == 1){
           that.saveheadImage(data.data)
         }
      }
    })
  },
  saveheadImage(id){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: updateUserHeadImgUrl,
        param:{
          userId: app.globalData.kmUserInfo.id,
          headImg:id,
        },
      },
      success:(res) => {
        console.log(res)
        if(res.data.status == 1){
          util.kmRequest({
            data: {
              interfaceName: getUserInfoByOpenIdUrl,
              param: {
                openId: app.globalData.openid,
                token: app.globalData.token
              }
            },
            success: function (res) {
              if (res.data.status == 1) {
                if (wx.hideLoading) {
                  wx.hideLoading();
                }
                wx.showToast({
                  title: '上传成功',
                  icon: 'success'
                })
                console.log(JSON.parse(res.data.data)[0])
                app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
                that.setData({
                  headimg:app.globalData.kmUserInfo.headImg
                })
              }
            }
         })
        }
      }
    }) 
  },
  care(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url:'/pages/users/myvehicle/myvehicle',
    })
  },
  move(){
    if (!util.checkUserInfo()) {
      return;
    }
    // if (this.data.memberFlag ==0 && this.data.memberType == 0){
    //   wx.showModal({
    //     title: "提示",
    //     content: "您还不是超级会员，加入即可尊享服务",
    //     showCancel: false,
    //     confirmText: "立即购买",
    //     confirmColor: "#fd4200",
    //     success: function (res) {
    //       if (res.confirm == true) {
    //         wx.navigateTo({
    //           url: '/pages/upgrade/order/order?cardType=' + 0 + '&ids=' + 1,
    //         });
    //       }
    //     }
    //   })
    // }else{
      wx.navigateTo({
        url: '/pages/cars/mycar/noac/noac',
      })
    // }
  },
  coupon(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/upgrade/coupon/coupon',
    })
  },
  bean(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/beanwater/beanwater',
    })
  },
  we(){
    if (!util.checkUserInfo()) {
      return;
    }
    if (this.data.memberType == 0){
      wx.navigateTo({
        url: '/pages/upgrade/brief/brief',
      })
    } else if (this.data.memberType == 4){
      wx.navigateTo({
        url: '/pages/upgrade/success/success',
      })
    }
  },
  counselor(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/upgrade/counselor/counselor',
    })
  },
  
  onLoad: function (options) {

  },
  onShow:function(){
    var that = this
    var headimg = '/image/headdefault.png';
    var nickname = '登录/注册';
    util.kmRequest({
      data: {
        interfaceName: getUserInfoByOpenIdUrl,
        param: {
          openId: app.globalData.openid,
          token: app.globalData.token
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.kmUserInfo = JSON.parse(res.data.data)[0];
          if (app.globalData.kmUserInfo.nickName != '' && app.globalData.kmUserInfo.nickName != null){
            nickname = app.globalData.kmUserInfo.nickName
          }
          if (app.globalData.kmUserInfo.headImg != '' && app.globalData.kmUserInfo.headImg != null){
             headimg = app.globalData.kmUserInfo.headImg
          }
          that.refereInfoRequest()
          that.userStatisticsRequest();
          that.setData({
            kmUserInfo: app.globalData.kmUserInfo,
            memberType: app.globalData.kmUserInfo.memberType,
            memberFlag: app.globalData.kmUserInfo.memberFlag,
            userNo: app.globalData.kmUserInfo.userNo,
            headimg: headimg,
            nickname: nickname,
          })
        }else{
          that.setData({
            nickname: nickname,
            headimg: headimg
          });
        }
      }
    })
   
  },
  membersClick:function(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/members/list/memberlist'
    });
  },
  amountClick: function () {
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/users/commissions/list/commissionslist'
    });
  },
  mycode(){
    if (!util.checkUserInfo()) {
      return;
    }
    wx.navigateTo({
      url: '/pages/mycode/mycode',
    })
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      // duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  refuse:function(){
    this.hideModal()
  },
  onGotUserInfo:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.entity.phone,
      success: function () {
        console.log("成功拨打电话")
      }
    })
    this.hideModal()
  },
  refereInfoRequest: function () {
    var that = this;
    util.kmRequest({
      data: {
        interfaceName: getRefereInfoUrl,
        param:{}
      },
      success: function (res) {
        if (res.data.status == 1 && res.data.data.length > 0) {
          app.globalData.refereInfo = JSON.parse(res.data.data)[0];
          console.log(app.globalData.refereInfo)
          that.setData({
            entity: app.globalData.refereInfo
          });
        } 
      }
    })
  },
  maintain:function(){
    this.showModal()
  },
  onShareAppMessage: function () {
    return {
      title: '果仁车秘书',
      desc: '正品配件，专业保养',
      path: '/pages/index/index'
    }
  }
})

