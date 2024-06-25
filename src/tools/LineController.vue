<template>
    <div id="subLine-controller">
        <div>
            <div class="item">
                <input type="checkbox" :checked="showAll" @change="controlAll"/>
                <span>全选</span>
            </div>
        </div>
        <div class="item-wrapper">
            <div class="item" v-for="item in subLineData" :key="item">
                <div class="box" @click.stop="chooseLine(item)" :style="{
                    borderColor: item.color,
                    backgroundColor: item.checked ? item.color : 'transparent',
                }"></div>
                <span :style="{ color: '#34c5cf' }">{{ item.name.slice(-3) }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import { useLineData } from '@/store'

const subLineData = ref([])
const showAll = ref(true)
const lineDataStore = useLineData()

// 全选，控制所有站点，站线
const controlAll = (e) => {
    const checked = e.target.checked
    const lineNames = subLineData.value.map(item => item.name)
    lineDataStore.displayLine(lineNames, checked)
}

// 单独控制站线
const chooseLine = (item) => {
    const names = [item.name]
    lineDataStore.displayLine(names, !item.checked)
}

onMounted(async () => {
    subLineData.value = lineDataStore.allData
})
</script>
<style scoped>
.mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-color: rgba(204, 204, 204, 0.165);
    z-index: 999;
}

#subLine-controller {
    position: relative;
    width: 3.885vw;
    background-color: rgba(0, 0, 0, 0.3);
    border: 1px solid #664a16;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    padding-bottom: 0;
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

:deep(.ant-popover-arrow){
    display: none !important;
}

:deep(.ant-popover-inner){
    background: none;
}

:deep(.ant-popover){
    background: none !important;
}

.item {
    width: 3.385vw;
    height: 1.042vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.156vw;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid #885f12;
    color: #fff;
    font-size: 0.521vw;
    pointer-events: all;
    cursor: pointer;
    margin-bottom: 10px;
}

.item:hover {
    border: 1px solid #d8961a;
}

.item>span {
    line-height: 0.469vw;
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
</style>
  