<template>
  <div id="Home">
    <Header />
    <Content />
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/Header.vue";
import Content from "@/views/Content.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
#Home {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}
</style>
