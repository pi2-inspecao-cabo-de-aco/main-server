import { knexInstance } from '../db'
import uuid from 'uuid/v4'

export default {
  createCable: async (root, { name, size, diameter, lifespan }, context, info) => {
    try {
      let cableId = await knexInstance('cables')
        .returning('id')
        .insert({
          id: uuid(),
          name: name,
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

      let newInfos = {
        general_state: generalState,
        updated_at: new Date()
      }

      if (lifespan !== null) {
        newInfos.lifespan = lifespan
      }

      cable = await cable
        .update(newInfos)
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
