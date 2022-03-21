/*
 * @Descripttion: 
 * @Author: yuankun.gu
 * @Date: 2022-03-20 22:24:21
 * @LastEditors: yuankun.gu
 * @LastEditTime: 2022-03-20 22:43:24
 */
const request = require('request')

const reGet = async url => {
  return new Promise((resolve, reject) => {
    request.get(url, { timeout: 20000 }, (err, res, html) => {
      if (err) {
        reject(err)
      }
      if (res && res.statusCode === 200) {
        resolve(html)
      }
    } )
  })
}

const RqApi = {
  get: reGet
}

module.exports = {
  RqApi
}

