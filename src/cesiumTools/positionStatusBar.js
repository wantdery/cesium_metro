/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-10 16:32:38
 * @LastEditors: your name
 * @LastEditTime: 2024-05-10 16:32:41
 */
import * as Cesium from 'cesium'

export default class PositionInfoStatusBar {
    constructor(viewer) {
        this.viewer = viewer;
        this.createDom();
        this.initEvent();
    }

    createDom() {
        this.container = document.createElement("div");
        this.container.className = "position-info-status-bar";

        //获取cesium容器
        let cesiumContaienr = document.getElementById("cesium-viewer")
        cesiumContaienr.appendChild(this.container);


        //经度
        this.divLng = document.createElement("div");
        this.container.appendChild(this.divLng);
        //纬度
        this.divLat = document.createElement("div");
        this.container.appendChild(this.divLat);
        //海拔
        this.divH = document.createElement("div");
        this.container.appendChild(this.divH);

        //方向
        this.divHeading = document.createElement("div");
        //this.container.appendChild(this.divHeading);

        //俯仰角
        this.divPitch = document.createElement("div");
        //this.container.appendChild(this.divPitch);

        //视点高度
        this.divcH = document.createElement("div");
        //this.container.appendChild(this.divcH);
    }

    initEvent() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.eventHandler.setInputAction(((e) => {
            let pickPosition = this.viewer.scene.pickPosition(e.startPosition);
            if (!pickPosition) {
                pickPosition = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!pickPosition) return;
            this.handleMouseMoveEvent(pickPosition);
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.viewer.scene.camera.moveEnd.addEventListener(this.handleCameraMoveEvent, this);
    }

    handleMouseMoveEvent(position) {
        let degrees = this.catesian3ToDegrees(position);
        this.divLng.innerHTML = "经度：" + degrees.x.toFixed(6);
        this.divLat.innerHTML = "纬度：" + degrees.y.toFixed(6);
        this.divH.innerHTML = "高度：" + degrees.z.toFixed(6);
    }

    handleCameraMoveEvent() {
        this.divHeading.innerHTML = "方向：" + Cesium.Math.toDegrees(this.viewer.scene.camera.heading).toFixed(0) + "度";
        this.divPitch.innerHTML = "俯仰角：" + Cesium.Math.toDegrees(this.viewer.scene.camera.pitch).toFixed(0) + "度";

        let degrees = this.catesian3ToDegrees(this.viewer.scene.camera.position);
        this.divcH.innerHTML = "视高：" + degrees.z.toFixed(6) + "米";
    }

    catesian3ToDegrees(position) {
        const c = Cesium.Cartographic.fromCartesian(position);
        const lon = Cesium.Math.toDegrees(c.longitude);
        const lat = Cesium.Math.toDegrees(c.latitude);
        const height = c.height;
        return {
            x: lon,
            y: lat,
            z: height
        }
    }


    //显示
    show() {
        this.container.style.display = "block";
    }

    //隐藏
    hide() {
        this.container.style.display = "none";
    }
}