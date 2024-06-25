
<!-- 客流指标 -->
<template>
    <div class="wrapper">
      <div class="title-banner">
        <div>
          <img src="/src/assets/uiResources/网格员.png" alt="" />
          <span class="title">线路实时客流量</span>
        </div>
        <div>
          <span class="mount">5634</span>
          <span class="unit">/小时</span>
        </div>
      </div>
      <div class="chart-area">
        <div class="rate-list">
          <i
            v-for="item in [1, 2, 3, 4]"
            :class="['iconfont', `metro-NO-${item}`, `rand-${item}`]"
          ></i>
        </div>
        <div class="chart-wrapper">
          <div id="guests_chart" width="100%" height="100%"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import * as echarts from "echarts";
  import { onMounted } from "vue";
  import { guestsRateOpts } from "@/cesiumTools/echartsOpts";
  
  const dataSource = [
    {
      name: "一号线",
      value: 1300,
    },
    {
      name: "二号线",
      value: 1100,
    },
    {
      name: "四号线",
      value: 1000,
    },
    {
      name: "七号线",
      value: 600,
    },
  ];
  
  onMounted(async () => {
    initChart();
  });
  
  const initChart = () => {
    const myChart = echarts.init(document.getElementById("guests_chart"));
    const options = guestsRateOpts(dataSource);
    myChart.setOption(options);
  };
  </script>
  <style scoped lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px;
  }
  
  .title-banner {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url("/assets/uiResources/圆角矩形.png");
    background-size: 100% 100%;
    padding: 0 20px;
  }
  
  .title-banner img {
    width: 40px;
    height: 40px;
  }
  
  .title {
    color: #fff;
    font-size: 16px;
    margin-left: 20px;
  }
  
  .mount {
    font-size: 20px;
    color: #4faccb;
    font-weight: bold;
  }
  
  .unit {
    font-size: 12px;
    color: #90a9c5;
  }
  
  .chart-area {
    width:70%;
    height: 100%;
    display: flex;
  }
  
  .chart-wrapper{
    flex: 1;
    #guests_chart{
      width:100%;
      height:200px;
      >div{
        height: 200px;
      }
    }
  }
  
  .rate-list {
    width:50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
  
  .rate-list > i {
    font-size: 17px;
  }
  
  .rand-1 {
    color: #ffd31a;
  }
  
  .rand-2 {
    color: #dadada;
  }
  
  .rand-3 {
    color: #ffa70b;
  }
  
  .rand-4 {
    color: #1b9017;
  }
  </style>
  