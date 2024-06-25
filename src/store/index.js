/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-05-08 16:11:33
 * @LastEditors: your name
 * @LastEditTime: 2024-05-08 16:11:36
 */
import { defineStore } from "pinia";

export const useLineData = defineStore("lineData", {
  state: () => {
    return {
      lineData: [],
      // 全局共享viewer，注意标记为markRaw
      viewer: null,
      tileset: null,
      disable: false,
    };
  },
  getters: {
    // 获取线路显示隐藏信息
    lineDisplay() {
      return this.lineData.map((item) => ({
        name: item.checked,
        id: item.id,
        name: item.name,
      }));
    },
    // 获取全部信息
    allData() {
      return this.lineData;
    },
  },
  actions: {
    setData(data) {
      return new Promise((resolve, reject) => {
        this.lineData = data.length ? data : [];
        resolve(data);
      });
    },
    setViewer(viewer) {
      return new Promise((resolve, reject) => {
        this.viewer = viewer;
        resolve(viewer);
      });
    },
    setTileset(tileset) {
      return new Promise((resolve, reject) => {
        this.tileset = tileset;
        resolve(tileset);
      });
    },
    // 全局管理路线显隐
    displayLine(lineNames, isShow) {
      if (Array.isArray(lineNames) && this.lineData.length && !this.disable) {
        const stationNames = [];
        // 控制state数据
        this.lineData.forEach((item) => {
          const { stationsList, name } = item;
          if (lineNames.includes(name)) {
            item.checked = isShow;
            stationsList.forEach((station) => {
              stationNames.push(station.name);
            });
          }
        });
        // 控制地图元素
        displayByName(lineNames, stationNames, isShow);
      }
    },
    // 控制全部图层显示隐藏
    controlAll(isShow) {
      const lineNames = [];
      const stationNames = [];
      this.lineData.forEach((item) => {
        const { name, stationsList } = item;
        lineNames.push(name);
        stationsList.forEach((station) => {
          const { name } = station;
          stationNames.push(name);
        });
      });
      // 控制地图元素
      displayByName(lineNames, stationNames, isShow);
    },
    // 根据当前保存的checked状态重新渲染地图元素
    reRenderLine() {
      if (this.lineData.length && !this.disable) {
        const lineNames = [];
        const stationNames = [];
        const unCheckedLineNames = [];
        const unCheckedStationNames = [];
        // 控制state数据
        this.lineData.forEach((item) => {
          const { stationsList, checked, name } = item;
          if (checked) {
            lineNames.push(name);
            stationsList.forEach((station) => {
              stationNames.push(station.name);
            });
          } else {
            unCheckedLineNames.push(name);
            unCheckedStationNames.forEach((station) => {
              stationNames.push(station.name);
            });
          }
        });
        // 控制地图元素
        displayByName(lineNames, stationNames, true);
        // 控制地图元素
        displayByName(unCheckedLineNames, unCheckedStationNames, false);
      }
    },
    // 设置是否开启全局管理
    disableController(val) {
      this.disable = val;
    },
  },
});
// 由于lineData的state是异步的，所以需要监听action来获取数据
export const watchLineData = (actionName = "setData") => {
  return new Promise((resolve, reject) => {
    useLineData().$onAction(({ name, store, args, after, onError }) => {
      if (name === actionName) {
        after((res) => {
          console.log(res);
          if (res) {
            resolve(res);
          }
        });

        onError((e) => {
          reject(e);
        });
      }
    });
  });
};

export const useMeasureData = defineStore("measureData", {
  state: () => {
    return {
      measureData: [],
    };
  },
  getters: {
    // 获取全部信息
    allData() {
      return this.measureData;
    },
  },
  actions: {
    setData(data) {
      return new Promise((resolve, reject) => {
        this.measureData = data.length ? data : [];
        resolve(data);
      });
    },
    clearData() {
      return new Promise((resolve, reject) => {
        const data = this.measureData.map((item) => {
          item.length && item.forEach((n) => (n.measures.length = 0));
          return item;
        });
        this.measureData = data;
        resolve(data);
      });
    },
  },
});
