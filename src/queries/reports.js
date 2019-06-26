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
  reports: async (root, { cableId }, context, info) => {
    try {
      let reports = await knexInstance('reports')
        .where({ cable_id: cableId })
        .orderBy('created_at', 'desc')

      return reports
    } catch (err) {
      throw new Error(err.message)
    }
  },
  reportComplete: async (root, { id }, context, info) => {
    try {
      let reportComplete = await knexInstance('reports')
        .select('reports.*')
        .select(knexInstance.raw('json_agg(analysis.*) as analysis'))
        .leftJoin('analysis', 'analysis.report_id', 'reports.id')
        .where('reports.id', id)
        .groupBy('reports.id')
        .first()

      console.log(reportComplete)
      return reportComplete
    } catch (err) {
      throw new Error(err.message)
    }
  },
  reportErrors: async (root, { id }, context, info) => {
    try {
      let normal = await knexInstance('analysis')
        .where('report_id', id)
        .where('state', 'Normal')
        .count()
      let dan = await knexInstance('analysis')
        .where('report_id', id)
        .where('state', 'Danificado')
        .count()
      let muitoDan = await knexInstance('analysis')
        .where('report_id', id)
        .where('state', 'Muito danificado')
        .count()
      let result = {
        normal: parseInt(normal[0].count),
        danificado: parseInt(dan[0].count),
        muitoDanificado: parseInt(muitoDan[0].count)
      }
      // console.log(muitoDan)
      // console.log(normal)
      return result
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
