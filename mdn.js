const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const async = require('async')
const publicAPI = require('./utils/publicAPI.js')


const url = 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex'
const urlRoot = 'https://developer.mozilla.org'
const root = ''

const write = (index, callback) => {
  if (index == length - 1) {
      var fileName = endWith ? "index." + config.endWith : usePathAsName ? array[array.length-1] : array[array.length-1] + config.endWith;
      console.log(currentPath);console.log(fileName);
      fs.writeFile(currentPath + "/" + fileName, html, function (err) {
          if (err) {
              console.log(err, "appendFile");
          } else {
              callback();
          }
      });
  }
}

const getCss = (stylesheets) => {
  var res = [];
  stylesheets.each(function (i, style) {
      var src = style.attribs.href;
      if (!src)
          return;
      res.push(`${urlRoot}${src}`);
  });
  return publicAPI.uniqueArray(res);
}

const getJs = (scripts) => {
  var res = [];
    scripts.each(function (i, script) {
        var src = script.attribs.src;
        if (!src)
            return;
        res.push(src);
    });
    return publicAPI.uniqueArray(res);
}

const saveCss = (url, css, callback, callback2) => {
  if(fs.existsSync('./mdn/css')) { // 判断是否有这个目录
    for(let i = 0; i <= css.length; i++) {
      request(css[i], (err, res, body) => {
        fs.writeFile('./mdn/static/css/main.55b68e13.chunk.css', body, function (err) {
          if (err) {
            console.log(err, "appendFile");
          }
        })
      })
      // fetch(css[i], res => {
      //   console.log('----res', res)
      // })
      
    }
  }
}


const getHtml = ({ url, htmlName }) => {
	request(url, (err, res, html) => {
		if (!err && res.statusCode === 200) {
			const $ = cheerio.load(html)
      const stylesheets = $("link[rel='stylesheet']")
      const scripts = $('script')
      const css = getCss(stylesheets)
      const js = getJs(scripts)
      console.log('----jsList', js)
      // async.parallel([
      //   function (callback) {
      //     console.log('---callback', callback)
      //     saveCss(url, css, function (x, css) {
      //         console.log("Page:"+(count+1)+"    Css"+(x+1)+"     Src:"+css+"    Success!\n");
      //     },callback);
      //   }
      // ])
      // console.log('----$.html()', $.html())
			fs.writeFile(`./mdn/${htmlName}.html`, $.html(), 'utf-8', err => {
        if(err) throw err
        console.log('=======成功')
      })
		}
	})
}


getHtml({url, htmlName: '123'})