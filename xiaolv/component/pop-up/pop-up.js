// component/pop-up/pop-up.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showModaler: {
      type: Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.scale3d(0, 0, 0).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.scale3d(1, 1, 1).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 150)
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
