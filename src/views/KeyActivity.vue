<template>
    <div id="subLine-controller">
        <div class="item-wrapper">
<div class="item" >
<div class="box">
    <span ></span>
</div>

</div>

        </div>




    </div>
    <div class="active-panel">


    </div>
</template>

<script setup>
import { computed,onMounted,ref,onBeforeUnmount } from 'vue'
import { useLineData } from '@/store'
// 获取数据
const lineData = useLineData()
const subLineData = lineData.allData
let viewer
onMounted(()=>{

    viewer=lineData.Viewer
    console.log(viewer,'xxxxx')
})

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