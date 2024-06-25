
<template>
  <div class="activity">
    <vue3-seamless-scroll :list="list" class="scroll" :hover="true" :step="0.4">
      <div class="item" v-for="(item, index) in list" :key="index">
        <span class="message">{{ item.message }}</span>
        <span class="time">{{ item.time }}</span>
      </div>
    </vue3-seamless-scroll>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";

export default defineComponent({
  name: "App",
  components: {
    Vue3SeamlessScroll,
  },
  setup() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        message: "7月31日,全线20座车站封顶",
        time: "2022-05-01",
      });
    }

    const list = ref(data);
    return { list };
  },
});
</script>

<style>
.activity{
    color: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: all;
}

.activity .scroll{
    height: 200px;
    margin: 10px;
    overflow: hidden;
}

.item{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 30px;
    padding-right: 60px;
}

.item>span:first-child{
    color:#5dcad0;
}

.item>span:last-child{
    color: #667eb8;
    font-weight: bold;
}
</style>
