import resolvers from '../src/resolvers'
import typeDefs from '../src/type-defs'
import { graphql } from 'graphql'
import { parse } from 'graphql/language/parser'
import { makeExecutableSchema } from 'graphql-tools'

function buildSchema (mocks = {}) {
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  return { schema }
}

async function server (query, variables, mocks) {
  let operation = parse(query).definitions[0].selectionSet.selections[0].name.value
  let { schema } = buildSchema(mocks)
  let res = await graphql({
    schema,
    source: query,
    rootValue: {},
    variableValues: variables
  })

  if (!res.errors) {
    return res.data[operation]
  } else {
    throw res.errors[0]
  }
}

export {
  server,
  buildSchema
}
