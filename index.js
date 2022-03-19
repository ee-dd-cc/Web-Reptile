const request = require('request')
const cheerio = require('cheerio')
const jsonList = require('./json/list.json')
console.log("====jsonList", jsonList)

const link = '<link rel="stylesheet" href="https://www.runoob.com/wp-content/themes/runoob/style.css?v=1.164" type="text/css" media="all">'
// const url = 'https://www.runoob.com/html/html-tutorial.html'
const replaceHtml = (html, str = '古元坤') => {
	return html.replace('菜鸟', str)
}

const getHtml = ({ url, htmlName }) => {
	request(url, (err, res, html) => {
		if (!err && res.statusCode === 200) {
			const $ = cheerio.load(html)
			$('.article-body').each((index, el) => {
				if (index === 0) {
					console.log('---el', $(el).html())
				}
				const data = replaceHtml($(el).html())
				const htmlFile = cheerio.load(data)
				htmlFile('head').append(link)
				// fs.writeFile(`./html/${htmlName}.html`, htmlFile.html(), 'utf-8', err => {
				//     if(err) throw err
				//     console.log('=======成功')
				// })
			})
			// result = JSON.stringify(result)

		}
	})
}

jsonList.forEach((item, index) => {
	const url = item.url
	const htmlName = item.htmlName
	getHtml({ url, htmlName })
})


