/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-09 13:28:37
 * @LastEditors: your name
 * @LastEditTime: 2024-05-09 14:10:41
 */
import * as echarts from "echarts";
import { lineColors } from "../store/staticData";

// 故障率曲线
const mistakeOpts = (dataSource) => {
  const option = {
    backgroundColor: "rgba(0,0,0,0)",
    grid: {
      left: "5%",
      right: "10%",
      top: "10%",
      bottom: "0%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(50, 216, 205, 1)",
        },
      },
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: 1,
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "#A1A7B3",
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },

        data: dataSource.map((item) => item.name),
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "",
        padding: 5,
        splitLine: {
          show: true,
          lineStyle: {
            color: "#A1A7B3",
            type: "dashed",
          },
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: true,
          margin: 10,
       
            color: "#A1A7B3",
         
        },
        axisTick: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "今日",
        type: "line",
        smooth: true,
        stack: "总量",
        symbolSize: 5,
        showSymbol: false,
        itemStyle: {
          normal: {
            color: "#23D0C4",
            lineStyle: {
              color: "#23D0C4",
              width: 2,
            },
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "rgba(50, 216, 205, 1)",
                },
                {
                  offset: 1,
                  color: "rgba(255, 255, 255, 0.2)",
                },
              ],
              false
            ),
          },
        },
        data: dataSource.map((item) => item.value),
      },
    ],
  };
  return option;
};

// 建设开工情况
// myChart echarts对象
// dataSource Array<{name,value}>
export const constructionOpts = (myChart, dataSource) => {
  const data = [];
  const data2 = [];
  for (let i = 0; i < dataSource.length; i++) {
    data.push(
      {
        value: dataSource[i].value,
        name: dataSource[i].name,
        itemStyle: {
          normal: {
            borderWidth: 8,
            shadowBlur: 20,
            borderRadius: 20,
            borderColor: lineColors[i],
            shadowColor: lineColors[i],
          },
        },
      },
      {
        value: 5,
        name: "",
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            color: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 0)",
            borderWidth: 0,
          },
        },
      }
    );
    data2.push(
      {
        value: dataSource[i].value,
        name: dataSource[i].name,
      },
      {
        value: 5,
        name: "",
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            color: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(0, 0, 0, 0)",
            borderWidth: 0,
            opacity: 0.2,
          },
        },
      }
    );
  }

  let angle = 0; //角度，用来做简单的动画效果的
  const option = {
    backgroundColor: "#061740",
    color: lineColors,
    legend: {
      right: "10%",
      top: "40%",
      icon: "rect",
      itemWidth: 15,
      itemHeight: 15,
    
        color: "#ffffff",
      
    },
    series: [
      {
        //外线1
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 3,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((0 + angle) * Math.PI) / 180,
              endAngle: ((90 + angle) * Math.PI) / 180,
            },
            style: {
              stroke: "#4EE9E6",
              fill: "transparent",
              lineWidth: 1.5,
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //内线1
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 3,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((180 + angle) * Math.PI) / 180,
              endAngle: ((270 + angle) * Math.PI) / 180,
            },
            style: {
              stroke: "#4EE9E6",
              fill: "transparent",
              lineWidth: 1.5,
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //外线2
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 3,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((270 + -angle) * Math.PI) / 180,
              endAngle: ((40 + -angle) * Math.PI) / 180,
            },
            style: {
              stroke: "#4EE9E6",
              fill: "transparent",
              lineWidth: 1.5,
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //外线2
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          return {
            type: "arc",
            shape: {
              cx: api.getWidth() / 3,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((90 + -angle) * Math.PI) / 180,
              endAngle: ((220 + -angle) * Math.PI) / 180,
            },
            style: {
              stroke: "#4EE9E6",
              fill: "transparent",
              lineWidth: 1.5,
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //绿点1
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 3;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
          let point = getCirlPoint(x0, y0, r, 90 + -angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4,
            },
            style: {
              stroke: "#66FFFF", //粉
              fill: "#66FFFF",
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //绿点2
        name: "ring5", //绿点
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 3;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65;
          let point = getCirlPoint(x0, y0, r, 270 + -angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4,
            },
            style: {
              stroke: "#66FFFF", //粉
              fill: "#66FFFF",
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //绿点3
        name: "ring5",
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 3;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
          let point = getCirlPoint(x0, y0, r, 90 + angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4,
            },
            style: {
              stroke: "#66FFFF", //粉
              fill: "#66FFFF",
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        //绿点4
        name: "ring5", //绿点
        type: "custom",
        coordinateSystem: "none",
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 3;
          let y0 = api.getHeight() / 2;
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6;
          let point = getCirlPoint(x0, y0, r, 270 + angle);
          return {
            type: "circle",
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4,
            },
            style: {
              stroke: "#66FFFF", //粉
              fill: "#66FFFF",
            },
            silent: true,
          };
        },
        data: [0],
      },
      {
        name: "",
        type: "pie",
        clockWise: false,
        radius: ["98%", "95%"],
        hoverAnimation: false,
        center: ["33.33%", "50%"],
        top: "center",
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
          },
        },
        data: data,
      },
      {
        type: "pie",
        top: "center",
        startAngle: 90,
        clockwise: false,
        center: ["33.33%", "50%"],
        legendHoverLink: false,
        hoverAnimation: false,
        radius: ["94%", "55%"],
        itemStyle: {
          opacity: 0.15,
        },
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: data2,
      },
      {
        name: "",
        type: "pie",
        clockWise: false,
        center: ["33.33%", "50%"],
        radius: ["39%", "38%"],
        hoverAnimation: false,
        top: "center",
        itemStyle: {
          normal: {
            label: {
              show: false,
            },
          },
        },
        data: data,
      },
    ],
  };

  //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
  function getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
    let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
    return {
      x: x1,
      y: y1,
    };
  }

  function draw() {
    angle = angle + 3;
    myChart.setOption(option, true);
    window.requestAnimationFrame(draw);
  }

  draw();
};

// 运营统计
// dataSource Array<{name,value}>
export const operateOpts = (dataSource) => {
  const img2 =
    "data:image/png;base64,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";
  const img =
    "data:image/png;base64,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";
  // 所有线路运营长度
  const sum = dataSource.reduce((cur, pre) => {
    return cur + pre.value;
  }, 0);
  const data = [];
  const legendData = [];
  dataSource.forEach((item, index) => {
    const { name, value } = item;
    let legendName = name.slice(-3) + "--" + value.toFixed(1) + "公里";
    legendData.push(legendName);
    data.push(
      {
        value: value.toFixed(0),
        name: legendName,
        itemStyle: {
          borderWidth: 5,
          shadowBlur: 20,
          borderColor: lineColors[index],
          shadowColor: lineColors[index],
        },
      },
      {
        value: sum / 25,
        name: "",
        itemStyle: {
          label: {
            show: false,
          },
          labelLine: {
            show: false,
          },
          color: "rgba(0, 0, 0, 0)",
          borderColor: "rgba(0, 0, 0, 0)",
          borderWidth: 0,
        },
      }
    );
  });
  const seriesOption = [
    {
      name: "",
      type: "pie",
      radius: [55, 59],
      center: ["18.4%", "center"],
      emphasis: {
        scale: false,
      },
      label: {
        show: false,
      },
      data: data,
    },
  ];

  const option = {
    backgroundColor: "rgba(0,0,0,0)",
    color: lineColors,
    graphic: {
      elements: [
        {
          type: "image",
          z: 3,
          style: {
            image: img2,
            width: 90,
            height: 90,
          },
          left: "9.4%",
          top: "center",
          position: [50, 50],
        },
        {
          type: "image",
          z: 3,
          style: {
            image: img,
            width: 30,
            height: 30,
          },
          left: "15.6%",
          top: "32%",
          position: [60, 100],
        },
        {
          type: "text",
          z: 3,
          style: {
            text: sum.toFixed(1),
            fill: "#fff",
            fontWeight: 400,
            fontSize: 12,
          },
          left: "15.5%",
          top: "60%",
          position: [100, 100],
        },
        {
          type: "text",
          z: 3,
          style: {
            text: "线路运营长度",
            fill: "#fff",
            fontWeight: 400,
            fontSize: 12,
          },
          left: "11.5%",
          top: "52%",
          position: [100, 100],
        },
        {
          type: "image",
          z: 3,
          style: {
            image: img2,
            width: 140,
            height: 140,
          },
          left: "4.5%",
          top: "center",
          position: [150, 150],
        },
      ],
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      icon: "roundRect",
      orient: "horizontal",
      data: legendData,
      right: 50,
      top: 30,
      align: "right",
      textStyle: {
        color: "#fff",
      },
      itemGap: 19,
      itemWidth: 20,
      itemHeight: 10,
      width: 380,
      itemStyle: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowBlur: 12,
      },
    },
    series: seriesOption,
  };

  return option;
};

// 客流指标
export const guestsRateOpts = (dataSource) => {
  let salvProName = dataSource.map((item) => item.name);
  let salvProValue = dataSource.map((item) => item.value);
  let salvProMax = []; //背景按最大值
  for (let i = 0; i < salvProValue.length; i++) {
    salvProMax.push(1400);
  }

  const getSymbolData = (data) => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      arr.push({
        value: data[i],
        symbolPosition: "end",
      });
    }
    return arr;
  };

  const option = {
    backgroundColor: "rgba(0, 0, 0, 0)",
    grid: {
      left: "18%",
      right: "0%",
      bottom: "-2%",
      top: "0%",

    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "none",
      },
      formatter: function (params) {
        return params[0].name + " : " + params[0].value;
      },
    },
    xAxis: {
      show: false,
      type: "value",
    },
    yAxis: [
      {
        type: "category",
        inverse: true,
        axisLabel: {
          show: true,
         
            color: "#C4F1FF",
        
          rich: {
            a: {
              color: "#C4F1FF",
              fontWeight: "800",
              fontSize: 12,
            },
          },
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        data: salvProName,
      },
      {
        type: "category",
        inverse: true,
        axisTick: "none",
        axisLine: "none",
        show: true,
        axisLabel: {
         
            color: "#C4F1FF",
            // fontSize: '12',
            fontWeight: "800",
          
        },
        data: salvProValue,
      },
    ],
    series: [
      {
        name: "值",
        type: "bar",
        zlevel: 1,
        itemStyle: {
         
          borderRadius: 30,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: "rgb(10, 116, 255,1)",
              },
              {
                offset: 1,
                color: "rgb(127,237,241,1)",
              },
            ]),
         
        },
        z: 2,
        barWidth: 6,
        data: salvProValue,
      },
      {
        name: "XXX",
        type: "pictorialBar",
        symbol:
          "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==",
        symbolSize: [40, 40],
        symbolOffset: [20, 0],
        z: 10086,
        itemStyle: {
         
            color: "#0A74FF",
         
        },
        data: getSymbolData(salvProValue),
      },
      {
        name: "背景",
        type: "bar",
        barWidth: 6,
        barGap: "-100%",
        data: salvProMax,
        itemStyle: {
         
            color: "rgba(127,237,241,.4)",
            borderRadius: 30,
            // backgroundColor:'#091C24'
            // borderColor:'#00D1F0'
         
        },
        z: 1,
      },
    ],
  };
  return option;
};

// 历史报警
// dataSource {去年:[{name:'一月',value:50},...],今年:[{name:'一月',value:50},...]}
export const historyWarning = (dataSource) => {
  const color = ["#1890FF", "#42d7b3"];
  const legendData = Object.keys(dataSource);
  const seriesData = [];
  let index = 0;
  for (let key in dataSource) {
    const data = dataSource[key].map((item) => item.value);
    seriesData.push({
      name: key,
      type: "line",
      smooth: true,
      symbol: "none", // 不显示连接点
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "line", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      lineStyle: {
        width: 3,
        shadowColor: color[index],
        shadowBlur: 20,
      },
      areaStyle: {
        opacity: 1,
        //右下左上
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color:
              index === 0 ? "rgba(24, 144, 255, .5)" : "rgba(71, 176, 138, .5)",
          },
          {
            offset: 0.3,
            color:
              index === 0 ? "rgba(24, 144, 255, .2)" : "rgba(71, 176, 138, .2)",
          },
          {
            offset: 1,
            color:
              index === 0 ? "rgba(24, 144, 255, 0)" : "rgba(71, 176, 138, 0)",
          },
        ]),
      },
      data: data,
    });
    index++;
  }

  const option = {
    backgroundColor: "rgba(0,0,0,0)",
    color: color,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: "7%",
      right: "7%",
      bottom: "6%",
      top: "17%",
      containLabel: true,
    },
    legend: {
      icon: "rect",
      orient: "horizontal",
      left: "right",
      itemWidth: 12,
      itemHeight: 12,
      
        color: "#fff",
        fontSize: "12px",
      
      data: legendData,
    },
    xAxis: [
      {
        type: "category",
        data: [
          "1月",
          "2月",
          "3月",
          "4月",
          "5月",
          "6月",
          "7月",
          "8月",
          "9月",
          "10月",
          "11月",
          "12月",
        ],
        boundaryGap: false,
        axisTick: {
          show: false, // 不显示坐标轴刻度线
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "rgba(230, 247, 255, 0.50)",
          fontSize: 12,
        },
      },
    ],
    yAxis: [
      {
        name: '(次数)',
        type: "value",
        nameTextStyle: {
          align: 'right',
          color: 'rgba(230, 247, 255, 0.50)',
        },
        //y右侧文字
        axisLabel: {
          color: "rgba(230, 247, 255, 0.50)",
          fontSize: 12,
        },
        // y轴的分割线
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "rgba(230, 247, 255, 0.20)",
          },
        },
      },
    ],
    series: seriesData,
  };
  return option;
};
