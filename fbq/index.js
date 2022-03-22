/*
 * @Descripttion: 爬取发表情网站
 * @Author: yuankun.gu
 * @Date: 2022-03-20 21:35:52
 * @LastEditors: yuankun.gu
 * @LastEditTime: 2022-03-21 12:59:12
 */
const cheerio = require('cheerio')
const fs = require('fs')
const { RqApi } = require('../api/index.js')
const { writeFile } = require('../utils/index.js')
const hotJson = require('./json/hotJson.json')
const loversJson = require('./json/lovers.json')
const qunliaoJson = require('./json/qunliao.json')
const doutuJson = require('./json/doutu.json')
const duirenJson = require('./json/duiren.json')
const emojiJson = require('./json/emoji.json')

const webHost = 'https://fabiaoqing.com'

const getUrlList = (count, url, fileName) => {
  const list = []
  for (let index = 0; index < count; index++) {
    const tempUrl = `${url}${index + 1}.html`
    list.push(tempUrl)
  }
  writeFile({
    path: './json',
    fileType: 'json',
    fileName,
    json: list
  })
}
// getUrlList(33, 'https://fabiaoqing.com/bqb/lists/type/liaomei/page/', 'lovers')
// getUrlList(21, 'https://fabiaoqing.com/bqb/lists/type/qunliao/page/', 'qunliao')
// getUrlList(117, 'https://fabiaoqing.com/bqb/lists/type/doutu/page/', 'doutu')
// getUrlList(18, 'https://fabiaoqing.com/bqb/lists/type/duiren/page/', 'duiren')
// getUrlList(12, 'https://fabiaoqing.com/bqb/lists/type/emoji/page/', 'emoji')

/**
 * 获取表情包url，title，count
 */
const getListJson = ({jsonList = [], readFileName = '', startIndex = 0, endIndex = 0}) => {
  endIndex = endIndex ? endIndex : jsonList.length
  jsonList.forEach((item, index) => {
    if(index > (startIndex - 1) && index < endIndex) {
      setTimeout(async () => {
        try {
          setListUrl({
            readFilePath: `./json/${readFileName}.json`,
            fileName: readFileName,
            url: item,
            nodePath: '#container .left .bqba'
          })
        } catch (error) {
          console.log('error----getQunliaoJson', index)
        }
      }, (index - startIndex)  * 5000)
    }
  })
}
/**
 * 请求爬取地址，读取本地文件并更新
 */
const setListUrl = async ({ readFilePath, fileName, url, nodePath }) => {
  console.log('-----爬取地址', url)
  try {
    const html = await RqApi.get(url)
    const $ = cheerio.load(html)
    const tempList = [] 
    $(nodePath).each((index, el) => {
      const aTitle = $(el).attr('title')
      const aHref = $(el).attr('href')
      const headerDom = $(el).find('.header')
      const countDom = $(el).find('header span')
      const headerTitle = headerDom.html()
      const headerCount = countDom.text()
      tempList.push({
        aTitle,
        aHref: `${webHost}${aHref}`,
        headerTitle,
        headerCount: headerCount.replace(/\s*/g, '')
      })
    })
    fs.readFile(readFilePath, (err, data) => {
      const readFileList = JSON.parse(data)
      readFileList.push(...tempList)
      writeFile({
        path: './json',
        fileType: 'json',
        fileName,
        content: JSON.stringify(readFileList)
      })
    })
  } catch (error) {
    console.log('-----err----', url, error)
  }
}

// 获取热门
// getListJson({
//   jsonList: hotJson,
//   readFileName: 'hotAll',
// })
// 获取情侣
getListJson({
  jsonList: loversJson,
  readFileName: 'loversAll',
})
// 获取群聊
// getListJson({
//   jsonList: qunliaoJson,
//   readFileName: 'qunliaoAll',
// })
// 获取斗图
// getListJson({
//   jsonList: doutuJson,
//   readFileName: 'doutuAll',
// })
// 获取怼人
// getListJson({
//   jsonList: duirenJson,
//   readFileName: 'duirenAll',
// })
// 获取emoji
// getListJson({
//   jsonList: emojiJson,
//   readFileName: 'emojiAll',
// })
