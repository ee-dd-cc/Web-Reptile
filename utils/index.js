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

const writeFile = ({path, fileType = 'json', fileName, content}) => {
  fs.writeFile(`${path}/${fileName}.${fileType}`, content, 'utf-8', err => {
    if(err) throw err
    console.log('-----成功')
  })
}

module.exports = {
  dateFormat,
  writeFile
}
