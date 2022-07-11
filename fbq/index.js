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
const popularEmoticonAllJson = require('./json/emoticon/emoticon_all_list_yes.json')
// const hotJson = require('./json/hotJson.json')
// const loversJson = require('./json/lovers.json')
// const qunliaoJson = require('./json/qunliao.json')
// const doutuJson = require('./json/doutu.json')
// const duirenJson = require('./json/duiren.json')
// const emojiJson = require('./json/emoji.json')

const webHost = 'https://fabiaoqing.com'
// console.log('----popularAllUrlJson', popularAllUrlJson.length)
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
 * 获取表情包url的所有表情, 从0下标开始，0-10只爬取0-9的下标
 */
const getEmoticonList = async ({jsonList = [], fileName, startIndex = 0, endIndex = 0}) => {
  console.log('----爬取数量----', jsonList.length)
  console.log('----已有数据----', popularEmoticonAllJson.length)
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
    writeLog({
      path: './logs',
      fileName: 'emoticon',
      log: { event: 'getEmoticonList', url, index, error }
    })
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
    // startIndex: 8222,
    // endIndex: 8223
  })
}
// getAllEmoticonWebUrl()
// getAllWebList()
// getAllEmoticonList()
let aaa = [
  {
    aHref: 'https://www.emojivip.com/kedaya',
    tagList: [
      {
        aHref: "https://fabiaoqing.com/tag/detail/id/1810.html",
        aTitle: '可达鸭表情包',
        tagDes: '可达鸭'
      }
    ],
    imgList: [
      {
        "imgIndex": 0,
        "imgTitle": "可达鸭-来点色图-可达鸭猥琐",
        "imgAlt": "可达鸭-来点色图-可达鸭猥琐",
        "imgDes": "可达鸭-来点色图 - 可达鸭表情包_可达鸭表情_可达鸭猥琐",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://tva3.sinaimg.cn/bmiddle/006rGTbggy1h2ky4c9h6hg30b307ehdu.gif",
      },
      {
        "imgIndex": 1,
        "imgTitle": "可达鸭-点赞",
        "imgAlt": "可达鸭-点赞",
        "imgDes": "可达鸭-点赞 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx4.sinaimg.cn/bmiddle/006rGTbggy1h2ky4886png306o06ozz5.gif",
      },
      {
        "imgIndex": 2,
        "imgTitle": "可达鸭-你没对象",
        "imgAlt": "可达鸭-你没对象",
        "imgDes": "可达鸭-你没对象 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx3.sinaimg.cn/bmiddle/006rGTbggy1h2ky48h73lg308e08ekfg.gif",
      },{
        "imgIndex": 3,
        "imgTitle": "可达鸭-快点上号",
        "imgAlt": "可达鸭-快点上号",
        "imgDes": "可达鸭-快点上号 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx3.sinaimg.cn/bmiddle/006rGTbggy1h2ky48pfrig309u09uh8j.gif",
      },{
        "imgIndex": 4,
        "imgTitle": "可达鸭-明天不想上班",
        "imgAlt": "可达鸭-明天不想上班",
        "imgDes": "可达鸭-明天不想上班 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx4.sinaimg.cn/bmiddle/006rGTbggy1h2ky48xkkfg30b50b5e2n.gif",
      },{
        "imgIndex": 5,
        "imgTitle": "可达鸭-你是憨批",
        "imgAlt": "可达鸭-你是憨批",
        "imgDes": "可达鸭-你是憨批 - 可达鸭表情包_可达鸭表情_可达鸭骂人表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx1.sinaimg.cn/bmiddle/006rGTbggy1h2ky4954w7g3092092hdt.gif",
      },{
        "imgIndex": 6,
        "imgTitle": "可达鸭-我是你爹",
        "imgAlt": "可达鸭-我是你爹",
        "imgDes": "可达鸭-我是你爹 - 可达鸭表情包_可达鸭表情_可达鸭骂人表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx3.sinaimg.cn/bmiddle/006rGTbggy1h2ky49egalg30ai0aix1y.gif",
      },{
        "imgIndex": 7,
        "imgTitle": "可达鸭-群主大傻P",
        "imgAlt": "可达鸭-群主大傻P",
        "imgDes": "可达鸭-群主大傻P - 可达鸭表情包_可达鸭表情_可达鸭骂人表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx2.sinaimg.cn/bmiddle/006rGTbggy1h2ky49pudhg305c05c18m.gif",
      },{
        "imgIndex": 8,
        "imgTitle": "可达鸭-拒绝加班",
        "imgAlt": "可达鸭-拒绝加班",
        "imgDes": "可达鸭-拒绝加班 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx4.sinaimg.cn/bmiddle/006rGTbggy1h2ky4a1cr4g309c09ctwa.gif",
      },{
        "imgIndex": 9,
        "imgTitle": "可达鸭-健康码-行程码-新冠",
        "imgAlt": "可达鸭-健康码-行程码-新冠",
        "imgDes": "可达鸭-健康码-行程码-新冠 - 可达鸭表情包_可达鸭表情_新冠",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx4.sinaimg.cn/bmiddle/006rGTbggy1h2ky4ac9wgg308c08cb29.gif",
      },{
        "imgIndex": 10,
        "imgTitle": "可达鸭-放我出去-新冠",
        "imgAlt": "可达鸭-放我出去-新冠",
        "imgDes": "可达鸭-放我出去-新冠 - 可达鸭表情包_可达鸭表情_新冠",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx1.sinaimg.cn/bmiddle/006rGTbggy1h2ky4b0up1g309q09q7wi.gif",
      },{
        "imgIndex": 11,
        "imgTitle": "可达鸭-摸摸屁股-可达鸭猥琐",
        "imgAlt": "可达鸭-摸摸屁股-可达鸭猥琐",
        "imgDes": "可达鸭-摸摸屁股 - 可达鸭表情包_可达鸭表情_可达鸭猥琐",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx1.sinaimg.cn/bmiddle/006rGTbggy1h2ky4bqizbg308w071hdt.gif",
      },
      {
        "imgIndex": 12,
        "imgTitle": "可达鸭-不要色色-可达鸭猥琐",
        "imgAlt": "可达鸭-不要色色-可达鸭猥琐",
        "imgDes": "可达鸭-不要色色 - 可达鸭表情包_可达鸭表情_可达鸭猥琐",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx4.sinaimg.cn/bmiddle/006rGTbggy1h2ky4be1vbg309q09qnpd.gif",
      },
      {
        "imgIndex": 13,
        "imgTitle": "可达鸭-变美变瘦-发财暴富",
        "imgAlt": "可达鸭-变美变瘦-发财暴富",
        "imgDes": "可达鸭-变美变瘦-发财暴富 - 可达鸭表情包_可达鸭表情",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx2.sinaimg.cn/bmiddle/006rGTbggy1h2ky4d4z49g308c08c7wh.gif",
      },
      {
        "imgIndex": 14,
        "imgTitle": "可达鸭-不可以色色-可达鸭猥琐",
        "imgAlt": "可达鸭-不可以色色-可达鸭猥琐",
        "imgDes": "可达鸭-不可以色色-可达鸭猥琐 - 可达鸭表情包_可达鸭表情_可达鸭猥琐",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx1.sinaimg.cn/bmiddle/006rGTbggy1h2ky4duqj6g30b40b4e84.gif",
      },
      {
        "imgIndex": 15,
        "imgTitle": "可达鸭-起来做核酸了-新冠",
        "imgAlt": "可达鸭-起来做核酸-新冠",
        "imgDes": "可达鸭-起来做核酸-新冠 - 可达鸭表情包_可达鸭表情_新冠",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx2.sinaimg.cn/bmiddle/006rGTbggy1h2ky4eco8zg308g08gh1l.gif",
      },
      {
        "imgIndex": 16,
        "imgTitle": "可达鸭-消灭新冠-新冠",
        "imgAlt": "可达鸭-消灭新冠-新冠",
        "imgDes": "可达鸭-消灭新冠-新冠 - 可达鸭表情包_可达鸭表情_新冠",
        "imgSrc": "https://fabiaoqing.com/Public/lazyload/img/transparent.gif",
        "imgDataOriginal": "https://wx3.sinaimg.cn/bmiddle/006rGTbggy1h2ky4erpi4g308g08g1kx.gif",
      },
    ]
  },
  ...popularEmoticonAllJson,
]
writeFile({
  path: './json/emoticon',
  fileName: 'emoticon_all_list_yes',
  content: JSON.stringify(aaa)
})
console.log('----aaa', aaa.length)

