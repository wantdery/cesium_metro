/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-15 09:44:06
 * @LastEditors: your name
 * @LastEditTime: 2024-05-15 09:44:09
 */
import * as Cesium from "cesium";

//渐变墙体材质  color 颜色
function WallGradientsMaterialProperty(color) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = color;
}
Object.defineProperties(WallGradientsMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor("color"),
});
WallGradientsMaterialProperty.prototype.getType = function (time) {
  return "WallGradients";
};
WallGradientsMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  );
  result.image = Cesium.Material.WallGradientsImage;
  return result;
};
WallGradientsMaterialProperty.prototype.equals = function (other) {
  return (
    this === other ||
    (other instanceof WallGradientsMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  );
};

Cesium.Material.WallGradientsType = "WallGradients";
Cesium.Material.WallGradientsImage =
  "/src/assets/materialResources/wallgradients.png";
Cesium.Material.WallGradientsSource =/* glsl */
  "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));\n\
     float time=fract(czm_frameNumber/10.0);\n\
     float isAlpha=step(0.5,time);\n\
     float dis = distance(st, vec2(0.5));\n\
     if(isAlpha>=1.0){\n\
        material.alpha = colorImage.a * color.a* dis *2.5;\n\
    }else{\n\
        material.alpha = colorImage.a * color.a * dis *2.0;\n\
    }\n\
     material.diffuse =  2.5 * color.rgb  ;\n\
     return material;\n\
 }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallGradientsType, {
  fabric: {
    type: Cesium.Material.WallGradientsType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      image: Cesium.Material.WallGradientsImage,
      time: 0,
    },
    source: Cesium.Material.WallGradientsSource,
  },
  translucent: function (material) {
    return true;
  },
});

export default WallGradientsMaterialProperty;
