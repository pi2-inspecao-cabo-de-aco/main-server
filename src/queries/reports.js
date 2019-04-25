import { knexInstance } from '../db'

export default {
  report: async (root, { id }, context, info) => {
    try {
      let report = await knexInstance('reports')
        .where({ id })

      return report[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  reports: async (root, args, context, info) => {
    try {
      let reports = await knexInstance('reports')
        .orderBy('created_at', 'desc')

      return reports
    } catch (err) {
      throw new Error(err.message)
    }
  }
}