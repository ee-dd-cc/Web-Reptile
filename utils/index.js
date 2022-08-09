/*
 * @Author: EdisonGu
 * @Date: 2022-07-11 19:12:53
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-08 16:53:48
 * @Descripttion: 
 */
const fs = require('fs')

const dateFormat = (val) => {
  const ddd = new Date(+val)
  let fullYear = ddd.getFullYear()
  let month = ddd.getMonth() + 1
  let date = ddd.getDate()
  let hours = ddd.getHours()
  let minutes = ddd.getMinutes()
  let seconds = ddd.getSeconds()
  return `${fullYear}-${month}-${date} ${hours}:${minutes}`
}

/**
 * 数组根据传过来的key去重
 */
const distinctList = ({list, key}) => {
  const tempList = []
  for(let i = 0; i < list.length; i++) {
    for(let j = i+1; j < list.length; j++) {
      if (list[i][key] === list[j][key]) {
        j = ++i
      }
    }
    tempList.push(list[i])
  }
  return tempList
}

const writeFile = async ({path, fileType = 'json', fileName, content}) => {
  const filePath = `${path}/${fileName}.${fileType}`
  let status = false // 是否成功写入
  await new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf-8', (err, data) => {
      if(err) {
        reject(err)
      }
      resolve(data)
      status = true
      console.log('----写入文件成功', filePath)
    })
  })
  return status
}

const readFile = async ({path, fileType = 'json', fileName, contentType = 'array'}) => {
  const filePath = `${path}/${fileName}.${fileType}`
  let readData = await new Promise((resolve, reject) => {
    fs.readFile(filePath, async (err, data) => {
      if(err) {
        console.log('----没有文件，重新写入')
        if (err.errno == -4058) {
          const status = await writeFile({
            path,
            fileName,
            content: contentType === 'array' ? '[]' : '{}'
          })
          if(!status) {
            reject(err)
          } else {
            const res = await readFile({path, fileName})
            resolve(res)
          }
        }
        // throw err
      }
      resolve(data)
    })
  })
  return readData
}

const writeLog = async ({path, fileName, log}) => {
  const content = {
    time: new Date().getTime(),
    ...log,
  }
  const readRes = await readFile({ path, fileName }) || '[]'
  const logList = JSON.parse(readRes)
  logList.push(content)
  writeFile({
    path,
    fileName,
    content: JSON.stringify(logList)
  })
}

module.exports = {
  dateFormat,
  writeFile,
  readFile,
  distinctList,
  writeLog
}
