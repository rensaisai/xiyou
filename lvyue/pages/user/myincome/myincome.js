var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
//线图 
var lineChart = null;
// 柱状图
var columnChart = null;
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 45, 37,46],
    categories: ['2012', '2013', '2014', '2015','2016']
  },
  // sub: [{
  //   title: '2012年度成交量',
  //   data: [70, 40, 65, 100, 34, 18],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2013年度成交量',
  //   data: [55, 30, 45, 36, 56, 13],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2014年度成交量',
  //   data: [76, 45, 32, 74, 54, 35],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }, {
  //   title: '2015年度成交量',
  //   data: [76, 54, 23, 12, 45, 65],
  //   categories: ['1', '2', '3', '4', '5', '6']
  // }]
};
//园
var ringChart = null;
var ringChart1 = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //点击线图圆点查看详情  
  // touchHandler: function (e) {
  //   console.log(lineChart.getCurrentDataIndex(e));
  //   lineChart.showToolTip(e, {
  //     // background: '#7cb5ec',
  //     format: function (item, category) {
  //       return category + ' ' + item.name + ':' + item.data
  //     }
  //   });
  // },
  //线图x轴显示的内容 
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 5; i++) {
      categories.push('');
      data.push(Math.random() * (20 - 10) + 10);
    }
    console.log(categories)
    console.log(data)
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
  // updateData: function () {
  //   var simulationData = this.createSimulationData();
  //   var series = [{
  //     name: '成交量1',
  //     data: simulationData.data,
  //     format: function (val, name) {
  //       return val.toFixed(2) + '万';
  //     }
  //   }];
  //   lineChart.updateData({
  //     categories: simulationData.categories,
  //     series: series
  //   });
  // },
  backToMainChart: function () {
    this.setData({
      chartTitle: chartData.main.title,
      // isMainChartDisplay: true
    });
    columnChart.updateData({
      categories: chartData.main.categories,
      series: [{
        name: '成交量',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }]
    });
  },
  //点击柱状图 
  // touchHandler: function (e) {
  //   var index = columnChart.getCurrentDataIndex(e);
  //   if (index > -1 && index < chartData.sub.length && this.data.isMainChartDisplay) {
  //     this.setData({
  //       chartTitle: chartData.sub[index].title,
  //       isMainChartDisplay: false
  //     });
  //     columnChart.updateData({
  //       categories: chartData.sub[index].categories,
  //       series: [{
  //         name: '成交量',
  //         data: chartData.sub[index].data,
  //         format: function (val, name) {
  //           return val.toFixed(2) + '万';
  //         }
  //       }]
  //     });
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var windowWidth = '100%';
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
//线图 
    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,              
      animation: true, 
      legend:false,                
      //x轴显示的内容 
      series: [
       {
        name: '',
        color:'#D5A660',
        data: simulationData.data,
        format: function (val, name) {
          console.log(val,name)
          return val.toFixed(2) + '万';
        }
      }
      ],
      //x轴 
      xAxis: {
        disableGrid: true, 
      },
      //y轴的内容 
      yAxis: {
        // title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 115,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
//柱状 
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      legend: false,
      categories: chartData.main.categories,
      series: [{
        name: '',
        color: '#E31436',
        data: chartData.main.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      yAxis: {
        // format: function (val) {
        //   return val + '万';
        // },
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 105,
    });
    // 园
    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: 10
        }
      },
      series: [{
        name: '成交量1',
        data: 15,
        color: '#D5A660',
        stroke: false
      }, {
        name: '成交量2',
        data: 30,
        color:'#E31436',
        stroke: false
      },],
      disablePieStroke: true,
      width: windowWidth,
      height: 180,
      dataLabel: true,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });
    ringChart1 = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas1',
      type: 'ring',
      extra: {
        ringWidth: 25,
        pie: {
          offsetAngle: 10
        }
      },
      series: [{
        name: '成交量1',
        data: 15,
        color: '#D5A660',
        stroke: false
      }, {
        name: '成交量2',
        data: 35,
        color: '#E31436',
        stroke: false
      },],
      disablePieStroke: true,
      width: windowWidth,
      height: 180,
      dataLabel: true,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})