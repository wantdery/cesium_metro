/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-05-08 13:53:24
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:32:34
 */
import { createApp } from "vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import VScaleScreen from "v-scale-screen";
import vue3SeamlessScroll from "vue3-seamless-scroll";
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import "./style.scss";

const app = createApp(App);

app.use(Antd).use(VueVideoPlayer)
.use(createPinia()).use(router).use(VScaleScreen)
.use(vue3SeamlessScroll).use(VueViewer).mount('#app');


export default app;
