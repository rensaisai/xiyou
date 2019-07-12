const config = require('../../../config')
const getCarInfoByCarNoUrl = config.getCarInfoByCarNoUrl
// 查询旗下所有技师
const getTechnicianByRepairIdUrl = config.getTechnicianByRepairIdUrl
const addRepairCheckUrl = config.addRepairCheckUrl
var app = getApp()
console.log(app)
var util = require('../../../utils/util')
// var md5 = require('../../../utils/md5')

Page({
  data: {
    provinceArr: ["粤", "京", "津", "渝", "沪", "冀", "晋", "辽", "吉", "黑", "苏", "浙", "皖", "闽", "赣", "鲁", "豫", "鄂", "湘", "琼", "川", "贵", "云", "陕", "甘", "青", "蒙", "桂", "宁", "新", "藏", "使", "领", "警", "学", "港", "澳"],
    strArr: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Q", "W", "E", "R", "T", "Y", "U", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M",],
    hiddenPro: true,// 省份键盘
    hiddenStr: true,
    loading:false,
    carno:'',
    care:null,
    active:true,
    // text:null,
    // show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    shows:false,
    list:[],//下拉列表的数据
    index: 0,
    indexs:0,
    checkList:[
      { value: '正常'},
      { value: '异常'},
      { value: '未检测'}
    ],
    stlist:[],

    ygq:null,	//雨刮器
    fdjjyw:null, 	//发动机机油位
    blqxy:null, 	//玻璃清洗液
    wbdg:null, //	外部灯光
    fdy:null, 	//防冻液
    scy:null, 	//刹车油
    ybzmd:null, //仪表照明灯
    zlzxjy:null, //助力转向机油
    ltm:null, 	//轮胎面
    ty:null, 	//胎压
    kqlx:null, //空气滤芯
    bsyx:null, 	//变速箱油
    gzpd:null, 	//各种皮带
    zjl:null, 	//涨紧轮
    jzjzzc:null, //	减震 / 减震支撑
    lg:null, 	//拉杆
    qdztqdz:null, //驱动轴套 / 驱动轴
    qt:null, 	//球头
    hcjt:null, 	//缓冲胶套
    wdphg:null, //稳定平衡杆
    hlg:null, //横立杆
    csq:null, //差速器
    fdx:null, //分动箱
    dpdxdpzj:null, 	//电瓶、电线、电瓶支架
    proposal:''
  },
  proTap(e) {//点击省份
    let province = e.currentTarget.dataset.province;
    console.log(province)
    this.setData({
      carno: province,
      hiddenPro: true,
      hiddenStr: false
    })
  },
  strTap(e) {//点击字母数字
    let province = e.currentTarget.dataset.str;
    console.log(province)
    let carnum = this.data.carno;
    console.log(carnum)
    var carnems = carnum + province
    console.log(carnems)
    //   if (carnum.length > 7) return;// 车牌长度最多为8个（新能源车牌8个）
    //   carnum += province;
    this.setData({
      carno: carnems
    })
  },
  backSpace() {//退格
    let carnum = this.data.carno;
    var arr = carnum.split('');
    arr.splice(-1, 1)
    console.log(arr)
    var str = arr.join('')
    if (str == '') {
      this.setData({
        hiddenPro: false,
        hiddenStr: true
      })
    }
    this.setData({
      carno: str
    })
  },
  backKeyboard() {//返回省份键盘
    this.setData({
      hiddenPro: false,
      hiddenStr: true,
      carno:''
    })
  },
  disply: function () {
    this.setData({
      hiddenPro: true,
      hiddenStr: true
    })
  },
  carnos: function () {
      this.setData({
        hiddenPro: false,
        hiddenStr: true,
        carno:'',
        care:null,
      })
  },
  show() {
    var that = this
    if (that.data.carno != ''){
      if (!util.checkCarNo(that.data.carno)) {
        wx.showToast({
          title: '车牌号格式有误',
          icon: 'none'
        })
        return
      }
      that.setData({
        hiddenPro: true,
        hiddenStr: true
      })
      if (that.data.care == null){
        that.caremessage()
      }
    }
   
  },
  caremessage(){
    var that = this
    util.kmRequest({
      data:{
        interfaceName: getCarInfoByCarNoUrl,
        param:{
          carNo: that.data.carno
        }
      },
      method:"post",
      success(res){
        if(res.data.status == 1){
          var care = JSON.parse(res.data.data)[0]
          console.log(care)
          that.setData({
            care: care
          })
        }else if(res.data.status == 6){
          that.setData({
            hiddenPro: false,
            hiddenStr: true,
            carno: '',
          })
          wx.showToast({
            title: '未查到该车辆,请重新输入',
            icon:'none'
          })
        }
      }
    })
  },
  technician: function () {
    var that = this
    util.kmRequest({
      data: {
        interfaceName: getTechnicianByRepairIdUrl,
        param:{
          repairId: app.globalData.kmUserInfo.repairId,
        }
      },
      success: function (res) {
        if (res.data.status == 1) {
          var list = JSON.parse(res.data.data)
          that.setData({
            stlist: list
          })
        }
      }
    })
  },
  registerClick: function (e) {
    var that = this;
    var err = '';
    // var startTime = this.data.startDate + ' ' + this.data.startTime + ':00';
    // var endTime = this.data.endDate + ' ' + this.data.endTime + ':00';
    // var startDate = new Date(startTime);
    if (that.data.carno == '') {
      err = '请输入车牌号';
    } else if (that.data.ygq == null) {
      err = '请选择雨刮器检测情况';
    } else if (that.data.fdjjyw  == null) {
      err = '请选择发动机机油位检测情况';
    } else if (that.data.blqxy  == null) {
      err = '请选择玻璃清洗液检测情况';
    } else if (that.data.wbdg  == null) {
      err = '请选择外部灯光检测情况';
    } else if (that.data.fdy  == null) {
      err = '请选择防冻液检测情况';
    } else if (that.data.scy  == null) {
      err = '请选择刹车油检测情况';
    } else if (that.data.ybzmd  == null) {
      err = '请选择仪表照明灯检测情况';
    } else if (that.data.zlzxjy  == null){
      err = '请选择助力转向机油检测情况';
    } else if (that.data.ltm  == null){
      err = '请选择轮胎面检测情况'
    } else if (that.data.ty  == null){
      err = '请选择胎压检测情况'
    } else if (that.data.kqlx  == null){
      err ='请选择空气滤芯检测情况'
    } else if (that.data.bsyx  == null){
      err = '请选择变速箱油检测情况'
    } else if (that.data.gzpd  == null){
      err = '请选择各种皮带检测情况'
    } else if (that.data.zjl  == null){
      err = '请选择涨紧轮检测情况'
    } else if (that.data.jzjzzc  == null){
      err = '请选择减震/减震支撑检测情况'
    } else if (that.data.lg  == null){
      err = '请选择拉杆检测情况'
    } else if (that.data.qdztqdz  == null){
      err = '请选择驱动轴套/驱动轴检测情况'
    } else if (that.data.qt  == null){
      err = '请选择球头检测情况'
    } else if (that.data.hcjt  == null){
      err = '请选择缓冲胶套检测情况'
    } else if (that.data.wdphg  == null){
      err = '请选择稳定平衡杆检测情况'
    } else if (that.data.hlg  == null){
      err = '请选择横立杆检测情况'
    } else if (that.data.csq  == null) {
      err = '请选择差速器检测情况'
    } else if (that.data.fdx  == null) {
      err = '请选择分动箱检测情况'
    } else if (that.data.dpdxdpzj  == null) {
      err = '请选择电瓶、电线、电瓶支架检测情况'
    }else if (that.data.stlist.length == 0) {
      err = '请到首页添加技师 '
    }
    if (err.length > 0) {
      wx.showToast({
        title: err,
        icon: "none"
      })
      return;
    }
    that.setData({
      loading:true
    })
    util.kmRequest({
      data:{
        interfaceName: addRepairCheckUrl,
        param:{
          repairId: app.globalData.kmUserInfo.repairId,
          userId: that.data.care.userId,
          userCarId: that.data.care.id,
          technicianName: this.data.stlist[this.data.indexs].name,
          json: JSON.stringify({
            ygq: that.data.ygq,
            fdjjyw: that.data.fdjjyw,
            blqxy: that.data.blqxy,
            wbdg: that.data.wbdg,
            fdy: that.data.fdy,
            scy: that.data.scy,
            ybzmd: that.data.ybzmd,
            zlzxjy: that.data.zlzxjy,
            ltm: that.data.ltm,
            ty: that.data.ty,
            kqlx: that.data.kqlx,
            bsyx: that.data.bsyx,
            gzpd: that.data.gzpd,
            zjl: that.data.zjl,
            jzjzzc: that.data.jzjzzc,
            lg: that.data.lg,
            qdztqdz: that.data.qdztqdz,
            qt: that.data.qt,
            hcjt: that.data.hcjt,
            wdphg: that.data.wdphg,
            hlg: that.data.hlg,
            csq: that.data.csq,
            fdx: that.data.fdx,
            dpdxdpzj: that.data.dpdxdpzj,
            proposal: that.data.proposal
          })
        }
      },
      success:function(res){
        if (res.data.status == 1){
          wx.reLaunch({
            url:'/pages/index/index'
          })
          setTimeout(()=>{
            wx.showToast({
              title: '提交成功',
              icon: "none"
            })
          },400)
        }else{
          that.setData({
            loading:false
          })
        }
      }
    })
  },

  


  selectTaps() {
    this.setData({
      shows: !this.data.shows
    });
  },
 
  optionTaps(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      indexs: Index,
      shows: !this.data.shows
    });
  },
  
 
  // click:function(){
  //   var id = this.data.list[0].userId
  //   wx.navigateTo({
  //     url: '/pages/address/select/select?addCar=' + 1 +'&userId='+id
  //   })
  // },
  onLoad: function (options) {
    this.technician()
    this.setData({
      startDate: util.getNowFormatDate(false),
      endDate: util.getNowFormatDate(false),
      minDate: util.getNowFormatDate(false)
    })
  },
 
  bindTextAreaBlur: function (e) {
    var proposal=e.detail.value
    this.setData({
      proposal: proposal
    })
  },
  
  radioChange:function(e){
    var value = e.detail.value
    console.log(value)
    var check = this.data.checkList
    for (var i = 0; i < check.length; i++){
      check[i].checked = ''
    }
    check[value].checked = true
    this.setData({
      checkList: check,
      ygq: value,	//雨刮器
      fdjjyw: value, 	//发动机机油位
      blqxy: value, 	//玻璃清洗液
      wbdg: value, //	外部灯光
      fdy: value, 	//防冻液
      scy: value, 	//刹车油
      ybzmd: value, //仪表照明灯
      zlzxjy: value, //助力转向机油
      ltm: value, 	//轮胎面
      ty: value, 	//胎压
      kqlx: value, //空气滤芯
      bsyx: value, 	//变速箱油
      gzpd: value, 	//各种皮带
      zjl: value, 	//涨紧轮
      jzjzzc: value, //	减震 / 减震支撑
      lg: value, 	//拉杆
      qdztqdz: value, //驱动轴套 / 驱动轴
      qt: value, 	//球头
      hcjt: value, 	//缓冲胶套
      wdphg: value, //稳定平衡杆
      hlg: value, //横立杆
      csq: value, //差速器
      fdx: value, //分动箱
      dpdxdpzj: value, 	//电瓶、电线、电瓶支架
    })
  },
  radioChange1: function (e) {
    var value=e.detail.value
    // var qbdg = value
    // console.log(qbdg)
    this.setData({
      ygq: value,
    });
  },
  radioChange2:function(e){
    console.log(e)
    var value = e.detail.value
    // var laba =value
    // console.log(laba)
    this.setData({
      fdjjyw: value,
    });
  },
  radioChange3:function(e){
    console.log(e)
    var value = e.detail.value
    // var ygp = value
    this.setData({
      blqxy: value,
    });
  },
  radioChange4: function (e) {
    console.log(e)
    var value = e.detail.value
    // var psxt = value
    // console.log(psxt)
    this.setData({
      wbdg: value,
    });
  },
  radioChange5: function (e) {
    console.log(e)
    var value = e.detail.value
    // var hbdg = value
    // console.log(hbdg)
    this.setData({
      fdy: value ,
    });
  },
  radioChange6: function (e) {
    console.log(e)
    var value = e.detail.value
    // var qcld = value
    // console.log(qcld)
    this.setData({
      scy: value,
    });
  },
  radioChange7: function (e) {
    var value = e.detail.value
    // var scgj = value
    // console.log(scgj)
    this.setData({
      ybzmd: value,
    });
  },
  radioChange8: function (e) {
    console.log(e)
    var value = e.detail.value
    // var rhmjlhmk = value
    // console.log(rhmjlhmk)
    this.setData({
      zlzxjy: value,
    });
  },
  radioChange9: function (e) {
    console.log(e)
    // var name = "清洁天窗(排水)"
    var value = e.detail.value
    // var qjtc = value
    // console.log(qjtc)
    this.setData({
      ltm: value ,
    });
  },
  radioChange10: function (e) {
    console.log(e)
    // var name = "全车电脑检测(保养复位)"
    var value = e.detail.value
    // var qcdnjc = value
    // console.log(qcdnjc)
    this.setData({
      ty: value,
    });
  },
  radioChange11: function (e) {
    console.log(e)
    var value = e.detail.value
    // var ybgzsd = value
    // console.log(ybgzsd)
    this.setData({
      kqlx: value,
    });
  },
  radioChange12: function (e) {
    console.log(e)
    // var name = "内部照亮"
    var value = e.detail.value
    // var nbzl = value
    // console.log(nbzl)
    this.setData({
      bsyx: value ,
    });
  },
  radioChange13: function (e) {
    console.log(e)
    // var name = "功能开关(遥控器)"
    var value = e.detail.value
    // var gnkg = value
    // console.log(gnkg)
    this.setData({
      gzpd: value,
    });
  },
  radioChange14: function (e) {
    console.log(e)
    // var name = "检查内饰是否有污渍破损"
    var value = e.detail.value
    // var wzps = value
    // console.log(wzps)
    this.setData({
      zjl: value,
    });
  },
  radioChange15: function (e) {
    console.log(e)
    // var name = "空调系统"
    var value = e.detail.value
    // var ktxt = value
    // console.log(ktxt)
    this.setData({
      jzjzzc: value,
    });
  },
  radioChange16: function (e) {
    console.log(e)
    // var name = "空调滤芯(排水)"
    var value = e.detail.value
    // var ktlx = value
    // console.log(ktlx)
    this.setData({
      lg: value,
    });
  },
  radioChange17: function (e) {
    console.log(e)
    // var name = "检查启动是否正常"
    var value = e.detail.value
    // var qidong = value
    // console.log(qidong)
    this.setData({
      qdztqdz: value ,
    });
  },
  radioChange18: function (e) {
    console.log(e)
    // var name = "检查发动机运转是否正常"
    var value = e.detail.value
    // var fdjyz = value
    // console.log(fdjyz)
    this.setData({
      qt: value,
    });
  },
  radioChange19: function (e) {
    console.log(e)
    // var name = "机油液位及泄露"
    var value = e.detail.value
    // var jyywxl =value
    // console.log(jyywxl)
    this.setData({
      hcjt: value,
    });
  },
  radioChange20: function (e) {
    console.log(e)
    // var name = "防冻液液位冰点及泄露"
    var value = e.detail.value
    // var fdyywbdxl = value
    // console.log(fdyywbdxl)
    this.setData({
      wdphg: value,
    });
  },
  radioChange21: function (e) {
    console.log(e)
    // var name = "刹车油液位及泄露"
    var value = e.detail.value
    // var scyywxl = value
    // console.log(scyywxl)
    this.setData({
      hlg: value,
    });
  },
  radioChange22: function (e) {
    console.log(1)
    // var name = "助力油液位及泄露"
    var value = e.detail.value
    // var zlyywxl = value
    // console.log(zlyywxl)
    this.setData({
      csq: value,
    });
  },
  radioChange23: function (e) {
    console.log(e)
    // var name = "变速器液位及泄露"
    var value = e.detail.value
    // var bsqywxl = value
    // console.log(bsqywxl)
    this.setData({
      fdx: value,
    });
  },
  radioChange24: function (e) {
    console.log(e)
    // var name = "机盖撑杆是否正常"
    var value = e.detail.value
    // var jgcg = value
    // console.log(jgcg)
    this.setData({
      dpdxdpzj: value,
    });
  },
})

