import test from 'ava'
import { server } from '../config'
import { knexInstance } from '../../src/db'
import { GraphQLError } from 'graphql'
import uuid from 'uuid/v4'

const GET_CABLE = `
  query cable (
    $id: ID!
  ) {
    cable (
      id: $id
    ) {
      id
      name
    }
  }
`
const GET_CABLES = `
  query cables {
    cables {
      id
      name
    }
  }
`

const INSERT_CABLE = `
  mutation createCable (
    $name: String
    $size: Int!
    $diameter: Int!
    $lifespan: Int!
  ) {
    createCable (
      name: $name
      size: $size
      diameter: $diameter
      lifespan: $lifespan
    )
  }
`

const UPDATE_CABLE = `
  mutation updateCable(
    $id: ID!
    $lifespan: Int
    $generalState: String
  ) {
    updateCable(
      id: $id
      lifespan: $lifespan
      generalState: $generalState
    ) {
      id
      general_state
    }
  }
`

const DELETE_CABLE = `
  mutation deleteCable (
    $id: ID!
  ) {
    deleteCable (
      id: $id
    )
  }
`

// Queries test
test('query --- Shoud get cable based on id', async t => {
  let id = uuid()
  let cable = (await knexInstance('cables').insert({
    id,
    name: 'Cabo de teste',
    size: 10,
    diameter: 1,
    lifespan: 1
  })
  .returning('*'))[0]
  let res = await server(GET_CABLE, { id })
  t.is(cable.id, res.id)
})

test('query --- Should throw an error trying to get cable from non UUID param', async t => {
  let error = await t.throwsAsync(async () => {
    await server(GET_CABLE, { id: 'wrongId' })
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})

test('query --- Shoud get all cables', async t => {
  let cables = [
    {
      id: uuid(),
      name: 'Cabo de teste0',
      size: 10,
      diameter: 1,
      lifespan: 1
    },
    {
      id: uuid(),
      name: 'Cabo de teste1',
      size: 10,
      diameter: 1,
      lifespan: 1
    },
    {
      id: uuid(),
      name: 'Cabo de teste2',
      size: 10,
      diameter: 1,
      lifespan: 1
    }
  ]
  await knexInstance('cables').insert(cables)
  let res = await server(GET_CABLES)
  t.truthy(res.length >= 3)
})

// Mutations test
test.serial('mutation --- Should not create a cable with missing arguments', async t => {
  let variables0 = {
    name: 'Cabo de teste',
    size: 10,
    diameter: 1
    // lifespan: 1
  }
  let variables1 = {
    name: 'Cabo de teste',
    // size: 10,
    diameter: 1,
    lifespan: 1
  }
  let variables2 = {
    name: 'Cabo de teste',
    size: 10,
    // diameter: 1,
    lifespan: 1
  }

  let buildMessage = (key) => {
    return `Variable "$${key}" of required type "Int!" was not provided.`
  }

  // for lifespan
  let error = await t.throwsAsync(async () => {
    await server(INSERT_CABLE, variables0)
  }, GraphQLError)
  let message = buildMessage('lifespan')
  t.is(error.message, message)

  // for size
  error = await t.throwsAsync(async () => {
    await server(INSERT_CABLE, variables1)
  }, GraphQLError)
  message = buildMessage('size')
  t.is(error.message, message)

  // for diameter
  error = await t.throwsAsync(async () => {
    await server(INSERT_CABLE, variables2)
  }, GraphQLError)
  message = buildMessage('diameter')
  t.is(error.message, message)
})

test.serial('mutation --- Should create a cable', async t => {
  let variables = {
    name: 'Cabo de teste',
    size: 10,
    diameter: 1,
    lifespan: 1
  }
  let res = await server(INSERT_CABLE, variables)
  let cable = await knexInstance('cables').where({ id: res }).first()

  t.is(res, cable.id)
})

test.serial('mutation --- Should update a cable', async t => {
  let cable = await knexInstance('cables').first()
  let cableState = cable.general_state
  let variables = {
    id: cable.id,
    generalState: 'Boa qualidade'
  }

  t.is(cableState, null)
  let res = await server(UPDATE_CABLE, variables)
  t.is(res.general_state, 'Boa qualidade')
})

test.serial('mutation --- Should throw an error trying to update a cable', async t => {
  let variables = {
    id: '-1',
    generalState: 'Má qualidade'
  }
  await t.throwsAsync(async t => {
    await server(UPDATE_CABLE, variables)
  })
})

test.serial('mutation --- Should delete a cable', async t => {
  let cable = await knexInstance('cables').first()
  let variables = {
    id: cable.id,
  }

  let res = await server(DELETE_CABLE, variables)
  t.is(true, res)
})

test.serial('mutation --- Should throw an error trying to delete a cable with no UUID param', async t => {
  let variables = {
    id: 'wrongId',
  }


  let error = await t.throwsAsync(async () => {
    await server(DELETE_CABLE, variables)
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})
