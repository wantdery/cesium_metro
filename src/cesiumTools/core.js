/*
 * @Description:
 * @Author: your name
 * @version:
 * @Date: 2024-05-15 09:49:36
 * @LastEditors: your name
 * @LastEditTime: 2024-05-17 14:08:32
 */
import * as Cesium from "cesium";


//获取一个圆的边缘坐标
export const generateCirclePoints = (center, radius) => {
  let points = [];
  for (let i = 0; i <= 360; i += 2) {
    points.push(getCirclePoint(center[0], center[1], i, radius));
  }
  return points;
};

const getCirclePoint = (lon, lat, angle, radius) => {
  let dx = radius * Math.sin((angle * Math.PI) / 180.0);
  let dy = radius * Math.cos((angle * Math.PI) / 180.0);
  let ec = 6356725 + ((6378137 - 6356725) * (90.0 - lat)) / 90.0;
  let ed = ec * Math.cos((lat * Math.PI) / 180);
  let newLon = ((dx / ed + (lon * Math.PI) / 180.0) * 180.0) / Math.PI;
  let newLat = ((dy / ec + (lat * Math.PI) / 180.0) * 180.0) / Math.PI;
  return [newLon, newLat];
};

//二维点转三维点 [lng,lat]--->Array<{x,y,z}>
export const pointsToPositions = (points, height) => {
  let positions = [];
  points.map((item) => {
    positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], height));
  });
  return positions;
};

// 将[{lng,lat}]--->[lng,lat,lng,lat]
export const flattenPositions = (paths) => {
  const result = [];
  paths.forEach((path) => {
    result.push(path.lng, path.lat);
  });
  return result;
};

// [{lng,lat}]--->Array<{x,y,z}
export const getPositions = (paths, defaultHeight = 0) => {
  return paths.map(path=>{
    const {lng,lat}=path
    return Cesium.Cartesian3.fromDegrees(lng, lat, defaultHeight)
  })
};

//计算每个点位时间与总时间
// pArr:[{x,y,z}]
// speed number
export const getSiteTimes = (pArr, speed) => {
  let timeSum = 0,
      times = [];
  for (var i = 0; i < pArr.length; i++) {
      if (i == 0) {
          times.push(0); //第0个时间为0
          continue;
      }
      
      // 计算总时间
      timeSum += spaceDistance([pArr[i - 1], pArr[i]]) / speed;
      // 将每段距离所用的时间收集起来
      times.push(timeSum);
  }
  return {
      timeSum: timeSum,
      siteTimes: times,
  };
};

//计算距离
export const spaceDistance = (positions) => {
  let distance = 0;
  for (let i = 0; i < positions.length - 1; i++) {
      let s = Cesium.Cartesian3.distance(positions[i], positions[i + 1])
      distance = distance + s;
  }
  return distance.toFixed(2);
};
