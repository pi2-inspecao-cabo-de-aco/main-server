import { knexInstance } from '../db'
import uuid from 'uuid/v4'

export default {
  createCable: async (root, { size, diameter, lifespan }, context, info) => {
    try {
      let cableId = await knexInstance('cables')
        .returning('id')
        .insert({
          id: uuid(),
          size: size,
          diameter: diameter,
          lifespan: lifespan
        })

      return cableId[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  updateCable: async (root, { id, lifespan, generalState }, context, info) => {
    try {
      let cable = knexInstance('cables')
        .where({ id })

      cable = await cable
        .update({
          lifespan: lifespan,
          general_state: generalState,
          updated_at: new Date()
        })
        .returning('*')

      return cable[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  deleteCable: async (root, { id }, context, info) => {
    try {
      let count = await knexInstance('cables')
        .where({ id })
        .del()

      return count > 0
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
