import processFile from './queries/process-file'
import cableMutations from './mutations/cables'

export default {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    ...processFile
  },
  Mutation: {
    ...cableMutations
  }
}
