import { state } from '../helpers/analysis'

export default {
  analysisWasCreated: {
    subscribe: (parent, args) => {
      return state.pubsub.asyncIterator('analysisWasCreated')
    }
  }
}
