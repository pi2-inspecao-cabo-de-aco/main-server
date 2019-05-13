import processFile from './queries/process-file'
import cableQueries from './queries/cables'
import cableMutations from './mutations/cables'
import reportQueries from './queries/reports'
import reportMutations from './mutations/reports'

export default {
  Query: {
    ...processFile,
    ...cableQueries,
    ...reportQueries
  },
  Mutation: {
    ...cableMutations,
    ...reportMutations
  }
}
