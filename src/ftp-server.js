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

async function main () {
  const TMP_PATH = '/tmp/comp'
  const RICAS_IP = 'pi@192.168.4.12'
  const RICAS_PASS = 'ricas123'
  const LOCAL_PATH = '~/Projects/pi2/main-server/public/'

  console.log('----------> Executando comando de identificar arquivos gerados')
  let { stdout, stderr } = await execpromise(`sshpass -p ${RICAS_PASS} ssh ${RICAS_IP} ls ${TMP_PATH}`)
  if (stderr) {
    console.log(stderr)
  }

  let backup = {}
  let values = stdout.split('\n') // get filenames as array
  for (let i of values) {
    backup[i] = i // build key:value object to O(1) access, minimizing code complexity
  }

  // interval to check new files
  setInterval(async () => {
    // get new list
    let { stdout, stderr } = await execpromise(`sshpass -p ${RICAS_PASS} ssh ${RICAS_IP} ls ${TMP_PATH}`)
    if (stderr) {
      console.log(stderr)
    }
    let array = stdout.split('\n') // get filenames as array
    let find = array.find(c => !backup[c]) // find new value
    if (find) {
      console.log(`--------------> Novo arquivo identificado: ${find}. Copiando arquivo`)
      console.log(`--------------> Copiando `)
      backup[find] = find // set new value as backup
      let filepath = LOCAL_PATH + find
      await execpromise(`sshpass -p ${RICAS_PASS} scp ${RICAS_IP}:${TMP_PATH}/${find} ${filepath}`) // copy file to local file system
      console.log(`--------------> Arquivo copiado.`)
      // await infoControll(filename)
    }
  }, 5000)
}

main().then().catch()

export {
  initFtpServer
}
