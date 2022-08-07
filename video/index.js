/*
 * @Author: EdisonGu
 * @Date: 2022-08-07 16:29:55
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-07 18:57:07
 * @Descripttion: 爬取视频
 */
const cheerio = require('cheerio')
const { RqApi } = require('../api/index.js')
const { writeFile, readFile, writeLog, distinctList } = require('../utils/index.js')
const movieMenu = require('./json/menu/movieMenu.json')

const tabMovie = movieMenu[1] // 电影菜单
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
      const menuTitle =  $(el).find('li > a').text()
      const menuHerf = $(el).find('li a').attr('href')
      const tabList = $(el).find('li > div > a') // 菜单对应的a标签集合
      const menuObj = {
        menuName: menuTitle,
        href: `${domain}${menuHerf}`,
        menu: []
      }
      if (tabList.length === 0) {
        const pageObj = await pageDetail({url: `${domain}${menuHerf}`})
        menuObj.total = pageObj.total
        menuObj.pageNo = pageObj.pageNo
      }
      for (let i = 0; i < tabList.length; i++) {
        const e = tabList[i];
        const tabTitle = $(e).text()
        const tabHerf = $(e).attr('href')
        const pageObj = await pageDetail({url: `${domain}${tabHerf}`})
        const tabObj = {
          tabName: tabTitle,
          href: `${domain}${tabHerf}`,
          pageNo: pageObj.pageNo,
          total: pageObj.total
        }
        menuObj.menu.push(tabObj)
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

// getMenu({
//   url: domain
// })

