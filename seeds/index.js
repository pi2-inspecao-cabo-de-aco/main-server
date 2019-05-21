import uuid from 'uuid/v4'
import { knexInstance } from '../src/db'

let reports = [
  { id: uuid(), start: new Date(), alert_level: 'low' }
]

let cables = [
  { id: uuid(), general_state: 'ruim', name: 'Cabo teste', size: 5, diameter: 1, lifespan: 10000 }
]

const SEEDS = {
  reports,
  cables
}

async function seed () {
  console.log(SEEDS)
  try {
    for (let s in SEEDS) {
      await knexInstance(s).insert(SEEDS[s])
    }
  } catch (err) {
    console.log(err)
  }
}

seed().then(() => {
  console.log('Done seed.')
  process.exit()
}).catch(process.exit)
