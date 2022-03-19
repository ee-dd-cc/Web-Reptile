const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')

const lv1 = require('./json/lv1.json')
const lv2 = require('./json/lv2.json')
const lv3 = require('./json/lv3.json')
// const chapterPath = '/rjhy/html5-community/chapter/'
const setHtml = async ({ url, htmlName}) => {
  const $doc = await getTemplate()
  // const $doc = await getTemplate('./docIndex.html')
  try {
    const html =  await requestP(url)
    const $ = cheerio.load(html)
    const docMain = $('.doc-main')[0]
    const docMenu = $('.J-doc-aside-menu')[0]
    formatTag(html, docMain, '.doc-group a' )
    formatTag(html, docMain, '.J-doc-crumb a' )
    formatTag(html, docMenu, '.c-tree-item a' )
    $doc('.doc-main').append($(docMain).html())
    $doc('.J-doc-aside-menu').append($(docMenu).html())
    fs.writeFile(`${htmlName}.html`, $doc.html(), 'utf-8', err => {
      if(err) throw err
      console.log('---path', htmlName)
    })
  } catch (error) {
    console.log('----setHtml', error)
  }
  
}

const setArticle = async ({ url, htmlName}) => {
  const $doc = await getTemplate('./article.html')
  try {
    const html =  await requestP(url)
    const $ = cheerio.load(html)
    // const docMain = $('.doc-main')[0]
    // const docMenu = $('.J-doc-aside-menu')[0]
    // formatTag(html, docMain, '.doc-group a' )
    // formatTag(html, docMain, '.J-doc-crumb a' )
    // formatTag(html, docMenu, '.c-tree-item a' )
    // $doc('.doc-main').append($(docMain).html())
    // $doc('.J-doc-aside-menu').append($(docMenu).html())
    fs.writeFile(`${htmlName}.html`, $doc.html(), 'utf-8', err => {
      if(err) throw err
      console.log('---path', htmlName)
    })
  } catch (error) {
    console.log('----setHtml', error)
  }
}

const getTemplate = async (url = './doc.html') => {
  return new Promise((resolve, reject) => {
    fs.readFile(url, (err, res) => {
      if (res) {
        const $doc = cheerio.load(res)
        resolve($doc)
      }
      if (err) {
        reject(err)
      }
    })
  })
}

const formatTag = (html, el, path) => {
  const $ = cheerio.load(html)
  $(el).find(path).each((index, item) => { // 改变a标签的路由
    if (!$(item).attr('href')) return
    const href = $(item).attr('href').replace('/developer', '')
    $(item).attr('href', `..${href}.html`)
  })
}

const requestP = async url => {
  return new Promise((resolve, reject) => {
    request.get(url, { timeout: 2000 }, (err, res, html) => {
      if (err) {
        reject(err)
      }
      if (res && res.statusCode === 200) {
        resolve(html)
      }
    } )
  })
}





// 获取doc首页
const getHome = () => {
  const params = {
    "tabText": "devdocs",
    "title": "devdocs",
    "href": "/developer/index",
    "htmlName": "./rjhy/html5-community/developer/index",
    "url": "https://cloud.tencent.com/developer/devdocs"
  }
  setHtml(params)
}

// 获取一级页
const getDocLv1 = () => {
  lv1.forEach(async (item, index) => {
    setTimeout(async () => {
    await setHtml({ ...item })
    }, index * 500)
  })
}
// 获取二级页
const getDocLv2 = () => {
  lv2.forEach(async (item, index) => {
    setTimeout(async () => {
      await setHtml({ ...item })
    }, index * 500)
  })
}
// 获取三级页
const getDocLv3 = () => {
  lv3.forEach((item, index) => {
    setTimeout(async () => {
     await setHtml({ ...item })
      console.log('lv3-----index', index)
    }, index * 500)
  })
}

// 获取文章首页
const getArticleHome = () => {
  const params = {
    "tabText": "devdocs",
    "title": "devdocs",
    "href": "/developer/index",
    "htmlName": "./rjhy/html5-community/article/index",
    "url": "https://cloud.tencent.com/developer/article/1882733"
  }
  setArticle(params)
}
// getHome()
// getDocLv1()
// getDocLv2()
getDocLv3()

// getArticleHome()



