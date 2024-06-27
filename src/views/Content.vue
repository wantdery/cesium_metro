<template>
  <div>
    <div id="content" v-if="baseMode">
    <Panel style="grid-area: part1" title="运营统计">
      <template #content>
        <OperateStatic />
      </template>
    </Panel>
    <Panel style="grid-area: part3" title="线路概览">
      <template #content>
        <LineScan />
      </template>
    </Panel>
    <Panel style="grid-area: part5" title="告警趋势">
      <template #content>
        <HistoryWarnging />
      </template>
    </Panel>
    <Panel style="grid-area: part4" title="地铁活动">
      <template #content>
        <SubwayActivity />
      </template>
    </Panel>
    <Panel style="grid-area: part6" title="客流指标">
      <template #content>
        <GuestsRate />
      </template>
    </Panel>
    <Panel style="grid-area: part7" title="实时影像">
      <template #content>
        <HlsLive />
      </template>
    </Panel>
  </div>

    <div style="position: absolute; z-index: 100" class="router-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Panel from "@/components/Panel.vue";
import OperateStatic from "@/components/charts/OperateStatic.vue";//运营统计
import SubwayActivity from "@/components/charts/SubwayActivity.vue";//地铁活动
import GuestsRate from "@/components/charts/GuestsRate.vue";//客流指标
import HistoryWarnging from "@/components/charts/HistoryWarning.vue";//告警趋势
import LineScan from "@/components/charts/LineScan.vue";//线路概览
import HlsLive from "../components/charts/HlsLive.vue";//实时影像
import router from "@/router";
import { ref, watch } from "vue";
const baseMode = ref(true);

watch(router.currentRoute,val=>{
  console.log(val);
  if(val.path==='/station_manage'){
    baseMode.value = false;
  }else{
    baseMode.value = true;
  }
},{
  deep:true
})


</script>

<style scoped>
#content {
  width: 100%;
  /* 注意calc计算符号要保留空格 */
  height: calc(100% - 8.698vw);
  padding: 0 0.833vw;
  position: absolute;
  left: 0;
  top: 4.219vw;
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 0.8fr 1.4fr 0.8fr;
  grid-row-gap: 16px;
  grid-template-areas:
    "part1 part2 part3"
    "part4 part2 part5"
    "part6 part2 part7";
  pointer-events: none;
}
.router-wrapper {
  width: 100%;
  /* 注意calc计算符号要保留空格 */
  height: calc(100% - 90px);
}
</style>
