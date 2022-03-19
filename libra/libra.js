const fs = require('fs')

const nodeXlsx = require('node-xlsx')
const ex1 = nodeXlsx.parse('./libra_url.xlsx')
const sidebar = require('./sidebar.json')
const exContent = ex1[0].data
let exJson = []

exContent.splice(0, 1)

exContent.forEach(item => {
  const obj = {
    name: item[2],
    url: item[1]
  }
  exJson.push(obj)
})

// const exJson = exContent.

fs.writeFile(`./exJson.json`, JSON.stringify(exJson), 'utf-8', err => {
  if (err) throw err
  console.log('----成功')
})

// console.log('-----exJson', exJson)
// console.log('----exContent', exContent)