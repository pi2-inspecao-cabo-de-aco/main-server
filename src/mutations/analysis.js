import { knexInstance } from '../db'
import { createAnalysis as createHelper } from '../helpers/analysis'

export default {
  createAnalysis: async (root, { positionStart, positionEnd, reportId, cableId }, context, info) => {
    return createHelper({ positionStart, positionEnd, reportId, cableId })
  },
  updateAnalysis: async (root, { id, imagePath, state }, context, info) => {
    try {
      let analysis = knexInstance('analysis')
        .where({ id })

      analysis = await analysis
        .update({
          image_path: imagePath,
          state: state,
          updated_at: new Date()
        })
        .returning('*')

      return analysis[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  deleteAnalysis: async (root, { id }, context, info) => {
    try {
      let count = await knexInstance('analysis')
        .where({ id })
        .del()

      return count > 0
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
