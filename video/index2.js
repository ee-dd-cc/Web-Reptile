/*
 * @Author: EdisonGu
 * @Date: 2022-08-10 20:53:53
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-09-08 00:38:57
 * @Descripttion: 
 */
// 引入superagent
let request = require('superagent')
const puppeteer = require('puppeteer');
const { RqApi } = require('../api/index.js')

// 引入superagent-proxy
require('superagent-proxy')(request)

// 目标网站
// let targetUrl = 'https://v.douyin.com/RQSexLF/'

// 代理服务器信息
// 代理账号密码信息 如：account:password
let auth = 'YUWEIDBHC5PMS70:HOz6Y1cv'
// 设置代理服务器域名和端口 如：example.cn:8888  注意：此处域名不能带协议，具体的域名要依据据开通账号时分配的而定
let proxy_server = 'http-proxy-t3.dobel.cn:9180'
// 代理验证url 如：http://account:password@example.cn:8888
let proxyUrl = 'http://' + auth + '@' + proxy_server

let roomId = ''

var find_link = async function (link) {
  var res = await request(link)
  // console.log('----res, ', res)
  let query = res.redirects.pop().split('/').pop();
  if (query.includes('roomId')) {
    // console.log('query', query, query.match(/roomId=(.*)/))
    roomId = query.match(/roomId=(.*)/)[1].split('&')[0]
  } else {
    roomId = query.split('?')[0].split('&')[0]
  }
  return roomId
}

var find_url = async (url) => {
  const browser = await puppeteer.launch({
    // headless: false,
    // args: [
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox',
    //   '--disable-blink-features=AutomationControlled',
    // ],
  });
  console.log('----url', url)
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.url().indexOf('m3u8') > -1) {
      console.log('------哈哈哈哈', req.url())
    }
    req.continue();
  });
  page.on('response', async res => {
    if(res.url().indexOf('super.php') > -1) {
      // const res = await response.json()
      console.log('-----ok', res.ok())
      const headers = res.headers()
      try {
        const html = await RqApi.get(res.url(), headers)
        console.log('----html', html)
      } catch (error) {
        console.log('----error', error)
      }
    }
  })
  await page.goto(url, {
    timeout: 0
  });
  const frames = page.frames()
  frames.forEach(async (frame, index) => {
    if (index === 3) {
      console.log('----item', index, await frame.url())
      // const text = await frame.$eval('.video-wrapper', element => element.textContent)
      // console.log('----frame', await frame.$eval('video', el => el.src))
    }
  })
  await browser.close();
};

// NRf8PQD
// NRfbeS1
// https://v.douyin.com/jF3Mb4R/
// find_link("https://v.douyin.com/jF3Mb4R").then(url => {
//   console.log(url);
// });

// find_url('https://www.recer.cn/vodplay/122578-1-1.html')
// find_url('https://www.xcjggz.com/sakura-10172-2-1781.html')
// find_url('https://www.douyin.com/video/7124069551167343903')
// find_url('https://www.6080x.cc/play/69819-1-1.html')
find_url('https://player.6080kan.cc/player/play.php?url=pRoo00oE5lRo000oo000oijkVkkVIx56G4lvcm6r3SRSHdjeFIJDvkkBBJjCmTxyV6dlACq5kIo000o0qOO8dlxMJo000oX8WXy1oo00oCe4fIKvo000o5w2gB1wQZBL6UikOBsZjkqiCze0iMTCf6lYXbdc')
