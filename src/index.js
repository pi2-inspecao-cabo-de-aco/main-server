// GraphQL Setup Imports
import { GraphQLServer, PubSub } from 'graphql-yoga'
import typeDefs from './type-defs'
import resolvers from './resolvers'

// Global config
import config from './config'

// Custom API setup
import upload from './api/upload'

// Ensure upload path dir
import fsx from 'fs-extra'
import Path from 'path'

const publicDir = Path.join(__dirname, '../public')
fsx.ensureDirSync(publicDir)

// FTP Server
import { initFtpServer } from './ftp-server'

// Set global pubsub
import { setPubSub } from './helpers/analysis'

const sleep = (timeout) => (new Promise((resolve, reject) => (setTimeout(resolve, timeout))))

async function main () {
  const pubsub = new PubSub()
  setPubSub(pubsub)
  const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: conn => {
      return { pubsub }
    }
  })

  let options = {
    endpoint: '/graphql',
    subscriptions: '/graphql',
    uploads: {
      maxFieldSize: 1000,
      maxFileSize: 10000000,
      maxFiles: 1
    },
    cors: {
      origin: true
    }
  }

  for (let i = 0; i < config.retries; i++) {
    try {
      console.log('Initing FTP server...')
      await initFtpServer()
      console.log('FTP server is running on ftp://localhost:30003')
      break
    } catch (err) {
      console.err('Error on creating server.', err)
      console.log('Retrying connection...')
      sleep(1000)
    }
  }

  server.express.use('/file-upload', upload())

  server.start(options, opts => {
    console.log(`Server is running on http://localhost:${opts.port}`)
  })
}

main()
