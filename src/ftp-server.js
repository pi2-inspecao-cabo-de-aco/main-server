import FtpSrv from 'ftp-srv'
import config from './config'

async function initFtpServer () {
  let server = new FtpSrv({
    url: `ftp://${config.myIp}:30003`,
    pasv_url: '127.0.0.1'
  })

  server.on('login', ({ connection, username, password }, resolve, reject) => {
    console.log('Resolving connection. Connected.', username, password)
    connection.on('STOR', (err, filename) => {
      console.log(err, filename)
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