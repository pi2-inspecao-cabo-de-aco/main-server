import { knexInstance } from '../db'

export default {
  reportAnalysis: async (root, { reportId }, context, info) => {
    try {
      let analysis = await knexInstance('analysis')
        .where({ report_id: reportId })

      return analysis
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
