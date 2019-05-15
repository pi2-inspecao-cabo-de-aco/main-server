import { knexInstance } from '../db'
import uuid from 'uuid/v4'

export default {
  createAnalysis: async (root, { positionStart, positionEnd, reportId, cableId }, context, info) => {
    try {
      let analysisId = await knexInstance('analysis')
        .returning('id')
        .insert({
          id: uuid(),
          position_start: positionStart,
          position_end: positionEnd,
          report_id: reportId,
          cable_id: cableId
        })

      return analysisId[0]
    } catch (err) {
      throw new Error(err.message)
    }
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
