
<!-- 运营统计 -->
<template>
    <div class="operateStatic">
      <div class="tip">
        <span>截至{{ nowaday }}，年度安全运营天数 <span class="count">3618</span>天
        </span>
      </div>
      <div class="chart-part">
        <div id="operateChart" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>
  </template>
    
  <script setup>
  import dayjs from "dayjs";
  import * as echarts from "echarts";
  import { ref,onMounted,watch } from "vue";
  import { operateOpts } from "@/cesiumTools/echartsOpts";
  import { watchLineData } from '@/store'
  const nowaday = ref(dayjs().format("YYYY/M/DD"));

  
  onMounted( async() => {
    // 监听pinia仓库中的lineData
    const lineData=await watchLineData();
    // var lineData = lineData=lineDataStore.lineData
    initChart(lineData);
    // console.log("28")
  });


  
  const initChart = (dataSource) => {
    console.log("运营统计","32")
    const myChart = echarts.init(document.getElementById("operateChart"));
    const data = dataSource.map((item) => ({
      name: item.name,
      value: Number(item.length),
    }));
    const options = operateOpts(data);
    myChart.setOption(options);
  };


  </script>
  <style scoped>
  .operateStatic {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .tip {
    height: 30px;
    width: 100%;
    font-size: 14px;
    color: #fff;
    text-align: center;
    margin-top: 10px;
  }
  
  .count {
    font-size: 26px;
    color: #ef9c00;
    letter-spacing: 3px;
  }
  
  .chart-part {
    flex: 1;
    display: flex;
    pointer-events: all;
    padding-left: 10px;
  }
  
  #operateChart {
    pointer-events: all;
  }
  
  .dataList {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .data-item {
    width: 50%;
    color: #fff;
  }
  </style>
    