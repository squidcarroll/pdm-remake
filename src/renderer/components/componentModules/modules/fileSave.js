const fs = require('browserify-fs')
const path = require('path')

function saveSnapshot(obj) {
  let filePath = path.join(__dirname, 'test.txt')
  console.log(filePath)
  // console.log('i am here', JSON.stringify(obj))
  let data = JSON.stringify(obj)
  try {
    fs.writeFile('c:/Users/Sid/Desktop/test.txt', data, err => {
      if (err) console.log(err)
    })
  } catch (e) {
    console.log(e)
  }
}

export default {
  saveSnapshot
}
