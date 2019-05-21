import FtpSrv from 'ftp-srv'
import config from './config'
import { infoControll } from './info-explorer'
import { knexInstance } from './db'

// TODO: deletar quando não estiver utilizando mais o mock
import { setCable, setReport } from './helpers/analysis'

async function initFtpServer () {
  // REMOVE when set from frontend
  let cable = await knexInstance('cables').first()
  let report = await knexInstance('reports').first()
  setCable(cable)
  setReport(report)
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

export {
  initFtpServer
}
