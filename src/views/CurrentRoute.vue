<template>
  <div class="center-wrapper">
    <!-- 地铁线路 -->
    <div class="subline_station">
      <div class="subline_header">
        <i class="iconfont icon-dibudaohanglan-"></i>地铁线路
      </div>
      <div class="item-wrapper">
        <div class="subline_list">
          <i class="iconfont icon-square12"> </i>1号线
        </div>
      </div>
    </div>
    <!-- 站点展示 -->
    <div class="station_list">
      <div class="subline_header">
        <i class="iconfont icon-ditiexiao"></i>地铁站点
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLineData } from "@/store";
const lineData = useLineData();
const subLineData = ref([]);
onMounted(() => {
  console.log(lineData, "lineData");
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
.subline_list {
  display: flex;
  /*   justify-content: space-around; */
  align-content: space-around;
  flex-wrap: wrap;
  flex: 1;
  padding: 4px;
  overflow: hidden;
  color: #ab7818;
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
