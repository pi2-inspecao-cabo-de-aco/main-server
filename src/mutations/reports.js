import { knexInstance } from '../db'
import { setReport, setCable } from '../helpers/analysis'

import uuid from 'uuid/v4'

export default {
  createReport: async (root, { cableId }, context, info) => {
    try {
      let cable = await knexInstance('cables')
        .returning('*')
        .where({ id: cableId })

      setCable(cable[0])

      let report = await knexInstance('reports')
        .returning('*')
        .insert({
          id: uuid(),
          start: new Date(),
          cable_id: cableId
        })

      setReport(report[0])

      return report[0].id
    } catch (err) {
      throw new Error(err.message)
    }
  },
  updateReport: async (root, { id, alertLevel }, context, info) => {
    try {
      let report = knexInstance('reports')
        .where({ id })

      let newValues = {
        end: new Date(),
        updated_at: new Date()
      }

      if (alertLevel) {
        newValues.alert_level = alertLevel
      }

      report = await report
        .update(newValues)
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
