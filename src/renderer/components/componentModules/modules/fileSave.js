const fs = require('fs')
const path = require('path')

function saveSnapshot(obj) {
  let filePath = path.join(__dirname, 'test.txt')
  console.log(filePath)
  // console.log('i am here', JSON.stringify(obj))
  let data = JSON.stringify(obj)
  let exists = false
  fs.access('./test.txt', fs.F_OK, err => {
    if (err) {
      console.log('Log file does not exist, will create one')
    }
  })
  try {
    fs.writeFile('./test.txt', data, err => {
      if (err) console.log(err)
    })
  } catch (e) {
    console.log(e)
  }
}

export default {
  saveSnapshot
}
