<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:50:09
 * @LastEditors: your name
 * @LastEditTime: 2024-05-09 16:21:30
-->
<template>
    <div id="header">
        <div class="leftTool">
            <i class='iconfont metro-dingwei' style="color:#eb9a02;"></i>
            <span style="marginRight:20px;marginLeft:10px;">武汉市</span>
            <span style="marginRight:15px;marginLeft:15px;letter-spacing:2px;">{{currentDate}}</span>
            <span style="marginRight:15px;marginLeft:15px;">{{currentWeek}}</span>
            <span style="marginRight:15px;marginLeft:15px;">{{currentSecond}}</span>
        </div>
        <div class="title">地铁三维可视化管控平台</div>
        <div class="rightTool">
           <i :class="['iconfont',weatherIcon,'icon']"></i>
           <span style="margin:0 10px">{{ weather }}</span>
           <span>{{temp}}℃</span>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import {ref,onMounted,computed,onUnmounted} from 'vue'
import {getWeather} from '@/api/line.js'

const weekMap={
    'Monday':'星期一',
    'Tuesday':'星期二',
    'Wednesday':'星期三',
    'Thursday':'星期四',
    'Friday':'星期五',
    'Saturday':'星期六',
    'Sunday':'星期日',
}

let currentDate=ref(dayjs().format('YYYY/MM/DD'))
let currentWeek=ref(weekMap[dayjs().format('dddd')])
let currentSecond=ref(dayjs().format('hh:mm:ss'))
let timer=ref(null)
const weather=ref('晴')
const temp=ref(0)
const weatherIcon=computed(()=>{
    return weatherMap[weather.value]
})

const weatherMap={
    '晴':'metro-qingtian',
    '雨':'metro-yutian',
    '雪':'metro-xuetian',
    '阴':'metro-duoyun',
}


onMounted(async ()=>{
    timer.value=setInterval(() => {
        currentDate.value=dayjs().format('YYYY/MM/DD')
        currentWeek.value=weekMap[dayjs().format('dddd')]
        currentSecond.value=dayjs().format('hh:mm:ss')
    }, 100);
    const weatherInfo=await getWeather()
    weather.value=weatherInfo.lives[0]?.weather || '晴'
    temp.value=weatherInfo.lives[0]?.temperature || 0
})

onUnmounted(()=>{
    timer.value && clearInterval(timer.value)
})
</script>
<style scoped lang="scss">
#header {
    width: 100%;
    height: 57px;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../assets/uiResources/header.png');
    background-size: cover;
    display: flex;
    justify-content: center;
}

.title {
    font-family: '等线Bold';
    font-size: 26px;
    font-weight: bold;
    font-stretch: normal;
    letter-spacing: 2px;
    background: rgb(255,255,255);
    background-image: linear-gradient(180deg, rgba(255,255,255,1) 9%, rgba(211,156,50,1) 57%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 3px;
}

.leftTool{
    width:26%;
    height:70%;
    position:absolute;
    left:0;
    top:0;
    display:flex;
    align-items:center;
    color:#fff;
    padding-left:20px;
    font-size: 15px;
}

.rightTool{
    width:26%;
    height:70%;
    position:absolute;
    right:0;
    top:0;
    display:flex;
    align-items:center;
    justify-content: flex-end;
    font-size: 12px;
    color: #fff;
    margin-right: 20px;
}

.icon{
    font-family: '等线Bold';
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    background: rgb(255,255,255);
    background-image: linear-gradient(180deg, rgba(255,255,255,1) 9%, rgba(211,156,50,1) 57%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-right: 10px;
}
</style>