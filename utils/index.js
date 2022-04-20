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

const writeFile = ({path, fileType = 'json', fileName, content}) => {
  const filePath = `${path}/${fileName}.${fileType}`
  fs.writeFile(filePath, content, 'utf-8', err => {
    if(err) {
      console.log('----err.errno == -4058', err.errno == -4058)
      if (err.errno == -4058) { // 没有读取到就存一个
        fs.appendFile(``, content, error => {
          if (error) throw error
          console.log(`----新增文件成功----`, filePath)
        })
      }
    }
    if(err) throw err
    console.log('----写入文件成功', filePath)
  })
}


module.exports = {
  dateFormat,
  writeFile,
  distinctList
}
