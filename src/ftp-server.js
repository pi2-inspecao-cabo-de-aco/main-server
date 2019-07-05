import FtpSrv from 'ftp-srv'
import config from './config'
import { infoControll } from './info-explorer'
import Path from 'path'

async function initFtpServer () {
  let server = new FtpSrv({
    url: `ftp://${config.myIp}:30003`,
    pasv_url: '127.0.0.1'
  })

  server.on('login', async ({ connection, username, password }, resolve, reject) => {
    console.log('Resolving connection. Connected.', username, password)
    // TODO: deletar quando nao estiver utilizando o mock

    connection.on('STOR', async (err, filename) => {
      if (err) {
        console.log(`--------> Error: ${err.message} <--------`)
      }
      console.log(`---> Arquivo recebido: ${filename}`)
      await infoControll(filename)
    })

    connection.on('error', console.log)
    resolve()
  })

  server.on('client-error', ({ context, error }) => {
    console.log(context, error)
  })

  await server.listen()
}

import { exec } from 'child_process'
import util from 'util'

const execpromise = util.promisify(exec)
let backup = {}

function resetBackup () {
  backup = {}
}

let interval

function removeInterval () {
  clearInterval(interval)
}

async function watchFiles () {
  const TMP_PATH = '/tmp/comp'
  const RICAS_IP = 'pi@192.168.1.1'
  const RICAS_PASS = 'ricas123'
  const LOCAL_PATH = '/home/thiago/Desktop/UnB/pi2/main-server/public/'

  console.log('----------> Executando comando de identificar arquivos gerados')
  try {
    let { stdout, stderr } = await execpromise(`sshpass -p ${RICAS_PASS} ssh ${RICAS_IP} ls ${TMP_PATH}`)
    if (stderr) {
      console.log(stderr)
    }

    let values = stdout.split('\n') // get filenames as array
    for (let i of values) {
      if (i.length > 0) {
        backup[i] = i // build key:value object to O(1) access, minimizing code complexity
        console.log(`>>>>>>>>>>> Baixando ${i}`)
        let filepath = LOCAL_PATH
        await execpromise(`sshpass -p ${RICAS_PASS} scp ${RICAS_IP}:${TMP_PATH}/${i} ${filepath}`)
        await infoControll(i)
        console.log('>>>>>>>>>>>>>>> Done.')
      }
    }

    // interval to check new files
    interval = setInterval(async () => {
      // get new list
      let { stdout, stderr } = await execpromise(`sshpass -p ${RICAS_PASS} ssh ${RICAS_IP} ls ${TMP_PATH}`)
      if (stderr) {
        console.log(stderr)
      }
      let array = stdout.split('\n') // get filenames as array
      let newFilename = array.find(c => !backup[c]) // file new value
      if (newFilename && newFilename.includes('.zip')) {
        console.log(`--------------> Novo arquivo identificado: ${newFilename}. Copiando arquivo`)
        console.log(`--------------> Copiando....`)
        backup[newFilename] = newFilename // set new value as backup
        let filepath = LOCAL_PATH + newFilename
        await execpromise(`sshpass -p ${RICAS_PASS} scp ${RICAS_IP}:${TMP_PATH}/${newFilename} ${filepath}`) // copy file to local file system
        console.log(`--------------> Arquivo copiado.`)
        await infoControll(newFilename)
      }

      if (newFilename && newFilename.includes('.txt')) {
        console.log(`--------------> Fim de curso identificado: ${newFilename}.`)
        backup[newFilename] = newFilename
        await infoControll(newFilename)
      }
    }, 5000)
  } catch (err) {
    console.log(err)
  }
}

export {
  watchFiles,
  initFtpServer,
  resetBackup,
  removeInterval
}
