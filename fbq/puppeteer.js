const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.emojivip.com', {
    waitUntil: 'networkidle2',
    headless: false, // 关闭无头浏览器模式
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  });
  // page.pdf() is currently supported only in headless mode.
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
  await page.evaluate(function () {
    //该页面使用懒加载，滑动屏幕让图片加载
      window.scrollTo(0,1000)
      setTimeout(()=>{window.scrollTo(0,2000)},1000)
  })
  await page.waitForTimeout(3000)
  // 获取节点
  const data = await page.evaluate( ()=> {
    //拿到图片节点
      let dom = document.querySelectorAll('.main-content img')
      let arr = []
      for(let i=0;i<dom.length-1;i++){
          //去除base64格式
          if(!dom[i].src.includes('base64'))
          arr.push(dom[i].src) 
      }
      //返回图片链接
      return arr
  })
  console.log('-----data', data)
  setTimeout(async () => {
    await browser.close();
  }, 5000)
})();