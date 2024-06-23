/*
 * @Author: wangshiyang
 * @Date: 2023-04-23 11:01:40
 * @LastEditors: your name
 * @LastEditTime: 2024-05-13 11:21:50
 * @Description: 底部圆材质
 */
import * as Cesium from 'cesium'
//底部圆材质图片
function createBottomCircleTexture() {
    let canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    let ctx = canvas.getContext('2d');

    let gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
    gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
    gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

    ctx.clearRect(0, 0, 512, 512);
    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
    //ctx.fillStyle = "rgb(0, 155, 255)";
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
    return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

function ConeGlowBottomCircleMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
}
Object.defineProperties(ConeGlowBottomCircleMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
ConeGlowBottomCircleMaterialProperty.prototype.getType = function (time) {
    return 'ConeGlowBottomCircle';
};
ConeGlowBottomCircleMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.ConeGlowBottomCircleImage;
    return result;
};
ConeGlowBottomCircleMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof ConeGlowBottomCircleMaterialProperty &&
            Cesium.Property.equals(this._color, other._color));
};

Cesium.Material.ConeGlowBottomCircleType = 'ConeGlowBottomCircle';
Cesium.Material.ConeGlowBottomCircleImage = createBottomCircleTexture();
Cesium.Material.ConeGlowBottomCircleSource =
    /*glsl*/`czm_material czm_getMaterial(czm_materialInput materialInput)
    {
         czm_material material = czm_getDefaultMaterial(materialInput);
         vec2 st = materialInput.st;
         vec4 colorImage = texture2D(image,  vec2(st ));
         material.alpha = colorImage.a * color.a;
         material.diffuse =  1.5* color.rgb  ;
         return material;
     }`;

Cesium.Material._materialCache.addMaterial(Cesium.Material.ConeGlowBottomCircleType, {
    fabric: {
        type: Cesium.Material.ConeGlowBottomCircleType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.ConeGlowBottomCircleImage,
            time: 0
        },
        source: Cesium.Material.ConeGlowBottomCircleSource
    },
    translucent: function (material) {
        return true;
    }
});

export default ConeGlowBottomCircleMaterialProperty