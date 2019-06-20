import { state } from '../helpers/state'

export default {
  analysisWasCreated: {
    subscribe: (parent, args) => {
      return state.pubsub.asyncIterator('analysisWasCreated')
    }
  },
  endCable: {
    subscribe: (parent, args) => {
      return state.pubsub.asyncIterator('endCable')
    }
  }
}
