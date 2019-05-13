const ALLOWED_ENVS = {
  development: 'development',
  dev: 'development',
  testing: 'testing',
  test: 'testing',
  prod: 'production',
  production: 'production',
  staging: 'staging'
}

const NODE_ENV = ALLOWED_ENVS[process.env.NODE_ENV] || 'development'
const trueValues = ['true', 'yes', 'y']
const defaultTrueValues = [ undefined, '' ].concat(trueValues)

let config = {
  // Node environment
  env: NODE_ENV,
  // FTP config
  myIp: process.env.MY_IP || 'localhost',
  retries: process.env.CONNECTIONS_RETRIES || 5,
  // Session Token
  secret: process.env.SECRET || 'secret',
  // Logger
  logify: NODE_ENV === 'production' || NODE_ENV === 'testing'
    ? trueValues.indexOf(process.env.LOGIFY) !== -1
    : defaultTrueValues.indexOf(process.env.LOGIFY) !== -1,
  // Knex and Postgres
  knex: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || process.env.PG_PASS || 'postgres',
      database: process.env.PG_DATABASE || `main-server_${NODE_ENV}`
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
