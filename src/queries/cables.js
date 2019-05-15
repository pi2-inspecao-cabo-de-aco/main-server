import { knexInstance } from '../db'

export default {
  cable: async (root, { id }, context, info) => {
    try {
      let cable = await knexInstance('cables')
        .where({ id })

      return cable[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  cables: async (root, args, context, info) => {
    try {
      let cables = await knexInstance('cables')

      return cables
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
