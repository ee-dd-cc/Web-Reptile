/*
 * @Author: EdisonGu
 * @Date: 2022-08-10 20:53:53
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-11 00:16:38
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
    headless: false,
    // args: [
    //   '--no-sandbox',
    //   '--disable-setuid-sandbox',
    //   '--disable-blink-features=AutomationControlled',
    // ],
  });
  console.log('----url', url)
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // page.on('request', interceptedRequest => {
  //   if (interceptedRequest.url().indexOf('super.php') > -1) {
  //     console.log('------哈哈哈哈', interceptedRequest.url())
  //   }
  //   if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
  //     interceptedRequest.abort();
  //   else
  //     interceptedRequest.continue();
  // });
  // page.on('response', async response => {

  // if( response.url().indexOf('super.php') > -1) {
  //   // const res = await response.json()
  //   console.log('-----ok', response.ok())
  //   const headers = response.headers()
  //   try {
  //     const html = await RqApi.get(response.url(), headers)
  //     console.log('----html', html)
  //   } catch (error) {
  //     console.log('----error', error)
  //   }
  //   // console.log('-----res',await response.json())
  //   // console.log('-----res', await response)
  // }
  // })
  await page.goto(url, {
    timeout: 0
  });
  const frames = page.frames()
  // const body = await page.evaluate(() => document.body.innerHTML)
  console.log('----frames', frames.length)
  frames.forEach(async (frame, index) => {
    if (index === 3) {
      // console.log('----item', index, await frame.content())
      // const text = await frame.$eval('.video-wrapper', element => element.textContent)
      console.log('----frame', await frame.$eval('video', el => el.src))
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

find_url('https://www.mjwo.cc/play/13955-1-1/')
// find_url('https://www.douyin.com/video/7124069551167343903')