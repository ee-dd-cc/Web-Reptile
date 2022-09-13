/*
 * @Author: EdisonGu
 * @Date: 2022-09-08 14:42:43
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-08 17:15:37
 * @Descripttion: 
 */
const fs = require("fs");
const path = require("path");
const m3u8ToMp4 = require("./m3u8ToMp4.js"); // 引入核心模块，注意路径
const converter = new m3u8ToMp4();

// 具体参数可自行修改
downloadMedia({});
// let meu8Url = 'https://m3u8.cache.shtpin.com/Ddcache/20220908/1fd4ad92010fc8925ff5d0a251411e94.m3u8?st=glGe89kOi9DaPPJ7sQx4ZA&e=1662627118'

function downloadMedia (opt, callback) {
  // 测试视频，如果链接失效的话就自己找一个
  // let url = opt.url || 'https://b2.szjal.cn/ppvod/A78577CE222DCA7ABE1AB9A0ED742BB7.m3u8';
  let url = opt.url || 'https://vod1.bdzybf7.com/20220428/HKL2rFSz/index.m3u8';
  let output = opt.output || 'video';
  let filename = opt.filename ? `${opt.filename}.mp4` : 'video.mp4';
  let title = opt.title || '测试视频';
  
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, {
      recursive: true,
    });
  }

  (async function() {
    try {
      console.log("准备下载...");

      await converter
        .setInputFile(url)
        .setOutputFile(path.join(output, filename))
        .start();

      console.log("下载完成!");

      if ( typeof callback === 'function' ) callback();
    } catch (error) {
      console.log('---error', error)
      throw new Error("哎呀，出错啦! 检查一下参数传对了没喔。", error);
    }
  })(); 

}

