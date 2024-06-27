<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-21 10:57:22
 * @LastEditors: your name
 * @LastEditTime: 2024-05-22 11:34:53
-->
<!-- 路径规划展示面板 -->
<template>
  <div class="display-card">
    <a-card
      title="路线概览"
      style="margin-bottom: 10px; background: transparent; color: #fff"
      :bordered="false"
      size="small"
    >
      <div class="header">
        <div class="item-wrapper">
          <div
            class="header-item"
            v-for="(item, index) in headerTitles"
            :key="index"
          >
            <i class="iconfont metro-ditie"></i>
            <span style="margin-left: 4px">{{ item }}</span>
            <span v-if="index !== headerTitles.length - 1">></span>
          </div>
        </div>
        <div
          style="
            font-size: 18px;
            font-weight: bold;
            color: rgb(156, 148, 218);
            line-height: 25px;
            margin-left: 20px;
          "
        >
          {{ distanceTotal }}
          <span style="font-size: 10px; color: #ddd">公里</span>
        </div>
      </div>
    </a-card>

    <a-card
      title="路线详情"
      style="background: transparent; color: #fff"
      :bordered="false"
      size="small"
    >
      <div class="detail">
        <a-collapse v-model:activeKey="activeKey" ghost>
          <a-collapse-panel
            :key="sitem.id"
            v-for="(sitem, sIndex) in stationInfo"
            :style="collapseStyle"
          >
            <template #header>
              <div class="header-collapse">
                {{ sitem.name }}
                <div class="changed" v-if="changeStations[sIndex]">
                  <i
                    class="iconfont metro-ly_huancheng"
                    style="color: #9c94da"
                  ></i>
                  {{ changeStations[sIndex].name }}
                  <span style="color: #ddd; font-size: 12px">站内换乘</span>
                </div>
              </div>
            </template>
            <a-card
              style="
                padding-left: 20px;
                position: relative;
                margin-bottom: 10px;
                height: 200px;
                color: #fff;
              "
              :bordered="false"
              :style="{ backgroundColor: getOpacityColor(sitem.color, 0.5) }"
              size="small"
            >
              <div
                class="line"
                :style="{ backgroundColor: getOpacityColor(sitem.color, 0.7) }"
              >
                <div class="icon">
                  <i class="iconfont metro-ditie"></i>
                </div>
              </div>
              <div
                class="departure"
                @click="jumpStation(sitem.departure_stop, sitem)"
              >
                {{ sitem.departure_stop.name }}
                <span style="color: #ddd; font-size: 12px; margin-left: 10px"
                  >上车</span
                >
              </div>
              <div
                class="arrival"
                @click="jumpStation(sitem.arrival_stop, sitem)"
              >
                {{ sitem.arrival_stop.name }}
                <span style="color: #ddd; font-size: 12px; margin-left: 10px"
                  >下车</span
                >
              </div>
              <hr />
              <div class="via_station">
                <div
                  class="station"
                  v-for="(item, index) in sitem.via_stops"
                  @click="jumpStation(item, sitem)"
                  :key="index * Math.random()"
                >
                  {{ item.name }}
                </div>
              </div>
            </a-card>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { focusOnStation } from "@/cesiumTools/effectController";
import { useLineData } from "@/store";
const lineData = useLineData();
let viewer;

onMounted(() => {
  viewer = lineData.Viewer;
});

// routeInfo结构
// stop {id,location:'114,30',name,type}
// {distance:String,stations:[arrival_stop:{},departure_stop,distance:String,name,via_stops:Array<stop>]}
const props = defineProps({
  routeInfo: {
    type: Object,
    default: {},
  },
  cacheData: {
    type: Object,
    default: {},
  },
});

console.log(props.routeInfo);

const collapseStyle =
  "border-radius: 4px;max-height:240px;border: 0;overflow-y: hidden;margin-bottom:4px;";

const activeKey = ref([]);

// 标题
const headerTitles = computed(() => {
  console.log(props.routeInfo);
  return props.routeInfo.stations.map((item) => item.name.split("(")[0]);
});

const distanceTotal = computed(() => {
  const distance = (Number(props.routeInfo.distance) / 1000).toFixed(1);
  return `${distance}`;
});

const stationInfo = computed(() => {
  return props.routeInfo.stations;
});

const changeStations = computed(() => {
  const result = props.routeInfo.stations
    .filter((item) => {
      const { arrival_stop } = item;
      return arrival_stop.type === "换乘站";
    })
    .map((m) => m.arrival_stop);
  return result;
});

const getOpacityColor = (thisColor, thisOpacity) => {
  let theColor = thisColor.toLowerCase();
  //十六进制颜色值的正则表达式
  let r = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  // 如果是16进制颜色
  if (theColor && r.test(theColor)) {
    if (theColor.length === 4) {
      let sColorNew = "#";
      for (let i = 1; i < 4; i += 1) {
        sColorNew += theColor.slice(i, i + 1).concat(theColor.slice(i, i + 1));
      }
      theColor = sColorNew;
    }
    //处理六位的颜色值
    let sColorChange = [];
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + theColor.slice(i, i + 2)));
    }
    return "rgba(" + sColorChange.join(",") + "," + thisOpacity + ")";
  }
  return theColor;
};

// 点击站点，跳转到站点
const jumpStation = (item, lineData) => {
  focusOnStation(viewer, item.name, props.cacheData);
};
</script>
<style scoped>
.display-card {
  width: 500px;
  position: absolute;
  right: 14%;
  top: 26%;
  pointer-events: all;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #885f12;
}

.item-wrapper {
  display: flex;
  font-size: 12px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.header-item {
  margin: 0 5px;
}

.line {
  position: absolute;
  top: 4px;
  left: 10px;
  width: 4px;
  height: 185px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line::after {
  content: "";
  position: absolute;
  left: 50%;
  top: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #fff;
  transform: translateX(-50%);
}

.line::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #fff;
  transform: translateX(-50%);
}

.icon {
  padding: 4px;
  border-radius: 50%;
}

.via_station {
  max-height: 110px;
  overflow-y: scroll;
  margin: 10px 0;
  color: #ddd;
  cursor: pointer;
}

.station:hover {
  background-color: #885f12;
}

.arrival,
.departure {
  margin-bottom: 4px;
  cursor: pointer;
}

.header-collapse {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
