import uuid from 'uuid/v4'
import { knexInstance } from '../src/db'

let cables = [
  { id: uuid(), general_state: 'ruim', name: 'Cabo teste', size: 5000, diameter: 5, lifespan: 10000 }
]

let reports = [
  { id: uuid(), start: new Date(), alert_level: 'low', cable_id: cables[0].id }
]

const SEEDS = {
  cables,
  reports
}

async function seed () {
  console.log(SEEDS)
  try {
    for (let s in SEEDS) {
      await knexInstance(s).delete()
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
