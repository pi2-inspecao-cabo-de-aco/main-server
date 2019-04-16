// GraphQL Setup Imports
import { GraphQLServer } from 'graphql-yoga'
import typeDefs from './type-defs'
import resolvers from './resolvers'

// Global config

// Custom API setup
import upload from './api/upload'

// Ensure upload path dir
import fsx from 'fs-extra'
import Path from 'path'

const publicDir = Path.join(__dirname, '../public')
fsx.ensureDirSync(publicDir)

async function main () {
  const server = new GraphQLServer({
    typeDefs,
    resolvers
  })

  let options = {
    endpoint: '/graphql',
    uploads: {
      maxFieldSize: 1000,
      maxFileSize: 10000000,
      maxFiles: 1
    },
    cors: {
      origin: true
    }
  }

  server.express.use('/file-upload', upload())

  server.start(options, opts => {
    console.log(`Server is running on http://localhost:${opts.port}`)
  })
}

main()
