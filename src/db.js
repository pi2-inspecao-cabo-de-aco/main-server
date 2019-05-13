import knex from 'knex'
import config from './config'
let knexInstance = knex(config.knex)

export {
  knexInstance
}
