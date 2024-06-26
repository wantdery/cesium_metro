<template>
  <!-- 1-侧边栏,选择地铁线路 -->
  <div id="subLine-controller">
    <div class="item-wrapper">
      <div
        class="item"
        v-for="(item, index) in subLineData"
        :key="index"
        @click.stop="handleItemClick(item)">
        {{ item.name.slice(-3) }}
      </div>
    </div>
  </div>
  <!-- 2-主面板, 进度条,信息提示 -->
  <div class="active-panel">
    <!-- 2-1控制栏 -->
    <div class="header">header</div>
    <!-- 2-2进度条 -->
    <div class="content">content</div>
    <!-- 2-3信息提示 -->
    <div class="message">message</div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref, onBeforeUnmount, watch, getCurrentInstance } from "vue";
/* 获取全局实例 */
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
//获取数据
import { useLineData } from "@/store";
const lineDataStore = useLineData();
const subLineData = ref([]);
let viewer;
onMounted(async () => {
  subLineData.value = lineDataStore.allData;
  console.log(subLineData.value, "888888888888888888");
  /* const res = await axios.get("http://127.0.0.1:8090/api/v1/getLine");
  //console.log(res, "res11111111111111111111111");
  subLineData.value = res.data.data;
  console.log(subLineData.value, "subLineData.value"); */

  viewer = global.viewer;
});

const handleItemClick = (item) => {};
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
  width: 580px;
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
</style>
