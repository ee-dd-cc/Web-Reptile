/*
 * @Descripttion: 
 * @Author: yuankun.gu
 * @Date: 2022-03-20 22:24:21
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-10 23:52:45
 */
const request = require('request')

const reGet = async (url, headers = {}) => {
  return new Promise((resolve, reject) => {
    console.log('----headers', headers)
    request.get(url, { timeout: 300000, headers }, (err, res, html) => {
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

