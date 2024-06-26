<template>
  <div id="station_manage">
    <div class="left-wrapper">
      <div class="query-controller">
        <div style="color: rgb(255, 255, 255); margin-bottom: 4px">
          查询模式选择
        </div>
        <div class="query-item" v-for="item in stationMangeArr" :key="item.id">
          <i :class="[iconfont, icon - dibudaohanglan]"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { stationMangeItems, station_solutions } from "@/store/staticData.js";
import { ref } from "vue";

console.log(station_solutions);
console.log(stationMangeItems);

const stationMangeArr = ref([]);
const stationSolutionsArr = ref([]);
stationIconList = [
  icon-dibudaohanglan,
  icon-taiyang-copy-copy,
  icon-lujingguihua,
  icon-ditie,
];
station_solutionsIconList = [
  icon-zhongbaobaozhang,
  icon-control,
  icon-jinzhi,
  icon-wutouxiang,
  icon-fence-full,
  icon-zhaji,
  icon-shoupiaochu,
  icon-dianti,
  icon-code-branch,
];

stationMangeArr.value = stationMangeItems.map((item,index) => {
  return {
    title:item.title,
    icon:stationIconList[index],
    id:item.id,
    active:false,
  }
});

stationSolutionsArr.value = station_solutions.map((item,index)=>{
  return {
    title:item.title,
    iconName:station_solutionsIconList[index],
  }
})
</script>

<style lang="scss" scoped>
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
      .query-item {
        margin: 4px;
        color: #fff;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
