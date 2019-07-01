import { GraphQLDateTime } from 'graphql-iso-date'
import cableQueries from './queries/cables'
import cableMutations from './mutations/cables'
import reportQueries from './queries/reports'
import commandQueries from './queries/commands'
import reportMutations from './mutations/reports'
import analysisQueries from './queries/analysis'
import analysisMutations from './mutations/analysis'
import analysisSubscriptions from './subscriptions/analysis'

export default {
  DateTime: GraphQLDateTime,
  Query: {
    ...cableQueries,
    ...reportQueries,
    ...analysisQueries,
    ...commandQueries
  },
  Mutation: {
    ...cableMutations,
    ...reportMutations,
    ...analysisMutations
  },
  Subscription: {
    ...analysisSubscriptions
  }
}
