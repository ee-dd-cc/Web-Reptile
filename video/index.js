/*
 * @Author: EdisonGu
 * @Date: 2022-08-07 16:29:55
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-16 18:37:07
 * @Descripttion: 爬取视频
 */
const cheerio = require('cheerio')
const { RqApi } = require('../api/index.js')
const { writeFile, readFile, writeLog, distinctList } = require('../utils/index.js')
const { MOVIE_TYPE, TRANS_NAME } =  require('../constants/movieType')
const movieMenu = require('./json/menu/movieMenu.json')
const tab_tv_all = require('./json/tab/tab_tv_all.json')
const movie_tv_all = require('./json/tab/tab_movie_all.json')
const tab_variety_all = require('./json/tab/tab_variety_all.json')
const tab_cartoon_all = require('./json/tab/tab_cartoon_all.json')
const tab_god_all = require('./json/tab/tab_god_all.json')

// const tabMovie = movieMenu[1] // 电影菜单
const menuMovie = movieMenu[1] // 电影菜单
const menuTv = movieMenu[2] // 电视剧菜单
const menuVariety = movieMenu[3] // 综艺菜单
const menuCartoon = movieMenu[4] // 动漫菜单
const menuGod = movieMenu[5] // 神片菜单
const domain = 'http://104.149.175.67'

/**
 * 获取网页菜单+子菜单
 */

const getMenu = async ({url}) => {
  const menuList = []
  try {
    const html = await RqApi.get(url)
    const $ = cheerio.load(html)
    const menuDom = $('#sddm > li')
    for (let index = 0; index < menuDom.length; index++) {
      const el = menuDom[index];
      const hrefList = [] // 存粗tab首页的url列表
      const menuTitle =  $(el).find('li > a').text()
      const menuHref = $(el).find('li a').attr('href')
      const tabList = $(el).find('li > div > a') // 菜单对应的a标签集合
      const menuPageObj = await pageDetail({url: `${domain}${menuHref}`})
      // if (MOVIE_TYPE(menuTitle) !== 'HOME') {
      //   for (let i = 0; i < menuPageObj.pageNo; index++) {
      //     let urlStr = `${domain}${menuHref}`.replace('.html', `-${index + 1}.html`)
      //     hrefList.push({
      //       index: i,
      //       href: urlStr
      //     })
      //   }
      // }
      const menuObj = {
        menu_name: menuTitle,
        menu_type: MOVIE_TYPE(menuTitle),
        href: `${domain}${menuHref}`,
        page_no: menuPageObj.pageNo,
        total: menuPageObj.total,
        menu_list: [],
        href_list: hrefList
      }
      for (let i = 0; i < tabList.length; i++) {
        const e = tabList[i];
        const tabTitle = $(e).text()
        const tabHerf = $(e).attr('href')
        const pageObj = await pageDetail({url: `${domain}${tabHerf}`})
        const tabPage = []
        for (let index = 0; index < pageObj.pageNo; index++) {
          let urlStr = `${domain}${tabHerf}`.replace('.html', `-${index + 1}.html`)
          tabPage.push({
            index,
            href: urlStr
          })
        }
        const tabObj = {
          tab_name: tabTitle,
          tab_type: MOVIE_TYPE(tabTitle),
          href: `${domain}${tabHerf}`,
          page_no: pageObj.pageNo,
          total: pageObj.total,
          tab_page: tabPage
        }
        menuObj.menu_list.push(tabObj)
      }
      menuList.push(menuObj)
    }
    // console.log('----menuList', menuList)
    writeFile({
      path: './json/menu',
      fileName: 'movieMenu',
      content: JSON.stringify(menuList)
    })
  } catch (error) {
    console.log('----error', error)
  }
}

const pageDetail = async ({url}) => {
  const html = await RqApi.get(url)
  const $ = cheerio.load(html)
  const pageText = $('.page_tip').text()
  const pageObj = {
    pageNo: 0,
    total: 0
  }
  console.log('----pageText', url, pageText)
  if (pageText) {
    pageObj.total = +pageText.match(/共(\S*)条/)[1] || 0
    const pageNoStr = pageText.match(/当前1(\S*)页/)[1]
    pageObj.pageNo = +pageNoStr.replace('/', '') || 0
  }
  return pageObj
}

/**
 * 获取影片类型-分类处理
 * @param {*} param0 
 */
const getTab = async({jsonList, fileName, startIndex = 0, endInex = 0}) => {
  const tabTvList = []
  if (endInex === 0) {
    endInex = jsonList.length
  }
  try {
    for (let index = 0; index < endInex; index++) {
      const tabEl = jsonList[index]
      const tempTabEl = {
        ...tabEl,
        ...{}
      }
      for (let i = 0; i < tabEl.tabPage.length; i++) {
        const el = tabEl.tabPage[i];
        const pageList = []
        const log = {
          event: 'getTab',
          tabName: tabEl.tabName,
          index: el.index,
          href: el.href
        }
        const { list, $ } = await getTabListApi({url: el.href, log})
        for (let pIndex = 1; pIndex < list.length; pIndex++) { // 第一个dom为表格头部，所以不计入
          const pEl = list[pIndex];
          const name = $(pEl).find('.xing_vb4 a').text()
          const href = $(pEl).find('.xing_vb4 a').attr('href')
          const pObj = {
            name,
            href: `${domain}${href}`,
            type: $(pEl).find('.xing_vb5').text(),
            is_end: name.indexOf('完结') > 0 || name.indexOf('集全') > 0
          }
          pageList.push(pObj)
        }
        tempTabEl.tabPage[i].pageList = pageList
      }
      tabTvList.push(tempTabEl)
      writeFile({
        path: './json/tab',
        fileName,
        content: JSON.stringify(tabTvList)
      })
    }
  } catch (error) {
    console.log('error----getTab', error)
  }
}
/**
 * 获取影片类型-不分类处理
 */
const getTabAll = async({menu, fileName, startIndex = 0, endInex = 0}) => {
  const { href, page_no, menu_name, menu_type } = menu
  if (endInex === 0) {
    endInex = page_no
  }
  for (let index = startIndex; index < endInex; index++) {
    const url = `${href}`.replace('.html', `-${index + 1}.html`)
    const log = {
      index,
      menuName: menu_name,
      type: menu_type,
      href: url,
    }
    await getTabAllData({
      url,
      fileName,
      log
    })
  }
}

/**
 * 根据url获取影片信息
 */
const getVideoInfoList = async ({jsonList, fileName, startIndex = 0, endInex = 0}) => {
  console.log('----爬取总数', jsonList.length)
  if (endInex === 0) {
    endInex = jsonList.length
  }
  for (let index = startIndex; index < endInex; index++) {
    const el = jsonList[index];
    const { href, name } = el
    const log = {
      href,
      name,
      index
    }
    await handleVideoInfo({
      url: href,
      fileName,
      log
    })
  }
}

/**
 * 获取视频类型对应的电视剧/电影url
 * @param {*} param0 
 */
const getTabListApi = async ({url, log}) => {
  let list = []
  let $ = null
  try {
    const html = await RqApi.get(url)
    $ = cheerio.load(html)
    list = $('.xing_vb > ul > li')
  } catch (error) {
    console.log('----error', error)
    writeLog({
      path: './json/logs',
      fileName: 'menuTv',
      log: { ...log, error }
    })
  } finally {
    return {
      list,
      $
    }
  }
}

const getTabAllData = async ({url, fileName, log}) => {
  console.log('----爬取地址----', log.index, url)
  try {
    const tempList = []
    const html = await RqApi.get(url)
    $ = cheerio.load(html)
    const pageList = $('.xing_vb > ul > li')
    for (let index = 1; index < pageList.length; index++) { // 第一个dom为表格头部，所以不计入
      const el = pageList[index];
      const name = $(el).find('.xing_vb4 a').text()
      const href = $(el).find('.xing_vb4 a').attr('href')
      const typeName = $(el).find('.xing_vb5').text()
      if (name && href && typeName) {
        const pageObj = {
          name,
          href: `${domain}${href}`,
          type_name: typeName,
          type: MOVIE_TYPE(typeName),
          is_end: name.indexOf('完结') > 0 || name.indexOf('集全') > 0
        }
        tempList.push(pageObj)
      }
    }
    const data = await readFile({
      path: './json/tab',
      fileName,
    })
    const readFileList = JSON.parse(data)
    readFileList.push(...tempList)
    await writeFile({
      path: './json/tab',
      fileName,
      content: JSON.stringify(readFileList)
    })
  } catch (error) {
    console.log('----getTabAllData', error)
    writeLog({
      path: './json/logs',
      fileName,
      log: { ...log, fn: 'getTabAllData', error: JSON.stringify(error) },
    })
  }
}

const handleVideoInfo = async ({url, fileName, log}) => {
  const videoIndex = log.index
  console.log('----爬取地址----', videoIndex, url)
  try {
    const html = await RqApi.get(url)
    $ = cheerio.load(html)
    const videoDom = $('.warp .vodBox')
    const lineDom = $('.warp .vodplayinfo')
    const imgSrc = $(videoDom).find('.lazy').attr('src')
    const videoName = $(videoDom).find('.vodh h2').text()
    const videoDes = $(videoDom).find('.vodh > span').text()
    const videoScore = $(videoDom).find('.vodh > label').text()
    const introduce = $(lineDom[0]).text()
    const infoList = $(videoDom).find('.vodinfobox ul li')
    const lineList = lineDom.find('h3')
    const videoInfo = {
      name: videoName,
      des: videoDes,
      score: videoScore,
      introduce: introduce.replace('\n', '').replace('\t', ''),
      cover: `${domain}${imgSrc}`,
    }
    for (let index = 0; index < infoList.length; index++) {
      const el = infoList[index];
      const elList = $(el).text().split('：')
      if (elList[0] && elList[1]) {
        const key = TRANS_NAME(elList[0])
        key && (videoInfo[key] = elList[1])
      }
    }
    videoInfo.lines = []
    for (let index = 0; index < lineList.length; index++) {
      const elName = lineDom.find('h3')[index]
      const elLine = lineDom.find('ul')[index]
      const lines = $(elLine).find('li')
      const sourceName = $(elName).text()
      const sourceList = []
      for (let i = 0; i < lines.length; i++) {
        const el = lines[i];
        sourceList.push({
          index: i,
          line: $(el).text()
        })
      }
      videoInfo.lines.push({
        source_name: sourceName,
        source_list: sourceList
      })
    }
    // const htmlName = url.match(/bo(\S*).html/)[1]
    // await writeFile({
    //   path: './html/tab/movie',
    //   fileName: htmlName,
    //   fileType: 'html',
    //   content: $.html()
    //   // content: JSON.stringify(readFileList)
    // })
    const data = await readFile({
      path: './json/tab',
      fileName,
    })
    const readFileList = JSON.parse(data)
    readFileList[videoIndex].video_info = videoInfo
    await writeFile({
      path: './json/tab',
      fileName,
      content: JSON.stringify(readFileList)
    })
  } catch (error) {
    console.log('----error', error)
    writeLog({
      path: './json/logs',
      fileName,
      log: { ...log, error: JSON.stringify(error) }
    })
  }
}

// getMenu({
//   url: domain
// })
// getTab({
//   jsonList: menuTv.menu,
//   fileName: 'tavTv',
//   // endInex: 1
// })

// getTabAll({
//   menu: menuGod,
//   fileName: 'tab_god_all',
//   // endInex: 1
// })

// 记得修改html文件
getVideoInfoList({
  jsonList: tab_god_all,
  fileName: 'tab_god_all',
  // startIndex: 1320,
  // endInex: 1321
})


