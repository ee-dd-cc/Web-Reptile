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
const { writeFile, readFile, writeLog } = require('../utils/index.js')
const popularJson = require('./json/emoticon/web_url_popular.json')
// const hotJson = require('./json/hotJson.json')
// const loversJson = require('./json/lovers.json')
// const qunliaoJson = require('./json/qunliao.json')
// const doutuJson = require('./json/doutu.json')
// const duirenJson = require('./json/duiren.json')
// const emojiJson = require('./json/emoji.json')

const webHost = 'https://fabiaoqing.com'

/**
 * 生成爬取网站url
 * @param {*} count 
 */
const getWebUrlList = ({count, url, fileName}) => {
  const list = []
  for (let index = 0; index < count; index++) {
    const tempUrl = `${url}${index + 1}.html`
    list.push(tempUrl)
  }
  writeFile({
    path: './json/emoticon',
    fileName,
    content: JSON.stringify(list)
  })
}

/**
 * 获取表情包url，title，count
 */
const getEmoticonWebUrl = async ({jsonList = [], fileName = '', startIndex = 0, endIndex = 0}) => {
  endIndex = endIndex ? endIndex : jsonList.length
  for( let i = startIndex + 1; i < jsonList.length; i ++ ) {
    if(i < endIndex) {
      await setListUrl({
        fileName,
        url: jsonList[i],
        index: i,
        nodePath: '#container .left .bqba'
      })
    }
  }
}
/**
 * 请求爬取地址，读取本地文件并更新
 */
const setListUrl = async ({ fileName, url, nodePath, index }) => {
  console.log('---爬取地址----', url, index)
  const tempList = [] 
  try {
    const html = await RqApi.get(url)
    const $ = cheerio.load(html)
    $(nodePath).each((index, el) => {
      const aTitle = $(el).attr('title')
      const aHref = $(el).attr('href')
      const headerDom = $(el).find('.header')
      const headerTitle = headerDom.html()
      tempList.push({
        aTitle,
        aHref: `${webHost}${aHref}`,
        headerTitle
      })
    })
    const data = await readFile({
      path: './json/emoticon',
      fileName,
    })
    const readFileList = JSON.parse(data)
    readFileList.push(...tempList)
    writeFile({
      path: './json/emoticon',
      fileName,
      content: JSON.stringify(readFileList)
    })
  } catch (error) {
    console.log('-----err----', url, error)
    writeLog({
      path: './logs',
      fileName: 'emoticon',
      log: { event: 'getEmoticonWebUrl', url, index, error }
    })
  } finally {
    return tempList
  }
}

const getAllWebList = () => {
  // 获取表情包-当下流行
  getWebUrlList({
    count: 973,
    url: 'https://fabiaoqing.com/bqb/lists/type/hot/page/',
    fileName: 'web_url_popular'
  })
  // 获取表情包-情侣表情包
  getWebUrlList({
    count: 33,
    url: 'https://fabiaoqing.com/bqb/lists/type/liaomei/page/',
    fileName: 'web_url_lovers'
  })
  // 获取表情包-群聊
  getWebUrlList({
    count: 21,
    url: 'https://fabiaoqing.com/bqb/lists/type/qunliao/page/',
    fileName: 'web_url_qunliao'
  })
  // 获取表情包-斗图
  getWebUrlList({
    count: 118,
    url: 'https://fabiaoqing.com/bqb/lists/type/doutu/page/',
    fileName: 'web_url_doutu'
  })
  // 获取表情包-怼人
  getWebUrlList({
    count: 18,
    url: 'https://fabiaoqing.com/bqb/lists/type/duiren/page/',
    fileName: 'web_url_duiren'
  })
  // 获取表情包-emoji
  getWebUrlList({
    count: 12,
    url: 'https://fabiaoqing.com/bqb/lists/type/emoji/page/',
    fileName: 'web_url_emoji'
  })
}
// getAllWebList()
// 获取热门
getEmoticonWebUrl({
  jsonList: popularJson,
  fileName: 'web_url_popular_all',
  // startIndex: 177,
  // endIndex: 4
})
// 获取情侣
// getEmoticonWebUrl({
//   jsonList: loversJson,
//   readFileName: 'loversAll',
// })
// 获取群聊
// getEmoticonWebUrl({
//   jsonList: qunliaoJson,
//   readFileName: 'qunliaoAll',
// })
// 获取斗图
// getEmoticonWebUrl({
//   jsonList: doutuJson,
//   readFileName: 'doutuAll',
// })
// 获取怼人
// getEmoticonWebUrl({
//   jsonList: duirenJson,
//   readFileName: 'duirenAll',
// })
// 获取emoji
// getEmoticonWebUrl({
//   jsonList: emojiJson,
//   readFileName: 'emojiAll',
// })

