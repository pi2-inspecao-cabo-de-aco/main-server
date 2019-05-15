import processFile from './queries/process-file'
import cableQueries from './queries/cables'
import cableMutations from './mutations/cables'
import reportQueries from './queries/reports'
import reportMutations from './mutations/reports'
import analysisQueries from './queries/analysis'
import analysisMutations from './mutations/analysis'

export default {
  Query: {
    ...processFile,
    ...cableQueries,
    ...reportQueries,
    ...analysisQueries
  },
  Mutation: {
    ...cableMutations,
    ...reportMutations,
    ...analysisMutations
  }
}
