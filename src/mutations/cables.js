import { knexInstance } from '../db'
import uuid from 'uuid/v4'

export default {
  createCable: async (root, { size, diameter, lifespan }, context, info) => {
    let cableId = await knexInstance('cables')
      .returning('id')
      .insert({
        id: uuid(),
        size: size,
        diameter: diameter,
        lifespan: lifespan
      })

    return cableId
  }
}
