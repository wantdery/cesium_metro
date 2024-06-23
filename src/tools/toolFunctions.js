/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-10 16:39:55
 * @LastEditors: your name
 * @LastEditTime: 2024-05-10 16:39:58
 */
export const fullScreen = (element) => {
  if (document.mozFullScreenEnabled) {
    return Promise.reject(new Error("全屏模式被禁用"));
  }
  let result = null;
  if (element.requestFullscreen) {
    result = element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    result = element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    result = element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    result = element.webkitRequestFullScreen();
  }
  return result || Promise.reject(new Error("不支持全屏"));
};

export const cancelFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
