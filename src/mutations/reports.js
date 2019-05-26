import { knexInstance } from '../db'
import uuid from 'uuid/v4'

export default {
  createReport: async (root, { cableId }, context, info) => {
    try {
      let reportId = await knexInstance('reports')
        .returning('id')
        .insert({
          id: uuid(),
          start: new Date(),
          cable_id: cableId
        })

      return reportId[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  updateReport: async (root, { id, alertLevel }, context, info) => {
    try {
      let report = knexInstance('reports')
        .where({ id })

      report = await report
        .update({
          end: new Date(),
          alert_level: alertLevel,
          updated_at: new Date()
        })
        .returning('*')

      return report[0]
    } catch (err) {
      throw new Error(err.message)
    }
  },
  deleteReport: async (root, { id }, context, info) => {
    try {
      let count = await knexInstance('reports')
        .where({ id })
        .del()

      return count > 0
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
