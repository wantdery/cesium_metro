<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-10 16:40:00
 * @LastEditors: your name
 * @LastEditTime: 2024-05-17 09:55:58
-->
<template>
  <div id="tool-wrapper" :style="{ right: isManage ? '1%' : '28%' }">
    <div class="tool-item" v-for="item in tools" :title="item.title" :key="item" @click="handleTool(item)">
      <a-popover v-if="item.title === '图层控制'" placement="leftBottom" trigger="click">
        <template #content>
          <LineController />
        </template>
        <i :class="['iconfont', item.icon, disabled ? 'disabled-icon' : '']"></i>
      </a-popover>
      <i :class="['iconfont', item.icon]" v-else></i>
    </div>
  </div>
</template>

<script setup>
import toolList from "./toolList";
import { ref, onMounted, watch } from "vue";
import { watchLineData,useLineData } from '@/store'
import LineController from "./LineController.vue";
import { renderAll } from '@/cesiumTools/effectController'
import PositionInfoStatusBar from "@/cesiumTools/positionStatusBar";
import { fullScreen, cancelFullscreen } from "./toolFunctions";
const tools = ref(toolList);
const lineDataStore=useLineData()
const disabled = ref(false);
const isManage = ref(false)
const isFullScreen = ref(false);
const MousePositionShowed = ref(false);
let positionStatus;
onMounted(async () => {
  const viewer = await watchLineData('setViewer')
  const lineData = await watchLineData('setData')
  renderAll(viewer, lineData)
  positionStatus = new PositionInfoStatusBar(viewer);
})

const handleTool = (data) => {
  const { title } = data;
  switch (title) {
    case "全屏控件":
      controlFullScreen();
      break;
    case "鼠标位置":
      controlMouse();
      break;
    default:
      break;
  }
}
const targetEle = document.getElementById("app");
const controlFullScreen = () => {
  isFullScreen.value && cancelFullscreen();
  !isFullScreen.value && fullScreen(targetEle);
  isFullScreen.value = !isFullScreen.value;

};

lineDataStore.$onAction(({ name, store, args, after, onError })=>{
  if (name === 'disableController'){
    after((res) => {
        disabled.value = lineDataStore.isDisable;
    });
  }
})

const controlMouse = () => {
  // console.log(positionStatus);
  // positionStatus.show()
  MousePositionShowed.value ? positionStatus.show() : positionStatus.hide();
  MousePositionShowed.value = !MousePositionShowed.value;
};
</script>
<style scoped>
#tool-wrapper {
  position: absolute;
  right: 28%;
  bottom: 10%;
  display: flex;
  flex-direction: column;
  z-index: 199;
}

.tool-item {
  margin: 4px;
  pointer-events: all;
  cursor: pointer;
}

.tool-item:hover {
  background-color: #d8951a7f;
}

#tool-wrapper i {
  color: #ffd31a;
  border: 1px solid #d8951a;
  padding: 3px;
}

#tool-wrapper span {
  color: #fff;
}

.disabled-icon {
  pointer-events: none;
  cursor: none;
  background-color: rgba(204, 204, 204, 0.306);
}

.disabled-icon:hover {
  cursor: none;
}
</style>
