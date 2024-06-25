
<!-- 线路概览 -->
<template>
  <img src="/src/assets/uiResources/sub.png" alt="" style="width: 448px; height: 200px" id="imgTools"/>
</template>

<script setup>
import Viewer from "viewerjs";
import { nextTick, onMounted } from "vue";

onMounted(() => {
  nextTick(() => {
    const viewer = new Viewer(document.getElementById("imgTools"), {
      inline: true,
      navbar:false,
      toolbar:false,
      viewed() {
        viewer.zoomTo(0.1);
      },
    });
  });
});
</script>
<style>
#image {
  width: 200px;
}
</style>
