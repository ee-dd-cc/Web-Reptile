/*
 * @Descripttion: 爬取发表情网站,将表情存到本地
 * @Author: yuankun.gu
 * @Date: 2022-03-20 21:35:52
 * @LastEditors: yuankun.gu
 * @LastEditTime: 2022-03-21 12:59:12
 */
const cheerio = require('cheerio')
const fs = require('fs')
const { RqApi } = require('../api/index.js')
const { writeFile } = require('../utils/index.js')
const hotAllJson = require('./json/hotAll.json')
const loversAllJson = require('./json/loversAll.json')
const qunliaoAllJson = require('./json/qunliaoAll.json')
const doutuAllJson = require('./json/doutuAll.json')
const duirenAllJson = require('./json/duirenAll.json')
const emojiAllJson = require('./json/emojiAll.json')

const webHost = 'https://fabiaoqing.com'
// const url = 'https://www.fabiaoqing.com/bqb/detail/id/54744.html'

const getListJson = ({jsonList = [], readFileName = '', startIndex = 0, endIndex = 0}) => {
  console.log('----爬取数量----', jsonList.length)
  endIndex = endIndex ? endIndex : jsonList.length
  jsonList.forEach((item, index) => {
    if(item.aHref === 'https://fabiaoqing.com/bqb/detail/id/50881.html') {
      console.log('-----index', index)
    }
    if(index > (startIndex - 1) && index < endIndex) {
      setTimeout(async () => {
        try {
        console.log(`-----爬取网站-----${index}`, item.aHref)
          setListUrl({
            pageInfo: item,
            readFilePath: `./json/img/${readFileName}.json`,
            fileName: readFileName,
            nodePath: '#container .ui.imghover'
          })
        } catch (error) {
          console.log('error----getListJson', index, error)
        }
      }, (index - startIndex)  * 5000)
    }
  })
}
/**
 * 请求爬取地址，读取本地文件并更新
 */
const setListUrl = async({pageInfo, readFilePath, fileName, nodePath}) => {
  const url = pageInfo.aHref
  try {
    const html = await RqApi.get(url)
    const $ = cheerio.load(html)
    const picDom = $(nodePath)[0]
    const tagDom = $(picDom).find('.ui.ignored.message a')
    const footerDom = $(picDom).find('.beforeafter a')
    const headTitleDom = $(picDom).find('.ui.header')
    const picContentDom = $(picDom).find('.pic-content .swiper-wrapper a')
    const imgList = []
    const tagList = []
    const neighbor = { prev: {}, next: {} }
    let tempObj = {}
    // writeFile({
    //   path: './json/img',
    //   fileName: 'demo',
    //   fileType: 'html',
    //   content: $.html()
    // })
    // 获取tag信息
    $(tagDom).each((index, el) => {
      const aTitle = $(el).attr('title')
      const aHref = $(el).attr('href')
      tagList.push({
        aTitle,
        aHref: `${webHost}${aHref}`,
        tagDes: $(el).text().replace('、', '')
      })
    })
    // 获取相邻信息
    $(footerDom).each((index, el) => {
      const aHref = $(el).attr('href')
      if (index === 0) {
        neighbor.prev = {
          aHref: `${webHost}${aHref}`,
          aDes: $(el).find('div').text()
        }
      }
      if (index === 1) {
        neighbor.next = {
          aHref: `${webHost}${aHref}`,
          aDes: $(el).find('div').text()
        }
      }
    })
    // 获取图片相关信息
    $(picContentDom).each((index, el) => {
      const imgTitle = $(el).attr('title')
      const imgHref = $(el).attr('href')
      const imgDom = $(el).find('.bqppdiv1 img')
      const imgDes = $(el).find('.bqppdiv1 p').text()
      const imgSrc = $(imgDom).attr('src')
      const dataOriginal = $(imgDom).attr('data-original')
      const imgAlt = $(imgDom).attr('alt')
      imgList.push({
        imgIndex: index,
        imgTitle,
        imgHref: `${webHost}${imgHref}`,
        imgSrc:`${webHost}${imgSrc}`,
        imgDataOriginal: dataOriginal,
        imgAlt, 
        imgDes
      })
    })
    tempObj = {
      title: $(headTitleDom).text(),
      conut: picContentDom.length,
      aHref: url,
      neighbor,
      tagList,
      imgList
    }
    fs.readFile(readFilePath, (err, data) => {
      const readFileList = JSON.parse(data)
      readFileList.push(tempObj)
      writeFile({
        path: './json/img',
        fileName,
        content: JSON.stringify(readFileList)
      })
    })
    
  } catch (error) {
    console.log('----错误啦----url', url, error)
  }
}

// 获取热门
getListJson({
  jsonList: hotAllJson,
  readFileName: 'hotImg-2',
  startIndex: 8684
})

// 获取情侣
// getListJson({
//   jsonList: loversAllJson,
//   readFileName: 'loversImg',
//   startIndex: 250
// })

// 获取群聊
// getListJson({
//   jsonList: qunliaoAllJson,
//   readFileName: 'qunliaoImg'
// })
// 获取斗图
// getListJson({
//   jsonList: doutuAllJson,
//   readFileName: 'doutuImg',
// })
// 获取怼人
// getListJson({
//   jsonList: duirenAllJson,
//   readFileName: 'duirenImg',
//   startIndex: 162,
//   endIndex: 163
// })
// 获取emoji
// getListJson({
//   jsonList: emojiAllJson,
//   readFileName: 'emojiImg',
// })