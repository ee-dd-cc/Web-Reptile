/*
 * @Author: EdisonGu
 * @Date: 2022-08-16 16:55:30
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-16 19:51:56
 * @Descripttion: 
 */
const tab_tv_all = require('./json/tab/tab_tv_all.json')

const tab_movie_all = require('./json/tab/tab_movie_all.json')

const { writeFile } = require('../utils/index.js')

const { MOVIE_TYPE, TRANS_NAME } =  require('../constants/movieType')

const movieTv = []
const movieAll = []
console.log('----movieList', tab_movie_all.length)

tab_movie_all.forEach(el => {
  const { video_info: { lines = [] } } = el
  if (lines && lines.length && lines[0].source_list.length > 1) {
    movieTv.push(el)
  } else {
    movieAll.push(el)
  }
})
console.log('----movieTv', movieAll.length, movieTv.length)
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