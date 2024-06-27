<template>
    <div id="subLine-controller">
        <div class="item-wrapper">
            <div class="item" v-for="item in subLineData" @click.stop="handleItemClick(item)">
                <div class="box" :style="{ borderColor: item.color, backgroundColor: item.color }"></div>
                <span :style="{ color: '#34c5cf' }">{{ item.name.slice(-3) }}</span>
            </div>
        </div>
    </div>



    <div class="active-panel">
        <div class="header">
            <strong>重点活动</strong>
            <span>{{ date }}</span>
        </div>
        <div class="content">
            <div class="active-wrapper" v-if="activityData.length">
                <div v-for="item in activityData" class="acitve-item"
                    @click="clickActiveItem(item)" :key="item">
                    <!-- :class="['acitve-item', item.isActive ? 'item-active' : '']" -->
                    <div>{{ item.activedTime }}</div>
                    <div>{{ item.activedPlace }}</div>
                    <div>{{ item.activity }}</div>
                </div>

            </div>
            <a-empty v-else :image="simpleImage" description="无数据" />
            
        </div>


    </div>
</template>

<script setup>
import axios from 'axios'
import { activity } from '@/store/staticData'
import { flyToLine, binkLineByName, addGradientCone, removeAllCones, flyToCone } from '@/cesiumTools/effectController'
import {
    computed,
    onMounted,
    ref,
    onBeforeUnmount,
    getCurrentInstance,
} from "vue";
import { useLineData } from "@/store";

// 获取数据
import dayjs from 'dayjs'
const lineData = useLineData()
const subLineData = lineData.allData
// console.log(lineData)
let viewer;
onMounted(() => {
    viewer = lineData.viewer

})
// 记得要清除副作用
onBeforeUnmount(()=>{
    removeAllCones(viewer)
})



// 重点活动列表
const activityData = ref([]);
// 当前线路上激活的站点
const currentStations = ref([])
// 点击线路，跳转到质心点并高亮该线段,展示重点活动，使用电子围墙的材质
const handleItemClick = (item) => {
    const { name, stationsList, color } = item

    flyToLine(viewer, name)
    // 根据线路名称闪烁线路
    binkLineByName(name)
    console.log(name)
    // console.log(currentStations.value)
    // console.log(stationsList)
    currentStations.value = stationsList
    activityData.value = activity
    // 光柱效果调用
    showActiveArea(color)

}
// 光柱效果方法封装
const showActiveArea = (color) => {
    removeAllCones(viewer)
    const ids = activityData.value.map(item => item.id)
    const activedStations = currentStations.value.map((item, index) => {
        item.id = index
        return item
    }).filter(item => ids.includes(item.id))
    activedStations.forEach(item => {
        const { position, id } = item
        // 添加渐变圆柱
        addGradientCone(viewer, {
            position,
            color,
            name: id
        })
    })
}
// 引入日期插件
const date = computed(() => {
    return dayjs().format("YYYY-MM-DD");
});

// 选中具体的活动，视角跳转到该活动的位置，并高亮该活动
const clickActiveItem=(item)=>{
    const {id}=item
    flyToCone(viewer,id)
}
</script>

<style lang="scss" scoped>
#subLine-controller {
    position: absolute;
    bottom: 0;
    left: 34%;
    transform: translateX(-50%);
    width: 146px;
    height: 140px;
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

.item>span {
    line-height: 9.005px;
}

.item>input {
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
    width: 500px;
    height: 140.006px;
    border: 1px solid #ab7818;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 39%;
    bottom: 0;
    color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.active-panel>.header {
    height: 30px;
    padding: 4px;
    background: rgb(255, 255, 255);
    background-image: linear-gradient(180deg,
            rgba(255, 255, 255, 1) 9%,
            rgba(211, 156, 50, 1) 57%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: -0.521vw;
    font-family: "等线Bold";
}

.active-panel>.header>strong {
    font-weight: normal;
    margin-right: 10px;
}

.active-panel>.header>span {
    font-size: 12px;
}

.content {
    flex: 1;
}

.active-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
}

.acitve-item {
    width: 150px;
    height: 70px;
    border: 1px solid #ab7818;
    background-color: rgba(214, 174, 41, 0.1);
    margin: 4px;
    text-align: center;
    pointer-events: all;
    cursor: pointer;
    transition: all 0.3s linear;
    color: #37b3bb;
    padding-top: 12px;
    font-size: 12px;
}

.acitve-item:hover {
    background-color: rgba(214, 174, 41, 0.3);
    color: #fff;
}

.item-active {
    background-color: rgba(214, 174, 41, 0.3);
    color: #fff;
}
</style>

