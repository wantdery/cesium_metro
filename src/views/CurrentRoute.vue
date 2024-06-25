<template>
  <div class="center-wrapper">
    <!-- 地铁线路 -->
    <div class="subline_station">
      <div class="subline_header">
        <i class="iconfont icon-dibudaohanglan-"></i>地铁线路
      </div>
      <div class="item-wrapper">
        <div
          class="subline_list"
          v-for="(item, index) in resultList"
          :key="index"
        >
          <div
            class="box"
            :style="{
              borderColor: item.color,
              backgroundColor: item.isSelected ? item.color : 'rgba(0,0,0,0)',
            }"
            @click="chooseLine(item)"
          ></div>
          <span :style="{ color: '#34c5cf' }"> {{ item.name.slice(-3) }}</span>
        </div>
      </div>
    </div>
    <!-- 站点展示 -->
    <div class="station_list">
      <div class="subline_header">
        <i class="iconfont icon-ditie"></i>地铁站点
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import axios from "axios";
import { useLineData } from "@/store";
import { lineColors } from "../store/staticData";
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
//const lineData = useLineData();
const subLineData = ref([]);
const resultList = ref([]);
const linecolors = lineColors;
console.log(linecolors, "linecolor");
onMounted(() => {
  axios.get("http://127.0.0.1:8090/api/v1/getLine").then((res) => {
    console.log(res.data);
    subLineData.value = res.data.data;
    //console.log()
    resultList.value = subLineData.value.map((item, index) => {
      return { ...item, color: linecolors[index] };
    });
    console.log(resultList.value);
    console.log(typeof subLineData.value, " subLineData.value");
  });
});
const chooseLine = (item) => {
  item.isSelected = !item.isSelected;
  if (item.isSelected) {
    dataItem.isSelected = false;
    resultList.forEach((dataItem) => {
      if (dataItem !== item) {
        dataItem.isSelected = false;
      }
    });
  }
};
</script>

<style scoped>
.subline_station {
  position: absolute;
  bottom: 0;
  left: 32.5%;
  transform: translateX(-50%);
  width: 180px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #ab7818;
  display: flex;
  flex-direction: column;
}
.subline_header {
  width: 100%;
  height: 30px;
  background-size: contain;
  color: #fff;
  background-repeat: no-repeat;
  line-height: 30px;
  margin-left: 10px;
  background: rgb(255, 255, 255);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 9%,
    rgba(211, 156, 50, 1) 57%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.subline_header img {
  width: 20px;
  height: 20px;
}
.item-wrapper {
  display: flex;
  justify-content: space-around;
  align-content: space-around;
  flex-wrap: wrap;
  flex: 1;
  padding: 4px;
  overflow: hidden;
}
.subline_list {
  width: 64.992px;
  height: 20.006px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.156vw;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid #885f12;
  color: #fff;
  font-size: 0.521vw;
  pointer-events: all;
}
.box {
  width: 10px;
  height: 10px;
  border-width: 1px;
  border-style: solid;
  background: transparent;
  user-select: all;
  cursor: pointer;
  transition: all 0.3s linear;
}
.station_list {
  position: absolute;
  bottom: 0;
  left: 53.5%;
  transform: translateX(-50%);
  width: 600px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #ab7818;
  display: flex;
  flex-direction: column;
}
</style>
