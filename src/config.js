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
  // Session Token
  secret: process.env.SECRET || 'secret',
  expireTime: process.env.TOKEN_EXPIRATION_TIME || '30 days',
  // Logger
  logify: NODE_ENV === 'production' || NODE_ENV === 'testing'
    ? trueValues.indexOf(process.env.LOGIFY) !== -1
    : defaultTrueValues.indexOf(process.env.LOGIFY) !== -1,
  gitlab: {
    projectId: process.env.GITLAB_REPORT_PROJECT_ID || '10362863',
    privateToken: process.env.GITLAB_PRIVATE_TOKEN
  },
  // Knex and Postgres
  knex: {
    client: 'postgresql',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || process.env.PG_PASS || 'postgres',
      database: process.env.PG_DATABASE || `legal-pro_${NODE_ENV}`
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}

module.exports = config
