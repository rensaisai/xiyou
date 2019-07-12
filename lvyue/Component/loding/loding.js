// Component/loding/loding.js
Component({
  /**
   * 组件的属性列表
   */
  externalClasses:['lod'],
  properties: {
    loadingType: {
      type: Number,
      value: 0
    },
    loadingText: {
      type: Array,
      value: ["上拉加载更多", "", "已加载全部数据..."]
    },
    show: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
