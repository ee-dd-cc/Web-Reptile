/*
 * @Descripttion: 爬取页面的菜单，返回json列表
 * @Author: yuankun.gu
 * @Date: 2021-07-30 17:03:53
 * @LastEditors: yuankun.gu
 * @LastEditTime: 2021-09-30 21:33:47
 */
const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
const { lvList } = require('./constants/tx.js')
const { articleList } = require('./constants/article.js')

const getList = ({ url, nodePath }) => {
	const list = []
	request(url, (err, res, html) => {
		const $ = cheerio.load(html)
		$(nodePath).each((index, el) => {
			const title = $(el).attr('title')
			const href = $(el).attr('href')
			const target = $(el).attr('target')
			list.push({
				title,
				href,
				htmlName: `${target}-${index}`,
				url: `https://www.runoob.com${href}`,
			})
		})
		fs.writeFile(`./json/list.json`, JSON.stringify(list), 'utf-8', err => {
			if (err) throw err
			console.log('=======成功')
		})
	})
}

const getTxList = async ({ url, nodePath, htmlPath }) => {
	const list = []
	return new Promise((resolve, reject) => {
		request(url, (err, res, html) => {
			if (res) {
				const $ = cheerio.load(html)
				$(nodePath).each((index, el) => {
					const $a = $(el).find('a')
					const title = $(el).attr('id')
					const href = $a.attr('href')
					const hrefList = href.split('/')
					const le = hrefList.length
					const $tabText = $(el).find('.c-tree-text').text()
					list.push({
						tabText: $tabText,
						title,
						href,
						htmlName: `${htmlPath}${hrefList[le - 1]}` || title, // 取路由最后一个为html取名
						url: `https://cloud.tencent.com${href}`,
					})
				})
				resolve(list)
			}
			if (err) {
				reject(err)
			}
		})
	})

	// return list
}

// 获取菜鸟教程
const getNoob = () => {
	const url = 'https://www.runoob.com/html/html-tutorial.html'
	const nodePath = '.left-column .sidebar-box a'
	getList({ url, nodePath })
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

const setDocJson = () => {
	lvList.forEach(async (item) => {
		const { jsonName, hasChildren, url, childrenParems } = item
		if (!url) return
		const res = await getTxList({ ...item })
		if (hasChildren) {
			const pList = res.map((p, i) => {
				return getTxList({
					...childrenParems,
					url: p.url
				})
			})
			Promise.all(pList).then(values => {
				let jsonList = []
				values.map(v => {
					v && v.map(n => jsonList.push(n))
				})
				fs.writeFile(`./json/${childrenParems.jsonName}.json`, JSON.stringify(jsonList), 'utf-8', err => {
					if (err) throw err
					console.log('=======成功')
				})
			})
		}
		fs.writeFile(`./json/${jsonName}.json`, JSON.stringify(res), 'utf-8', err => {
			if (err) throw err
			console.log('=======成功')
		})
	})
}



const setArticleJson = async () => {
	const list = []
	articleList.forEach(async (item, index) => {
		const { url, nodePath } = item
		try {
			const html = await requestP(url)
			const $ = cheerio.load(html)
			$(nodePath).each((i, el) => {
				list.push({
					...item,
					content: $(el).html()
				})
			})
			if (index === (articleList.length - 1)) {
				setTimeout(() => {
					fs.writeFile(`./json/article.json`, JSON.stringify(list), 'utf-8', err => {
						if (err) throw err
						console.log('=======成功')
					})
				}, 5000)
			}
		} catch (error) {
			console.log(`----setArticleJson----${index}`, error)
		}
	})
}
setArticleJson()

