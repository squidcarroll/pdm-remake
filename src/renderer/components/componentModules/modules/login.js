const pasBuf = Buffer.alloc(7, 'sapatsn', 'ascii')
const checkSum = Buffer.alloc(1, 0x06)
const pass = Buffer.concat([pasBuf, checkSum], 8)
const serialport = require('serialport')

let validCmds = {
  y: {
    expBytes: 64,
    desc: 'gets stats'
  },
  I: {
    expBytes: 1,
    desc: 'initiate login'
  },
  g: {
    expBytes: 16,
    desc: 'get firmware info'
  },
  u: {
    expBytes: 48,
    desc: 'oper_stat1'
  }
}

let lastSent

let port = null

//verify login somewhere

// async function connectToPortAndLogin(selectedPort) {
//   if (!port) {
//     port = new serialport(selectedPort, {
//       baudRate: 9600,
//       autoOpen: false
//     })

//     try {
//       await openPort(selectedPort)
//       await loginAsync()
//       startLoop()
//     } catch (e) {
//       console.log(e)
//     }
//   } else {
//     if (port.isOpen) console.log('Port is already open')
//   }
// }

// function openPort(p) {
//   return new Promise((res, rej) => {
//     port.open(err => {
//       if (err) {
//         rej(err.message)
//       } else {
//         res(`Connection to port ${p.path} established`)
//       }
//     })
//   })
// }

function wowow() {
  console.log('wowo')
}

//This function runs a continuous loop that waits for incoming data
//It currently updates oper_stat every 200ms as well
// async function startLoop() {
//   let data
//   setInterval(() => {
//     inputCmd('y')
//     // console.log("yo");
//   }, 200)
//   while (1) {
//     data = await receiveIncomingData()
//     if (data.length > 0) {
//       obj.dataHandler(data)
//     } else console.log('waiting for data')
//     port.removeAllListeners('data')
//   }
// }

//This function is uses the captureDataAsync function to grab chunks of incoming data
//and stick it together in a new buffer. Once the length of the new buffer is equal to
//the expected length of the last sent command + 2 more bytes it'll return the data
//all in one buffer. The +2 bytes is to account for the recevied bytes from the handsake
//We can then use the two extra bytes to verify that we are receiving the correct data
// async function receiveIncomingData() {
//   return new Promise(async (res, rej) => {
//     let data = Buffer.from([])
//     let holder

//     console.log('last sent cmd', lastSent)
//     console.log('Expected Bytes', validCmds[lastSent].expBytes + 2)
//     while (data.length < validCmds[lastSent].expBytes + 2) {
//       // while (1) {
//       holder = await captureDataAsync()
//       data = Buffer.concat([data, Buffer.from(holder)])
//     }
//     if (data.length > 0) {
//       res(data)
//     } else res([])
//   })
// }

//Accepts a command and sends it to get acknowledged
// async function inputCmd(cmd) {
//   // let cmd = document.getElementById("input").value;
//   // document.getElementById("input").value = "";
//   lastSent = cmd
//   return new Promise(async (res, rej) => {
//     let data
//     try {
//       await getAckAsync(cmd)
//     } catch (e) {
//       console.log(e)
//       rej(e)
//     }
//   })
// }

//Initiates and verifies handshake
//All commands must go through here to get sent
// async function getAckAsync(cmd) {
//   let echo
//   return new Promise(async (res, rej) => {
//     // console.log("sending cmd:", cmd);

//     //send command once to start acknowledgement
//     if (sendCmd(cmd)) {
//       echo = await captureDataAsync()
//       let cmdByte = Buffer.from(cmd)[0]

//       if (cmdByte == echo[0]) {
//         //send same command again to get acknowledgement
//         if (sendCmd(cmd)) {
//           echo = await captureDataAsync()
//           if (echo[0] == cmdByte) {
//             console.log('matched twice')
//             res(true)
//           } else {
//             rej('did not match twice')
//           }
//         }
//       } else {
//         rej('Did not match')
//       }
//     } else rej('Could not send:', cmd)
//   })
// }

//This function does the actual sending of data
//Used by getAckAsync function
// async function sendCmd(cmd) {
//   if (validCmds.hasOwnProperty(cmd)) {
//     port.write(Buffer.from(cmd), err => {
//       if (err) {
//         console.log(err.message)
//         return false
//       } else {
//         console.log('Sent:', cmd)
//         return true
//       }
//     })
//   } else {
//     console.log('Not a valid command')
//     return false
//   }
// }

//
/*
  This function handles the login after connecting to a port
  It sends an 'I' and uses the getAckAsync function to complete the handshake
  then sends the password using sendBuf()
  after the password is sent the last byte of the returned data should be an 'I'
*/
//
// async function loginAsync() {
//   console.log('Starting Login')
//   return new Promise(async (res, rej) => {
//     try {
//       lastSent = 'I'
//       if (await getAckAsync('I')) {
//         console.log('Acknowledged, sending password')
//         sendBuf(pass)
//         let retVal = await captureDataAsync()

//         if (retVal[8].toString() == '73') {
//           res(console.log('login successful'))
//         } else {
//           rej('Characters do not match')
//         }
//       } else {
//         rej('Login failed2')
//       }
//     } catch (e) {
//       console.log(e)
//       rej('failed to login3')
//     }
//   })
// }

//This function hands the capturing of data
//Only used by a function if only a few bytes are required
//The receiveIncomingData function uses this to capture chunks and stick them together
// function captureDataAsync() {
//   return new Promise(async (resolve, reject) => {
//     function cb(data) {
//       if (data) {
//         port.removeListener('data', cb)
//         resolve(data)
//       } else {
//         console.log('booo')
//       }
//     }
//     port.on('data', cb)
//   })
// }

//Function used to send a buffer to the serial port
//Currently it is only used in the login to send the password
// async function sendBuf(buf) {
//   return new Promise((res, rej) => {
//     port.write(buf, err => {
//       if (err) {
//         rej(err.message)
//       } else {
//         console.log('Sent buf')
//         res(true)
//       }
//     })
//   })
// }

export default {
  validCmds,
  pass
}
