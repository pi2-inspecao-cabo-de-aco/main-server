import { knexInstance } from '../db'
import uuid from 'uuid/v4'

let state = {
  pubsub: null,
  currentCable: null,
  currentReport: null
}

async function setCable (cable) {
  state.currentCable = cable
}

async function setReport (report) {
  state.currentReport = report
}

async function setPubSub (pubsub) {
  state.pubsub = pubsub
}

async function createAnalysis ({ positionStart, positionEnd, reportId, cableId }) {
  if (!reportId) {
    reportId = '22947bb2-261a-4ab4-8e11-1dca8ef73fca' || state.currentReport.id
  }
  if (!cableId) {
    cableId = '883655fa-7d0a-4560-84f5-44e7109b2f7b' || state.currentCable.id
  }
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
    state.pubsub.publish('analysisWasCreated', { analysisWasCreated: { id: '22947bb2-261a-4ab4-8e11-1dca8ef73fca' } })
    return analysisId[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

export {
  state,
  setCable,
  setReport,
  setPubSub,
  createAnalysis
}
