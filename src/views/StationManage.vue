<template>
  <div id="station_manage">
    <div class="left-wrapper">
      <div class="query-controller">
        <div style="color: rgb(255, 255, 255); margin-bottom: 4px">
          查询模式选择
        </div>
        <div class="divide"></div>
        <div
          class="query_item"
          v-for="item in stationMangeArr"
          :key="item.id"
          @click="chooseQueryMode(item)"
        >
          <i :class="['iconfont', item.icon, 'commonIcon']"></i>
          <span class="query-item-title">{{ item.title }}</span>
        </div>
      </div>
    </div>
    <div class="center-wrapper" v-if="!isInRouteDesign">
      <!-- 地铁线路 -->
      <div class="subline_station">
        <div class="subline_header">
          <i class="iconfont metro-lineRoute"></i>地铁线路
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
                backgroundColor:
                  item.name === currentLine.name ? item.color : 'rgba(0,0,0,0)',
              }"
              @click="chooseLine(item)"
            ></div>
            <span :style="{ color: '#34c5cf' }">
              {{ item.name.slice(-3) }}</span
            >
          </div>
        </div>
      </div>
      <!-- 站点展示 -->
      <div class="station_list">
        <div class="subline_header">
          <i class="iconfont metro-ditie"></i>地铁站点
        </div>
        <div class="station-wrapper">
          <div
            class="station"
            v-for="(item, index) in stationList"
            :key="index"
            @click="selectStation(item)"
          >
            <div
              :class="[
                'box',
                item.name === currentStation.name ? 'active' : '',
              ]"
            ></div>
            <span :style="{ color: '#34c5cf' }"> {{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="legend">
        <div class="title">
          <span style="margin-right: 14px">图标</span>
          <span>站控措施</span>
        </div>
        <div class="query-item" v-for="item in stationSolutionsArr" :key="item">
          <i :class="['iconfont', item.iconName, 'commonIcon']"></i>
          <div class="query-item-title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
    <RouteDesign v-if="isInRouteDesign" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { stationMangeItems, station_solutions } from "@/store/staticData.js";
import RouteDesign from "./RouteDesign.vue";
import { focusOnStation, renderHeat } from "@/cesiumTools/effectController.js";
import { lineColors } from "../store/staticData";
import { useLineData, useMeasureData } from "@/store";
import * as Cesium from "cesium";
const lineData = useLineData();
const measureDataStore = useMeasureData();
const subLineData = lineData.allData;
const resultList = ref([]);
const stationList = ref([]);
const currentStation = ref({});
const currentLine = ref({});
let viewer;

const isInRouteDesign = ref(false);

console.log(stationMangeItems);
console.log(subLineData, "subLineData");
const stationMangeArr = ref(stationMangeItems);
const stationSolutionsArr = ref(station_solutions);

onMounted(() => {
  viewer = lineData.viewer;
  resultList.value = subLineData.map((item, index) => {
    return { ...item, color: lineColors[index] };
  });
});

onBeforeUnmount(() => {
  recoverEffect();
});

const recoverEffect = () => {
  destroyHeat && destroyHeat();
  isInRouteDesign.value = false;
  measureDataStore.clearData();
};

const chooseLine = (line) => {
  stationList.value = line.stationsList;
  currentLine.value = line;
};

const selectStation = (station) => {
  currentStation.value = station;
  focusOnStation(viewer, station.name);
};
let destroyHeat;
const renderClowed = () => {
  const dataSource = [];
  subLineData.forEach((item) => {
    const { stationsList } = item;
    stationsList.forEach((station) => {
      const { position } = station;
      dataSource.push({
        x: position.lng,
        y: position.lat,
        value: Math.ceil(Math.random() * 1000),
      });
    });
  });
  destroyHeat = renderHeat(viewer, dataSource);
};

const renderStationMeasure = () => {
  const getRamdomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getRandomArrayValue = (arr, num) => {
    let recArr = arr.slice(0),
      i = arr.length,
      min = i - num,
      item,
      index;
    while (i-- > min) {
      index = Math.floor(Math.random() * (i + 1));
      item = recArr[index];
      recArr[index] = recArr[i];
      recArr[i] = item;
    }
    return recArr.slice(min);
  };

  const resultData = [];
  lineData.allData.forEach((line) => {
    const { stationsList, color } = line;
    const result = stationsList.map((station) => {
      const measureNum = getRamdomNumber(0, 5);
      let measures = getRandomArrayValue(station_solutions, measureNum);
      station.measures = measures;
      station.color = color;
      return {
        name: station.name,
        measures: measures,
      };
    });
    resultData.push(result);
  });
  measureDataStore.setData(resultData);
};

const chooseQueryMode = (item) => {
  recoverEffect();
  switch (item.id) {
    case "lineCrowd":
      renderClowed();
      break;
    case "stationAround":
      break;
    case "pathDesign":
      isInRouteDesign.value = true;
      break;
    case "stationControl":
      renderStationMeasure();
      break;
  }
};
</script>

<style lang="scss" scope>
#station_manage {
  .left-wrapper {
    width: 23.438vw;
    height: 100%;
    position: absolute;
    left: 0;
    top: 2.083vw;
    .query-controller {
      position: relative;
      width: 10.417vw;
      display: flex;
      flex-direction: column;
      margin-left: 1.771vw;
      margin-top: 1.042vw;
      .divide {
        width: 1px;
        height: 86%;
        position: absolute;
        top: 30px;
        left: 40px;
        background-color: rgba(224, 193, 193, 0.693);
      }
      .query_item {
        margin: 4px;
        color: #fff;
        display: flex;
        align-items: center;
        .commonIcon {
          padding: 2px 6px;
          font-size: 14px;
          background: url(/src/assets/uiResources/icon-wrapper.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          pointer-events: all;
          cursor: pointer;
        }
        .commonIcon:hover {
          background: url(/src/assets/uiResources/icon-wrapper-active.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .query-item-title {
          display: inline-block;
          padding: 3px 10px;
          font-size: 10px;
          margin-left: 20px;
          background: url(/src/assets/uiResources/button.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: relative;
          cursor: pointer;
          pointer-events: all;
        }
        .query-item-title:hover {
          background: url(/src/assets/uiResources/button-active.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
        }
        .query-item-title::after {
          content: "";
          width: 10px;
          height: 1px;
          background-color: rgba(224, 193, 193, 0.693);
          position: absolute;
          top: 50%;
          left: -10px;
        }
      }
    }
  }
  .right-wrapper {
    width: 11.417vw;
    height: 100%;
    position: absolute;
    right: 0px;
    top: 2.083vw;
    .legend {
      .title {
        color: #fff;
      }
      .query-item {
        pointer-events: none;
        cursor: default;
        margin: 4px;
        color: #fff;
        display: flex;
        align-items: center;
        i {
          pointer-events: none;
          cursor: default;
        }
        .commonIcon {
          padding: 1px 6px;
          padding-top: 4px;
          font-size: 14px;
          background: url(/src/assets/uiResources/icon-wrapper.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          cursor: default;
          pointer-events: none;
        }
        .query-item-title {
          display: inline-block;
          padding: 3px 10px;
          font-size: 10px;
          margin-left: 20px;
          background: url(/src/assets/uiResources/button.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          position: relative;
          cursor: default;
          pointer-events: none;
        }
        .query-item-title::after {
          width: 20px;
          left: -20px;
          content: "";
          width: 20px;
          height: 1px;
          background-color: rgba(224, 193, 193, 0.693);
          position: absolute;
          top: 50%;
          left: -20px;
        }
      }
    }
  }
}
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

.route-design-wrapper {
  position: absolute;
  right: 14%;
  top: 5%;
  .route-design {
    width: 320px;
    height: 170px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 1px solid #885f12;
    .header {
      span {
        margin-left: 5px;
      }
      .start-btn {
        width: 80px;
        color: #fff;
        margin-left: 140px;
        background-color: transparent;
        border: 1px solid #885f12;
        font-size: 12px;
        padding: 3px;
        pointer-events: all;
        cursor: pointer;
      }
      .start-btn:hover {
        background-color: #5c3f096d;
        border: 1px solid #881212;
      }
    }
    .content {
      width: 100%;
      height: 110px;
      pointer-events: all;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      color: #fff;
    }
  }
  .route-design > .header {
    width: 100%;
    height: 40px;
    color: #fff;
    padding-left: 10px;
    background: rgb(255, 255, 255);
    background-image: linear-gradient(
      180deg,
      rgba(255, 255, 255, 1) 9%,
      rgba(211, 156, 50, 1) 57%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: flex;
    align-items: center;
  }
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
.box.active {
  background: #fff;
}
</style>
