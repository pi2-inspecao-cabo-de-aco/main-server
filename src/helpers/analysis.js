import { knexInstance } from '../db'
import uuid from 'uuid/v4'
import { state } from './state'

async function createAnalysis (analysisObject) {
  let { positionStart, positionEnd, imagePath, cableState } = analysisObject
  let reportId = 'b55de8a6-4449-4abc-94bb-36a0e948bed8' // state.currentReport.id
  let cableId = '9a00448c-0fd0-4e07-92fc-102590077d54' // state.currentCable.id
  try {
    let insertObj = {
      id: uuid(),
      position_start: positionStart,
      position_end: positionEnd,
      report_id: reportId,
      cable_id: cableId,
      state: cableState
    }
    console.log(insertObj)
    let path = analysisObject.image_path || imagePath
    if (path) {
      insertObj.image_path = path
    }
    let analysisId = await knexInstance('analysis')
      .returning('id')
      .insert(insertObj)
    let returnObj = Object.assign(insertObj, { cable: state.currentCable })
    state.pubsub.publish('analysisWasCreated', { analysisWasCreated: returnObj })
    return analysisId[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

export {
  createAnalysis
}
