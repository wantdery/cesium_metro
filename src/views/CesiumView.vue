<!--
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-08 16:34:13
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:40:27
-->
<template>
  <div id="cesium-viewer">
    <slot />
  </div>
</template>

<script setup>
import * as Cesium from "cesium";
import { onMounted, getCurrentInstance,ref,markRaw } from "vue";
import app from "../main";
import {
  initViewer,
  setScene,
  loadTilesets,
  handleDefaultModelEffect,
  flyToDefaultView,
} from "@/cesiumTools/sceneManager";
import { getLine } from "@/api/line";
import { useLineData } from "@/store";
const { appContext } = getCurrentInstance();
const global = appContext.config.globalProperties;
const lineDataStore=useLineData()
//初始化cesium实例
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwZWI2YTk3ZC1mZWI4LTQyMDUtYmI1Ny00YzFkYTFmYmIwYzIiLCJpZCI6MjE3MTU4LCJpYXQiOjE3MTY0Mjc1MDZ9.dC3r6S37sujU0HyCKe-k_flKuGM9kyy_oqkd9eQutZs";
onMounted(async () => {
    const viewer = initViewer("cesium-viewer");
    setScene(viewer);
    flyToDefaultView(viewer)
    const modelUrls = [{
      url:"http://localhost:8888/wuhan/tileset.json",
      options:{}
    }]
    // 加载线路数据
    lineDataStore.setViewer(markRaw(viewer))
    const lineData = await getLine()
    
    lineDataStore.setData(lineData)
    global.$viewer = viewer;
    // 加载多个3dtiles
    await loadTilesets(viewer,modelUrls,(tilesets)=>{
      handleDefaultModelEffect(tilesets[0])
      app.provide("$viewer_tile", { viewer, tilesets });
      lineDataStore.setTileset(markRaw(tilesets[0]))
    })
});
</script>
<style>
#cesium-viewer {
  width: 100%;
  height: 100%;
  pointer-events: all;
}
</style>
