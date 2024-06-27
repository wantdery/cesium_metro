<template>
  <div class="center-wrapper">
    <!-- 地铁线路 -->
    <div class="subline_station">
      <div class="subline_header">
        <i class="iconfont icon-dibudaohanglan"></i>地铁线路
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
      <div class="station-wrapper">
        <div class="station" v-for="(item, index) in stationData" :key="index">
          <div
            class="box"
            :style="{
              backgroundColor: stationIndex >= index ? '#eee' : 'rgba(0,0,0,0)',
            }"
          ></div>

          <span :style="{ color: '#34c5cf' }"> {{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import axios from "axios";
import { useLineData } from "@/store";
import { lineColors } from "../store/staticData";
import {
  getPositions,
  getSiteTimes,
  pointsToPositions,
  getSampleData,
  spacePointsDistance,
} from "@/cesiumTools/core";
import SimpleLabel from "../cesiumTools/Bubble/htmlMarker";
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
const lineData = useLineData();
const subLineData = lineData.allData;
console.log(subLineData);
const resultList = ref([]);
const stationData = ref([]);
const currentLine = ref({});
let peopleNum = ref(0);
let viewer, b;
let popupController;
let a = ref(null);
const linecolors = lineColors;
console.log(linecolors, "linecolor");
onMounted(() => {
  viewer = lineData.viewer;
  // axios.get("http://127.0.0.1:8090/api/v1/getLine").then((res) => {
  // console.log(res.data);
  // subLineData.value = res.data.data;
  //console.log()
  resultList.value = subLineData.map((item, index) => {
    return { ...item, color: linecolors[index] };
  });
  console.log(resultList.value);
  console.log(typeof subLineData.value, " subLineData.value");
  // });
  viewer.clock.shouldAnimate = true;
});
let entity, timeObj; //把变量声明出去
const chooseLine = (item) => {
  popupController && popupController.removeMarker();
  stationIndex.value = 0;
  if (entity) {
    viewer.entities.remove(entity);
  }
  //当前选择道路线的数据
  currentLine.value = item;
  console.log(currentLine.value, "currentLine.value");
  resultList.value.forEach((dataItem) => {
    dataItem.isSelected = false;
  });
  item.isSelected = true;
  const { stationsList, id, paths } = item;
  console.log(stationsList, "stationsList");
  //console.log(paths, "paths");
  //获取地铁线的坐标
  const linePositions = getPositions(paths);
  console.log(linePositions, "linePositions");
  //获取地铁站点的坐标数据
  //获取选择该线的站点列表数据
  stationData.value = stationsList;
  const firstStation = stationsList[0].position;
  console.log(firstStation, "firstStation");

  /*   const { position } = stationData.value;
  console.log(position, "position"); */
  //获取时间戳
  timeObj = getSiteTimes(linePositions, 60);
  // console.log(timeObj, "timeObj");
  //从san网站复制过来的
  const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  const stop = Cesium.JulianDate.addSeconds(
    start,
    timeObj.timeSum,
    new Cesium.JulianDate()
  );
  //给系统时间赋值  ,粘贴san网站
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  //viewer.clock.currentTime = newTime.clone(); //当前时间
  viewer.clock.currentTime = start.clone(); //当前时间
  const position = getSampleData(linePositions, start, timeObj.siteTimes);
  //console.log(position, "position");
  //   添加公交车模型
  entity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: start,
        stop: stop,
      }),
    ]),
    model: {
      uri: "/src/assets/model/metro.gltf",
      minimumPixelSize: 40,
      scale: 0.17,
    },
    viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
    position: position,
    orientation: new Cesium.VelocityOrientationProperty(position),
  });
  viewer.trackedEntity = entity;

  //监听笛卡尔坐标
  viewer.clock.onTick.addEventListener(tickEventListener);

  //气泡框
  renderBubble(item);
};
//监听方法
let stationIndex = ref(0); //声明一个变量

/* ---------------------------------------------------------//监听车辆的实时位置-------------------------------------------------------------- */
const tickEventListener = () => {
  //行驶时间
  const diffTime = Cesium.JulianDate.secondsDifference(
    viewer.clock.currentTime,
    Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16))
  );
  //当前点坐标
  a.value = entity.position.getValue(viewer.clock.currentTime);
  // console.log(a, "a");
  //下一个公交站的坐标

  //const c=Object.values()
  b = Cesium.Cartesian3.fromDegrees(
    ...Object.values(stationData.value[stationIndex.value + 1].position)
  );
  //console.log(stationIndex.value);
  //console.log(b, "b");
  let cartographic = Cesium.Cartographic.fromCartesian(a.value);
  let lon = Cesium.Math.toDegrees(cartographic.longitude);
  let lat = Cesium.Math.toDegrees(cartographic.latitude);

  let newPosition = Cesium.Cartesian3.fromDegrees(lon, lat, 2);

  const distance = spacePointsDistance(a.value, b); //距离
  //console.log(distance, "distance");
  //判断到站点,停顿
  if (distance < 50) {
    stationIndex.value += 1;
    viewer.clock.shouldAnimate = false;
    peopleNum.value = Math.ceil(Math.random() * (1000 - 50 + 1) + 50);
    setTimeout(() => {
      viewer.clock.shouldAnimate = true;
    }, 2500);
  }
  // 还需要通过startPosition计算气泡框坐标
  popupController && popupController.changePosition(a.value);
};
//渲染气泡框
const renderBubble = (item) => {
  console.log(item, item);
  const { id, name } = item;
  console.log(id, name, "test1111");
  console.log(a.value, "a");
  peopleNum.value = Math.ceil(Math.random() * (1000 - 50 + 1) + 50);
  popupController = new SimpleLabel(viewer, {
    position: a.value,
    label: null,
    isShow: true,
    color: "#fff",
    scaleByDistance: null,
    offset: [130, 205],
    attr: {
      peopleNum,
      name,
    },
    type: "carPopup",
  });
  console.log(popupController, "popupController");
  popupController.addLabel();
};

onUnmounted(() => {
  viewer.entities.remove(entity);
  popupController && popupController.removeMarker();
  viewer.clock.shouldAnimate = false;
  viewer.clock.onTick.removeEventListener(tickEventListener);
});
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
.subline_header i {
  margin-right: 5px;
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
  min-width: 10px;
  height: 10px;
  border-width: 1px;
  border-style: solid;
  background: transparent;
  user-select: all;
  cursor: pointer;
  transition: all 0.3s linear;
}
.station-wrapper {
  display: flex;
  justify-content: start;
  align-content: space-around;
  flex-wrap: wrap;
  flex: 1;
  padding: 4px;
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 3px;
    height: 10px;
  }
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
.station {
  width: 64.992px;
  height: 20.006px;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.156vw;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid #885f12;
  color: #fff;
  font-size: 0.521vw;
  pointer-events: all;
  margin-left: 15px;
}
.box {
  margin-right: 5px;
}
.station span {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
