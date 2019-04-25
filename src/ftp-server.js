import FtpSrv from 'ftp-srv'
import Path from 'path'
import fsx from 'fs-extra'

async function initFtpServer () {
  let server = new FtpSrv({
    url: 'ftp://localhost:3003',
    pasv_url: '127.0.0.1',
    pasv_range: '2500-8500'
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
