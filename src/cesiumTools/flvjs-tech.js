/*
 * @Description: 
 * @Author: your name
 * @version: 
 * @Date: 2024-05-10 14:02:56
 * @LastEditors: your name
 * @LastEditTime: 2024-05-10 14:03:51
 */
// https://github.com/mister-ben/videojs-flvjs/blob/master/src/plugin.js
// https://github.com/videojs/videojs-youtube/blob/main/src/Youtube.js

import videojs from 'video.js'

const Html5 = videojs.getTech('Html5')

export class FlvJsTech extends Html5 {
  flvPlayer= null

  constructor(options, ready) {
    super(options, ready)
  }

  setSrc(src) {
    this.flvPlayer?.detachMediaElement()
    this.flvPlayer?.destroy()
    this.flvPlayer = flvjs.createPlayer({ url: src, type: 'flv' }, this.options_)
    this.flvPlayer.attachMediaElement(this.el_)
    this.flvPlayer.load()
  }

  dispose() {
    this.flvPlayer?.detachMediaElement()
    this.flvPlayer?.destroy()
    super.dispose()
  }

  static formats = {
    'video/flv': 'FLV',
    'video/x-flv': 'FLV'
  }

  static isSupported = function () {
    return flvjs.isSupported()
  }

  static canPlayType = function (type) {
    return FlvJsTech.isSupported() && type in FlvJsTech.formats ? 'maybe' : ''
  }

  static canPlaySource = function (source) {
    return FlvJsTech.isSupported() && source.src.endsWith('.flv') ? 'maybe' : ''
  }
}