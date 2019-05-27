import test from 'ava'
import { server } from '../config'
import { knexInstance } from '../../src/db'
import uuid from 'uuid/v4'

const INSERT_REPORT = `
  mutation createReport (
    $cableId: ID!
  ) {
    createReport (
      cableId: $cableId
    )
  }
`

const UPDATE_REPORT = `
  mutation updateReport (
    $id: ID!
    $alertLevel: String
  ) {
    updateReport (
      id: $id
      alertLevel: $alertLevel
    ) {
      id
      alert_level
    }
  }
`

const DELETE_REPORT = `
  mutation deleteReport (
    $id: ID!
  ) {
    deleteReport (
      id: $id
    )
  }
`

let cable

test.before(async t => {
  cable = (await knexInstance('cables').insert({
    id: uuid(),
    name: 'Cabo de teste',
    size: 10,
    diameter: 1,
    lifespan: 1
  })
  .returning('*'))[0]
})

test.serial('Should create a report', async t => {
  let variables = {
    cableId: cable.id
  }
  let res = await server(INSERT_REPORT, variables)
  let report = await knexInstance('reports').where({ id: res }).first()

  t.is(res, report.id)
})

test.serial('Should not create a report with wrong params', async t => {
  let variables = {
    cableId: uuid()
  }

  let error = await t.throwsAsync(async () => {
    await server(INSERT_REPORT, variables)
  }, Error)
  t.truthy(error.message.match('foreign key constraint'))
})

test.serial('Should update a report', async t => {
  let report = await knexInstance('reports').first()
  let alertLevel = report.alert_level
  let variables = {
    id: report.id,
    alertLevel: 'Normal'
  }

  t.is(alertLevel, null)
  let res = await server(UPDATE_REPORT, variables)
  t.is(res.alert_level, 'Normal')
})

test.serial('Should not update a report with wrong values', async t => {
  let variables = {
    id: uuid(),
    alertLevel: 'test'
  }
  let res = await server(UPDATE_REPORT, variables)
  t.is(res, null)
})

test.serial('Should not update a report invalid UUID param', async t => {
  let variables = {
    id: 'wrongId',
    alertLevel: 'test'
  }
  let error = await t.throwsAsync(async () => {
    await server(DELETE_REPORT, variables) 
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})

test.serial('Should delete a report', async t => {
  let report = await knexInstance('reports').first()
  let variables = {
    id: report.id,
  }

  let res = await server(DELETE_REPORT, variables)
  t.is(true, res)
})

test.serial('Should not delete a report with wrong ID', async t => {
  let variables = {
    id: uuid(),
  }

  let res = await server(DELETE_REPORT, variables)
  t.is(false, res)
})

test.serial('Should throw an error trying to delete a report using no UUID value', async t => {
  let variables = {
    id: 'wrongId',
  }

  let error = await t.throwsAsync(async () => {
    await server(DELETE_REPORT, variables) 
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})
