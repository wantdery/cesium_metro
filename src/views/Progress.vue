<template>
  <!-- 1-侧边栏,选择地铁线路 -->
  <div id="subLine-controller">
    <div class="item-wrapper">
      <div
        class="item"
        v-for="(item, index) in subLineData"
        :key="index"
        @click.stop="handleItemClick(item)">
        <div class="box" :style="{ borderColor: item.color, backgroundColor: item.color }"></div>
        <span :style="{ color: '#34c5cf' }">{{ item.name.slice(-3) }}</span>
      </div>
    </div>
  </div>
  <!-- 2-主面板, 进度条,信息提示 -->
  <div class="active-panel">
    <!-- 2-1控制栏 -->
    <div class="header">
      <strong>发展历程</strong>
      <div class="controler">
        <i class="iconfont metro-pause" @click="pause"></i>
        <i class="iconfont metro-play" @click="play"></i>
        <i class="iconfont metro-icon-replay-copy" @click="replay"></i>
      </div>
    </div>
    <!-- 2-2进度条content -->
    <div class="content">
      <a-slider
        style="width: 600px"
        v-if="resPaths.length !== 0"
        v-model:value="currentTime"
        :marks="marks"
        :step="0.5"
        :min="0"
        :max="max"
        :disabled="true">
      </a-slider>
    </div>
    <!-- 2-3信息提示 -->
    <div class="message" v-if="message.length">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, onBeforeUnmount, watch, getCurrentInstance } from "vue";
import { polygon, centroid } from "turf";
import { line_history } from "@/store/staticData"; //车站历史数据
import { renderAll, removeByCacheData } from "@/cesiumTools/effectController"; //渲染站点战线
import { flattenPositions } from "@/cesiumTools/core";
/* 获取全局实例 */
/* const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties; */
let viewer;
//获取数据
import { useLineData } from "@/store";
const lineDataStore = useLineData();
console.log(lineDataStore, "7");
const subLineData = ref([]);
onMounted(async () => {
  subLineData.value = lineDataStore.allData;
  //console.log(subLineData.value, "888888888888888888");
  //viewer = global.$viewer;
  viewer = lineDataStore.viewer;
  console.log(viewer, "9");
  // 将站点站线全部隐藏
  const lineNames = lineDataStore.allData.map((item) => item.name);
  lineDataStore.displayLine(lineNames, false);
  // 暂时禁用全局管理，unMount的时候打开--???
  lineDataStore.disableController(true);
});

onBeforeUnmount(() => {
  //1-- 清除已经有的数据以及实体
  removeByCacheData(viewer, dataEnts);
  //2-- 全局管理恢复，路线展示恢复--???
  lineDataStore.disableController(false);
  //3-- 将站点站线全部展示
  const lineNames = lineDataStore.allData.map((item) => item.name);
  lineDataStore.displayLine(lineNames, true);
});

/* 视角跳转 */
let flyPoint;
const flyToCentroid = (positions) => {
  if (positions.length) {
    if (flyPoint) {
      viewer.entities.remove(flyPoint);
      flyPoint = null;
    }
    const dataSource = [];
    positions.forEach((item) => {
      const { lng, lat } = item;
      dataSource.push([lng, lat]);
    });
    dataSource.push([positions[0].lng, positions[0].lat]);
    // 注意：polygon首尾坐标要一致
    const polygonData = polygon([dataSource]);

    const centroidData = centroid(polygonData);
    console.log(centroidData);
    const {
      geometry: { coordinates },
    } = centroidData;
    flyPoint = viewer.entities.add({
      name: "mount",
      position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 10000),
      point: {
        pixelSize: 0.01,
      },
    });
    viewer.flyTo(flyPoint, {
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(70),
        Cesium.Math.toRadians(-60),
        40000
      ),
    });
  }
};

let dataEnts = {};
const currentTime = ref(0);
const marks = ref({});
const max = ref(100);
const message = ref("");
// 地铁线的路径数组
let curPaths = [];
let resPaths = [];
let isAnimate = false;
const handleItemClick = (item) => {
  const { id, paths, name } = item;
  //console.log(id, paths, name, "17489468");
  //0--清除已有的实体 和 数据
  removeByCacheData(viewer, dataEnts);
  dataEnts = {};
  //1--视角跳转
  //flyToLine(viewer, name);
  flyToCentroid(paths);
  //2--加载历史数据
  const target = line_history.find((n) => n.id === item.id);
  if (target) {
    pause();
    currentTime.value = 0;
    //3--渲染站点战线
    dataEnts = renderAll(viewer, [item], false);
    //4--渲染时间slider
    const { history } = target;
    max.value = (history.length - 1) * 10;
    let res = {};
    history.forEach((item, index) => {
      res[index * 10] = {
        style: {
          color: "#fff",
          fontSize: 10,
        },
        label: item.timePoint,
        message: item.message,
      };
    });
    // 给播放控件赋值，并给路径数据赋值
    marks.value = res;
    const positions = flattenPositions(paths);
    resPaths = positions;
    //console.log(resPaths, "894596849641");
    curPaths = positions.slice(0, 2);
    // 找到路线的实体，并给其坐标重新赋值
    const entity = dataEnts.lineEnts[0];
    // 给播放控件赋值，并给路径数据赋值
    entity.polyline.positions = new Cesium.CallbackProperty(
      () => Cesium.Cartesian3.fromDegreesArray(curPaths),
      false
    );
    // 自动开始播放
    play();
  }
};

/* 功能--暂停 */
const pause = () => {
  isAnimate = false;
};
/* 功能--播放 */
const play = () => {
  const animate = () => {
    if (isAnimate) {
      currentTime.value += 0.1;
      const rate = currentTime.value / max.value;
      let index = Math.ceil(rate * resPaths.length);
      // 我们的坐标两个为一组，不为双数的话，就加一
      if (index % 2 !== 0) {
        index = index + 1;
      }
      // 如果是最后一个坐标，就返回
      if (index >= resPaths.length - 1) {
        curPaths = resPaths;
        isAnimate = false;
        return;
      }

      curPaths = resPaths.slice(0, index);
      requestAnimationFrame(animate);
    }
  };
  isAnimate = true;
  animate();
};

/* 功能--重播 */
const replay = () => {
  pause();
  currentTime.value = 0;
  curPaths = resPaths.slice(0, 2);
  play();
};

// 监听当前进度
// 1.找到当前进度在marks当中的下标
// 2.通过下标,找message
watch(currentTime, (val) => {
  let targetIndex = null;
  const markKeys = Object.keys(marks.value).map((n) => Number(n));
  const markValues = Object.values(marks.value);
  markKeys.forEach((m, index) => {
    // 判断val是否在值区间
    if (index > 0 && val <= m && val > markKeys[index - 1]) {
      targetIndex = index;
    }

    if (val <= m && index === 0) {
      targetIndex = index;
    }
  });
  if (targetIndex) {
    const result = markValues[targetIndex];
    message.value = result.message;
  } else {
    message.value = "";
  }
});
</script>

<style lang="scss" scoped>
#subLine-controller {
  position: absolute;
  bottom: 0;
  left: 32%;
  transform: translateX(-50%);
  width: 146px;
  height: 170px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid #664a16;
  padding: 4px;
  display: flex;
  flex-direction: column;
}

.box {
  width: 10px;
  height: 10px;
  border-width: 1px;
  border-style: solid;
  background: transparent;
  user-select: all;
  cursor: pointer;
}

.item {
  width: 65px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3px;
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid #885f12;
  color: #fff;
  font-size: 10px;
  pointer-events: all;
  cursor: pointer;
}

.item:hover {
  border: 1px solid #d8961a;
}

.item > span {
  line-height: 9.005px;
}

.item > input {
  outline: none;
  border: none;
  transition: all 0.3s ease;
}

.item-wrapper {
  display: flex;
  justify-content: space-between;
  align-content: space-around;
  flex-wrap: wrap;
  flex: 1;
}

.active-panel {
  width: 600px;
  height: 170px;
  border: 1px solid #ab7818;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 37%;
  bottom: 0;
  color: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.active-panel > .header {
  height: 5vw;
  padding: 0.308vw;

  margin-bottom: -0.521vw;
  font-family: "等线Bold";
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.active-panel > .header > strong {
  /* font-size: 20px;
  font-weight: bold;
  color: rgb(172, 77, 18); */
  background: rgb(255, 255, 255);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 1) 9%, rgba(211, 156, 50, 1) 57%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.controler {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.controler > i {
  cursor: pointer;
  pointer-events: all;
  font-size: 20px;
}

.controler > i:hover {
  background: rgb(255, 255, 255);
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 1) 9%, rgba(211, 156, 50, 1) 57%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.content {
  flex: 1;
  padding: 0 30px;
  margin-top: 30px;
}

.message {
  position: absolute;
  bottom: 26px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-align: center;
}
</style>
