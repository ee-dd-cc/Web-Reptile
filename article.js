const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
const { dateFormat } = require('./utils/index.js')
const article = require('./json/article.json')

const setArticleHome = async () => {
  const $doc = await getTemplate('./article.html')
  let contentHtml = ''
  let sideHtml = ''
  article.forEach(item => {
    const contentLi = `
      <li class="panel-cell">
        <div class="com-3-article-panel theme2">
          <a href="${item.herf}" target="_blank" class="panel-link" hotrep=""></a>
          <div class="com-3-article-panel-media">
            <div class="com-3-article-panel-body">
              <h3 class="com-3-article-panel-title">${item.title}</h3>
              <p class="com-3-article-panel-desc">${item.desc}</p>
              <div class="com-3-article-panel-infos">
                <div class="com-3-article-panel-source">
                  <span> ${item.author} </span>
                  <span class="item time" time=${item.time}>${dateFormat(item.time)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    `
    const sideLi = `
      <li>
        <a href="${item.herf}" target="_blank" class="com-media com-side-topic" title="${item.title}">
          <div class="com-media-body">
            <h3 class="com-side-activity-title">
              <p class="com-side-activity-title-main">${item.title}</p>
              <p class="com-side-activity-title-special">${item.desc}</p>
            </h3>
          </div>
        </a>
      </li>
    `
    contentHtml += contentLi
    sideHtml += sideLi
  })
  $doc('.com-3-article-panels').append(contentHtml)
  $doc('.com-2-side-topics').append(sideHtml)
  fs.writeFile(`./rjhy/html5-community/article/index.html`, $doc.html(), 'utf-8', err => {
    if(err) throw err
    console.log('----成功')
  })
}

const setArticleContent = async ({content, htmlName, time}) => {
  const $doc = await getTemplate('./articleContent.html')
  let sideHtml = ''
  article.forEach((item, index) => {
    const sideLi = `
      <li>
        <a href="${item.herf}" target="_blank" class="com-media com-side-topic" title="${item.title}">
          <div class="com-media-body">
            <h3 class="com-side-activity-title">
              <p class="com-side-activity-title-main">${item.title}</p>
              <p class="com-side-activity-title-special">${item.desc}</p>
            </h3>
          </div>
        </a>
      </li>
    `
    sideHtml += sideLi
  })
  try {
    const $ = cheerio.load(content)
    $('.article-info time').html(dateFormat(time))
    $doc('.layout-main').append($.html())
    $doc('.com-2-side-topics').append(sideHtml)
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

// 获取文章首页
const getArticleHome = () => {
  setArticleHome()
  // article.forEach((item, index) => {
  //   setTimeout(async () => {
  //     await setArticleHome(item)
  //     console.log('-----index', index)
  //   }, index * 500)
  // })
}

// 获取文章内容
const getArticleContent = () => {
  article.forEach((item, index) => {
    setTimeout(async () => {
      await setArticleContent(item)
      console.log('-----index', index)
    }, index * 500)
  })
}

// getHome()
// getDocLv1()
// getDocLv2()
// getDocLv3()

getArticleHome()
getArticleContent()



