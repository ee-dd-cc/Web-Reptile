/*
 * @Descripttion: 爬取发表情网站
 * @Author: yuankun.gu
 * @Date: 2022-03-20 21:35:52
 * @LastEditors: yuankun.gu
 * @LastEditTime: 2022-03-21 12:59:12
 */
const cheerio = require('cheerio')
const { RqApi } = require('../api/index.js')
const { writeFile, readFile, writeLog, distinctList } = require('../utils/index.js')
const popularJson = require('./json/emoticon/web_url_popular.json')
const popularAllUrlJson = require('./json/emoticon/web_url_popular_all_yes.json')
// const hotJson = require('./json/hotJson.json')
// const loversJson = require('./json/lovers.json')
// const qunliaoJson = require('./json/qunliao.json')
// const doutuJson = require('./json/doutu.json')
// const duirenJson = require('./json/duiren.json')
// const emojiJson = require('./json/emoji.json')

const webHost = 'https://fabiaoqing.com'
console.log('----popularAllUrlJson', popularAllUrlJson.length)
// let dealList = distinctList({
//   list: popularAllUrlJson,
//   key: 'aHref'
// })
// console.log('----dealList', dealList.length)

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
  for( let index = startIndex; index < jsonList.length; index ++ ) {
    if(index < endIndex) {
      await setEmoticonUrl({
        fileName,
        url: jsonList[index],
        index,
        nodePath: '#container .left .bqba'
      })
    }
  }
}

/**
 * 获取表情包url的所有表情
 */
const getEmoticonList = async ({jsonList = [], fileName, startIndex = 0, endIndex = 0}) => {
  console.log('----爬取数量----', jsonList.length)
  endIndex = endIndex ? endIndex : jsonList.length
  for (let index = startIndex; index < jsonList.length; index++) {
    if(index < endIndex) {
      await setEmoticonList({
        fileName,
        url: jsonList[index].aHref,
        index,
        nodePath: '#container .ui.imghover'
      })
    }
  }

}


/**
 * 请求爬取地址，读取本地文件并更新
 */
const setEmoticonUrl = async ({fileName, url, nodePath, index}) => {
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

const setEmoticonList = async({fileName, url, nodePath, index}) => {
  console.log('---爬取地址----', url, index)
  try {
    const html = await RqApi.get(url)
    const $ = cheerio.load(html)
    const picDom = $(nodePath)[0]
    const tagDom = $(picDom).find('.ui.ignored.message a')
    const headTitleDom = $(picDom).find('.ui.header')
    const picContentDom = $(picDom).find('.pic-content .swiper-wrapper a')
    const imgList = []
    const tagList = []
    let emoticonObj = {}
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
    emoticonObj = {
      title: $(headTitleDom).text(),
      count: picContentDom.length,
      aHref: url,
      tagList,
      imgList
    }
    const data = await readFile({
      path: './json/emoticon',
      fileName,
    })
    const readFileList = JSON.parse(data)
    readFileList.push(emoticonObj)
    writeFile({
      path: './json/emoticon',
      fileName,
      content: JSON.stringify(readFileList)
    })
    
  } catch (error) {
    console.log('----错误啦----url', url, error)
  }
}


// 获取所有表情包的url
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

// 获取表情包url下的详细表情url
const getAllEmoticonWebUrl = () => {
  // 获取热门
  getEmoticonWebUrl({
    jsonList: popularJson,
    fileName: 'web_url_popular_all',
    startIndex: 488,
    endIndex: 489
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
}

// 获取表情包url下的所有表情
const getAllEmoticonList = () => {
  getEmoticonList({
    jsonList: popularAllUrlJson,
    fileName: 'emoticon_all_list',
    startIndex: 0,
    endIndex: 1
  })
}
// getAllEmoticonWebUrl()
// getAllWebList()
getAllEmoticonList()


