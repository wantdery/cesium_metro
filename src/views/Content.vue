<template>


  <div>
    <div style="position: absolute; z-index: 100" class="router-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { ref, watch } from "vue";
</script>

<style scoped>
.router-wrapper {
  width: 100%;
  /* 注意calc计算符号要保留空格 */
  height: calc(100% - 90px);
}
</style>
