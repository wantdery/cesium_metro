/*
 * @Description: 效果管理器，控制站点的显示隐藏，创建站点，创建线路等
 * @Author: your name
 * @version:
 * @Date: 2024-05-13 11:13:31
 * @LastEditors: your name
 * @LastEditTime: 2024-05-23 14:09:50
 */
import * as Cesium from "cesium";
import ConeGlowBottomCircleMaterialProperty from "./texutruedCircle";
import WallGradientsMaterialProperty from "./wallMaterial";
import { generateCirclePoints, pointsToPositions } from "./core";
import SimpleLabel from './Bubble/htmlMarker'
import getCesiumHeat from "./cesiumHeatMap";

// 光柱
export const coneWithLight = (viewer, options) => {
  const position = Cesium.defaultValue(
    options.position,
    Cesium.Cartesian3.ZERO
  );
  const height = Cesium.defaultValue(options.height, 700);
  const bottomRadius = Cesium.defaultValue(options.bottomRadius, 100);
  const color = Cesium.defaultValue(options.color, Cesium.Color.AQUA);
  const modelMatrix = Cesium.Matrix4.multiplyByTranslation(
    Cesium.Transforms.eastNorthUpToFixedFrame(position),
    new Cesium.Cartesian3(0.0, 0.0, height * 0.5),
    new Cesium.Matrix4()
  );

  const cylinderGeometry = new Cesium.CylinderGeometry({
    length: height,
    topRadius: 0.0,
    bottomRadius: bottomRadius * 0.7,
    vertexFormat:
      Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat,
  });

  const cone = new Cesium.GeometryInstance({
    geometry: cylinderGeometry,
    modelMatrix: modelMatrix,
  });

  const primitive=new Cesium.Primitive({
    geometryInstances: [cone],
    appearance: new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          type: "VtxfShader1",
          uniforms: {
            color: color,
          },
          source: /*glsl*/ `
                          uniform vec4 color;   
                          czm_material czm_getMaterial(czm_materialInput materialInput)
                          {
                              czm_material material = czm_getDefaultMaterial(materialInput);
                              vec2 st = materialInput.st;
                              float time=fract(czm_frameNumber/10.0);
                              float isAlpha=step(0.5,time);
                              float dis = distance(st, vec2(0.5)); 
                              material.diffuse =1.9 * color.rgb;
                              if(isAlpha>=1.0){
                                  material.alpha = color.a * dis *2.0;
                              }else{
                                  material.alpha = color.a * dis *1.5;
                              }

                              return material;
                          }
                      `,
        },
        translucent: false,
      }),
      faceForward: false, // 当绘制的三角面片法向不能朝向视点时，自动翻转法向，从而避免法向计算后发黑等问题
      closed: true, // 是否为封闭体，实际上执行的是是否进行背面裁剪
    }),
  })
  const res= viewer.scene.primitives.add(
    primitive
  );
  return res
};

// 站点底部圆环
export const bottomCircle = (viewer, options) => {
  const position = Cesium.defaultValue(
    options.position,
    Cesium.Cartesian3.ZERO
  );
  const color = Cesium.defaultValue(options.color, Cesium.Color.AQUA);
  const bottomRadius = Cesium.defaultValue(options.bottomRadius, 100);
  return viewer.entities.add({
    position: position,
    ellipse: {
      semiMinorAxis: bottomRadius * 2,
      semiMajorAxis: bottomRadius * 2,
      height: 0.0,
      material: new ConeGlowBottomCircleMaterialProperty(color),
    },
  });
};

// 渲染站点  传入颜色十六进制字符串，名称，位置{lng,lat,height}
const stations = [];
export const renderStation = (viewer, options) => {
  const name=Cesium.defaultValue(options.name,"站点");
  const position = Cesium.defaultValue(options.position, {
    lng: 0,
    lat: 0,
  });
  const positionCar3 = Cesium.Cartesian3.fromDegrees(
    position.lng,
    position.lat
  );
  const conePrimitve = coneWithLight(viewer, {
    position: positionCar3,
    height: 300,
    bottomRadius: 30,
    color: Cesium.Color.fromCssColorString(options.color),
  });
  conePrimitve.name=name
  const bottomCircleEntity = bottomCircle(viewer, {
    position: positionCar3,
    bottomRadius: 30,
    color: Cesium.Color.fromCssColorString(options.color),
  });
  bottomCircleEntity.name=name
  const isCache=Cesium.defaultValue(options.isCache,true);
  const target = {
    conePrimitve,
    bottomCircleEntity,
    name
  };
  isCache && stations.push(target);
  return target;
};

const billboards = [];
// 渲染站点标牌，后期还要添加点击查询功能
export const renderStationBill =async (viewer, options) => {
  const position = Cesium.defaultValue(options.position, {
    lng: 0,
    lat: 0,
  });
  const height = Cesium.defaultValue(options.height, 200);
  const name = Cesium.defaultValue(options.name, "站点");
  const show = Cesium.defaultValue(options.show, true);
  const color = Cesium.defaultValue(options.color, "#ff0000");
  const attr = Cesium.defaultValue(options.attr, {});
  const isCache=Cesium.defaultValue(options.isCache,true);
  const billControler = new SimpleLabel(
    viewer,
    {
      position:Cesium.Cartesian3.fromDegrees(position.lng, position.lat, height),
      label:name,
      isShow:show,
      color:color,
      scaleByDistance:new Cesium.NearFarScalar(1000, 1, 20000, 0.4),
      attr:attr,
      type:'marker'
    }
  );
  await billControler.addLabel();

  const target = {
    billControler,
    billboard:billControler.vmInstance.el,
    name
  };
  isCache && billboards.push(target);
  return target;
};

// 清除所有站点标牌
export const removeAllBillboards = () => {
  billboards.forEach((item) => {
    const { billControler } = item;
    billControler.removeMarker();
    billControler.queryPopup && billControler.removeQueryPopup();
  });
};

// 根据名称Array控制站点标牌显示与隐藏
export const changeDisplayBillBoard = (names, isShow) => {
  const filterBills = billboards.filter(
    (item) => names.indexOf(item.billControler.label) > -1
  );
  filterBills.forEach((item) => {
    const { billboard, billControler } = item;
    billControler.isDisplay = isShow;
    billboard.style.display = isShow ? "block" : "none";
  });
};

// 删除单个站点，直接删除，而不是隐藏
export const removeStationByName = (viewer, name) => {
  const target = stations.find((item) => item.name === name);
  if (target) {
    const { conePrimitve, bottomCircleEntity } = target;
    viewer.scene.primitives.remove(conePrimitve);
    viewer.entities.remove(bottomCircleEntity);
    stations.splice(stations.indexOf(target), 1);
  }
};

// 删除所有站点
export const removeAllStations = (viewer) => {
  stations.forEach((item) => {
    const { conePrimitve, bottomCircleEntity } = item;
    viewer.scene.primitives.remove(conePrimitve);
    viewer.entities.remove(bottomCircleEntity);
  });
  stations.length = 0;
};

// 通过名称Array控制站点显示隐藏
export const hideStationByName = (names, isShow) => {
  changeDisplayBillBoard(names, isShow);
  const targets = stations.filter((item) => names.indexOf(item.name) > -1);
  if (targets.length) {
    targets.forEach((target) => {
      const { conePrimitve, bottomCircleEntity } = target;
      conePrimitve.show = isShow;
      bottomCircleEntity.show = isShow;
    });
  }
};

// 创建地铁线路 positions:[{lng,lat,height}]
// color:十六进制颜色字符串
// name:线路名称
const lines = [];
export const renderLines = (viewer, options) => {
  const positions = Cesium.defaultValue(options.positions, [
    {
      lng: 0,
      lat: 0,
    },
  ]);
  const positionsR = [];
  positions.forEach((path) => {
    positionsR.push(path.lng, path.lat);
  });
  const color = Cesium.defaultValue(options.color, '#e9a526');
  const name = Cesium.defaultValue(options.name, "line");
  // 是否缓存
  const isCache=Cesium.defaultValue(options.isCache,true);
  
  const positionRes = Cesium.Cartesian3.fromDegreesArray(positionsR);
  const lineEnt = viewer.entities.add({
    name,
    polyline: {
      positions:positionRes,
      width: 20,
      //使用cesium默认的泛光线
      material: new Cesium.PolylineGlowMaterialProperty({
        color: new Cesium.Color.fromCssColorString(color),
        glowPower: 0.12,
      }),
    },
  });
  isCache && lines.push(lineEnt);

  return lineEnt;
};

// 删除地铁线路，不是隐藏
export const removeAllLines = (viewer) => {
  lines.forEach((line) => {
    line && viewer.entities.remove(line);
  });
};

// 根据线路名称闪烁线路
let timerBink;
let lastActiveRoute;
export const binkLineByName = (name) => {
  const targetEnt = lines.find((item) => item.name === name);
  if (!targetEnt) {
    return;
  }
  // 如果选中的是刚刚高亮的，判断是否存在定时器，存在的话，就返回
  if (timerBink && name === lastActiveRoute) {
    return;
  }

  // 如果选中的不是刚刚高亮的，直接清除定时器，然后高亮
  if (name !== lastActiveRoute && timerBink) {
    window.clearInterval(timerBink);
    timerBink = null;
    lastActiveEnt.polyline.material.glowPower = 0.12;
  }

  const originGlowPower = targetEnt.polyline.material.glowPower;

  const timeBreak = 600;
  let binkCount = 6;
  let count = 0;

  timerBink = setInterval(() => {
    if (count >= binkCount) {
      window.clearInterval(timerBink);
      timerBink = null;
    } else {
      let isBink = count % 2 === 0;
      targetEnt.polyline.material.glowPower = isBink
        ? originGlowPower * 4
        : originGlowPower;
      count++;
    }
  }, timeBreak);
};

// 根据名称视角跳转到对应线路
export const flyToLine = (viewer, name) => {
  const targetEnt = lines.find((item) => item.name === name);
  if (!targetEnt) {
    return;
  }
  viewer.flyTo(targetEnt);
};

// 通过名称控制线路显示隐藏
export const hideLineByName = (names, isShow) => {
  lines.forEach((line) => {
    if (names.indexOf(line.name) > -1) {
      line.show = isShow;
    }
  });
};

// 渲染全部
export const renderAll = (viewer, dataSource,isCache=true) => {
  // 渲染道路
  if (dataSource.length) {
    const cacheData={
      lineEnts:[],
      stationEnts:[],
      billboards:[]
    }
    dataSource.forEach((item) => {
      const { paths, name, color, stationsList } = item;
      // 渲染道路线
      const lineEnt=renderLines(viewer, {
        positions:paths,
        color,
        name,
        isCache
      });
      // 不要求缓存的话，就把数据返回
      !isCache && cacheData.lineEnts.push(lineEnt);
      // 渲染站点以及站点标牌
      stationsList.forEach(async (station) => {
        const { position, name } = station;
        const stationEnt=renderStation(viewer, {
          position,
          name,
          color,
          isCache
        });
        !isCache && cacheData.stationEnts.push(stationEnt);
        const billboard=await renderStationBill(viewer, {
          position,
          name,
          color,
          attr: station,
          isCache
        });
        !isCache && cacheData.billboards.push(billboard);
      });
    });
    return cacheData;
  }
};

// 清除全部
export const removeAll = (viewer) => {
  removeAllLines(viewer);
  removeAllStations(viewer);
  removeAllBillboards()
};

// 按照缓存数据清除
// cacheData类型 {
//   lineEnts:[],
//   stationEnts:[],
//   billboards:[{
//     billControler:SimpleLabel实例,
//     billboard:Billboard实例
//}]
// }
export const removeByCacheData = (viewer,cacheData) => {
  if(Object.keys(cacheData).length===0){
    return
  }
  const {lineEnts,stationEnts,billboards}=cacheData;
  lineEnts.forEach(line=>viewer.entities.remove(line))
  stationEnts.forEach(station=>{
    const { conePrimitve, bottomCircleEntity } = station;
    viewer.scene.primitives.remove(conePrimitve);
    viewer.entities.remove(bottomCircleEntity);
  })
  billboards.forEach((item) => {
    const { billControler } = item;
    billControler.removeMarker();
    billControler.removeQueryPopup();
  });
}

// 通过名称整体控制显示隐藏
export const displayByName = (lineNames, stationNames, isShow) => {
  hideLineByName(lineNames, isShow);
  hideStationByName(stationNames, isShow);
};

// 添加重保活动圆柱
// options: {
//   position: {lng,lat,height},
//   height: 1000,
//   baseHeight: 0, // 圆柱底部高度
//   radius: 100, // 圆柱半径
//   color: "#ff0000", // 圆柱颜色
//   name: "活动圆柱" // 圆柱名称
// }
const cones = [];
export const addGradientCone = (viewer, options) => {
  // 圆柱颜色
  const wallColor = Cesium.defaultValue(
    new Cesium.Color.fromCssColorString(options.color),
    Cesium.Color.AQUA
  );
  const name = Cesium.defaultValue(options.name, "");
  // 坐标中心，经纬度
  const center = Cesium.defaultValue(options.position, {
    lng: 0,
    lat: 0,
    height: 0,
  });
  const wallHeight = Cesium.defaultValue(options.height, 2600);
  const baseHeight = Cesium.defaultValue(options.baseHeight, 0);
  const radius = Cesium.defaultValue(options.radius, 200);
  const positions = generateCirclePoints([center.lng,center.lat], radius, baseHeight);
  // 将经纬度转为笛卡尔3
  const wallPositions = pointsToPositions(positions, baseHeight);
  let minimumHeights = []; //最小高度集合
  let maximumHeights = []; //最大高度集合
  wallPositions.forEach((position) => {
    minimumHeights.push(baseHeight);
    maximumHeights.push(baseHeight + wallHeight);
  });

  const cone = viewer.entities.add({
    name,
    center: new Cesium.Cartesian3.fromDegrees(
      center.lng,
      center.lat,
      baseHeight
    ),
    wall: {
      positions: wallPositions,
      minimumHeights: minimumHeights,
      maximumHeights: maximumHeights,
      material: new WallGradientsMaterialProperty(wallColor),
    },
  });
  cones.push(cone);
};

// 删除所有圆柱
export const removeAllCones = (viewer) => {
  cones.forEach((cone) => {
    cone && viewer.entities.remove(cone);
  });
  cones.length = 0;
};

// 视角飞到圆柱
export const flyToCone = (viewer,name) => {
  const targetCone = cones.find((item) => item.name === name);

  if (!targetCone) {
    return;
  }
  viewer.flyTo(targetCone,{
    offset:new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40),Cesium.Math.toRadians(-40),5000)
  });
};

// 视角飞到全局
export const flyToDefaultView = (viewer) => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(113.95, 30.19, 34000),
    duration: 2,
    orientation: {
      heading: Cesium.Math.toRadians(35.0),
      pitch: Cesium.Math.toRadians(-37.0),
      roll: 0.0,
    },
  });
};

// 通过名称找到对应的站点，站牌
export const findyBillboardByName = (name,cacheData) => {
  let billboardsData=billboards
  let stationsData=stations
  // 使用自己的缓存数据
  if(cacheData){
    const {billboards,stationEnts}=cacheData
    billboardsData=billboards
    stationsData=stationEnts
  }
  const targetBillboard = billboardsData.find((item) => item.billControler.label === name);
  const stationEnt = stationsData.find((item) => item.name === name);
  return {
    billboard: targetBillboard,
    station: stationEnt,
  }
}

let lastFocusStation
// 聚焦到站点并展示查询信息
export const focusOnStation=(viewer,name,cacheData)=>{
  const target=findyBillboardByName(name,cacheData);
  const {billboard:{billControler},station}=target
  if(lastFocusStation){
    const {billControler}=lastFocusStation
    billControler.removeQueryPopup()
  }

  if(station&&billControler){
    const {bottomCircleEntity}=station
    viewer.flyTo(bottomCircleEntity,{
      offset:new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40),Cesium.Math.toRadians(-40),5000)
    });
    // 调用billControler的showQueryPopup方法
    billControler.showQueryPopup()
    lastFocusStation=target.billboard
  }
}

// 通过站线名称跳转到站线质心点
export const flyToLineCenter = (viewer, lineName,linesData) => {
  let lineEnt
  let dataSource=linesData?linesData:lines
  lineEnt=dataSource.find(item=>item.name===lineName)
  console.log(lineEnt);
  viewer.flyTo(lineEnt,{
    offset:new Cesium.HeadingPitchRange(Cesium.Math.toRadians(40),Cesium.Math.toRadians(-40),20000)
  })
}


// 渲染热力图,传入站点坐标，站点信息，渲染热力图
// dataSource Array<{
//  lng,lat,value
//}>
export const renderHeat = (viewer, dataSource) => {
  const CesiumHeat = getCesiumHeat(Cesium);
  let heat = new CesiumHeat(
    viewer,
    {
      autoMaxMin: true,
      // data list, each has x, y, and value | 数据数组，每个包含 x,y,value字段
      data: dataSource,
    },
    // bbox for heatmap | 只在范围内显示热力图拉近会清晰些，默认整个地球但拉近后巨模糊
    [114.03, 30.2, 114.45, 30.9]
  );

  const destroyHeat = () => {
    heat.destory();
  };
  // 将清除方法暴露出去
  return destroyHeat;
};

// 注册鼠标事件，支持左键，右键点击
export const registerMouseEvent = (viewer, type, clickCallBack) => {
  viewer._element.style.cursor = "pointer";
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  switch (type) {
    // 左键点击
    case "leftClick":
      handler.setInputAction((e) => {
        // 将点击的信息回调回去
        clickCallBack && clickCallBack(e);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      break;
    // 右键点击
    case "rightClick":
      handler.setInputAction((e) => {
        // 将点击的信息回调回去
        clickCallBack && clickCallBack(e);
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      break;
    default:
      break;
  }

  return handler;
};