/*
 * @Author: EdisonGu
 * @Date: 2022-08-16 16:55:30
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-18 13:51:24
 * @Descripttion: 
 */
const tab_tv_all = require('./json/tab/tab_tv_all.json')

const tab_movie_all = require('./json/tab/tab_movie_all.json')

const { writeFile } = require('../utils/index.js')

const { MOVIE_TYPE, TRANS_NAME } =  require('../constants/movieType')

const movieTv = []
const movieAll = []
let movieMongo = []
console.log('----movieList', tab_movie_all.length)

tab_movie_all.forEach((el, index) => {
  const {
    href,
    type,
    video_info: { name, score, area, release_year, cover, lines = [], actor, main_actor = '', introduce, description, director = '', language = '' }
  } = el
  const info = {
    name, // 混合名字
    title: '', // 中文
    sub_title: '', // 英文
    href, // 爬取地址
    score,  // 评分
    // director: director.split(','), // 导演
    director, // 导演
    author: [], // 编剧
    // actor: main_actor.split(','), // 主演
    actor: actor.filter(item => item), // 主演
    type, // 电影/电视剧类型
    video_type: 'movie', // 视频类型 - 电影/电视剧/综艺/动漫
    area, // 制片国家/地区
    // language: language.split(','),
    language: language.filter(item => item),
    publish_time: '',
    update_time: '',
    year: +release_year,
    video_time: '',
    // description: introduce,
    description,
    cover,
    score,
    imdb_no: '',
    lines
  }
  movieMongo.push(info)
  if (lines && lines.length && lines[0].source_list.length > 1) {
    movieTv.push(el)
  } else {
    movieAll.push(el)
  }
})

// writeFile({
//   path: './json/tab',
//   fileName: 'tab_movie_all' ,
//   content: JSON.stringify(tab_movie_all)
// })

writeFile({
  path: './json/tab',
  fileName: 'tab_movie_tv' ,
  content: JSON.stringify(movieTv)
})

writeFile({
  path: './json/tab',
  fileName: 'tab_movie' ,
  content: JSON.stringify(movieAll)
})
const tempList = movieAll.splice(0, 10)
writeFile({
  path: './json/tab',
  fileName: 'tab_movie_0-10' ,
  content: JSON.stringify(tempList)
})
// movieMongo = movieMongo.sort((a, b) => b.year - a.year)
movieMongo = movieMongo
  .sort((a, b) => a.year - b.year) // 年升序
  .map((item, index) => {
    return {
      id: 1000 + index,
      ...item
    }
  })
writeFile({
  path: './json/mongo',
  fileName: 'tab_movie_all' ,
  content: JSON.stringify({
    // RECORDS: movieMongo.filter((item, index) => index < 10)
    RECORDS: movieMongo.reverse()
  })
})