import processFile from './queries/process-file'
import cableQueries from './queries/cables'
import cableMutations from './mutations/cables'

export default {
  Query: {
    ...processFile,
    ...cableQueries
  },
  Mutation: {
    ...cableMutations
  }
}
