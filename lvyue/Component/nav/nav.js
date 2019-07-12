// Component/nav.js
Component({
  /**
   * 组件的属性列表
   * 
   */

  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    open: false,
    npm: false,
    zuan: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dlogin() {
      this.setData({
        open: !this.data.open,
        npm:!this.data.npm,
        zuan:!this.data.zuan
      })
    }
  }
})
