import test from 'ava'
import { server } from '../config'
import { knexInstance } from '../../src/db'
import uuid from 'uuid/v4'
import { PubSub } from 'graphql-yoga'
import { setPubSub, setCable, setReport } from '../../src/helpers/analysis'

const REPORT_ANALYSIS = `
  query reportAnalysis (
    $reportId: ID!
  ) {
    reportAnalysis (
      reportId: $reportId
    ) {
      id
    }
  }
`

const INSERT_ANALYSIS = `
  mutation createAnalysis (
    $cableId: ID
    $reportId: ID
    $positionStart: Int
    $positionEnd: Int
    $imagePath: String
  ) {
    createAnalysis (
      cableId: $cableId
      reportId: $reportId
      positionStart: $positionStart
      positionEnd: $positionEnd
      imagePath: $imagePath
    )
  }
`

const UPDATE_ANALYSIS = `
  mutation updateAnalysis (
    $id: ID!
    $imagePath: String
    $state: String
  ) {
    updateAnalysis (
      id: $id
      imagePath: $imagePath
      state: $state
    ) {
      id
      image_path
    }
  }
`

const DELETE_ANALYSIS = `
  mutation deleteAnalysis (
    $id: ID!
  ) {
    deleteAnalysis (
      id: $id
    )
  }
`

let cable
let report

test.before(async t => {
  cable = (await knexInstance('cables').insert({
    id: uuid(),
    name: 'Cabo de teste',
    size: 10,
    diameter: 1,
    lifespan: 1
  })
  .returning('*'))[0]
  report = (await knexInstance('reports').insert({
    id: uuid(),
    start: new Date(),
    cable_id: cable.id
  })
  .returning('*'))[0]

  const pubsub = new PubSub()
  setPubSub(pubsub)
})

// Queries Tests
test('query --- Should return analysis based on report_id', async t => {
  let analysisObjs = [
    {
      id: uuid(),
      position_start: 0,
      position_end: 500,
      report_id: report.id,
      cable_id: cable.id
    },
    {
      id: uuid(),
      position_start: 0,
      position_end: 500,
      report_id: report.id,
      cable_id: cable.id
    },
    {
      id: uuid(),
      position_start: 0,
      position_end: 500,
      report_id: report.id,
      cable_id: cable.id
    }
  ]
  await knexInstance('analysis').insert(analysisObjs)
  let res = await server(REPORT_ANALYSIS, { reportId: report.id })
  t.truthy(res.length >= 3)
})

test('query --- Should throw an error trying to get analysis from non UUID reportId param', async t => {
  let error = await t.throwsAsync(async () => {
    await server(REPORT_ANALYSIS, { reportId: 'wrongId' })
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})


// Mutations Tests
test.serial('mutation --- Should create a analysis', async t => {
  let variables = {
    reportId: report.id,
    cableId: cable.id,
    positionStart: 0,
    positionEnd: 500
  }
  let res = await server(INSERT_ANALYSIS, variables)
  let analysis = await knexInstance('analysis').where({ id: res }).first()

  t.is(res, analysis.id)
})

test.serial('mutation --- Should create a analysis using state cable id', async t => {
  setCable(cable)
  setReport(report)
  let variables = {
    positionStart: 0,
    positionEnd: 500
  }
  let res = await server(INSERT_ANALYSIS, variables)
  let analysis = await knexInstance('analysis').where({ id: res }).first()

  t.is(res, analysis.id)
})

test.serial('mutation --- Should create a analysis passing image_path param', async t => {
  let variables = {
    reportId: report.id,
    cableId: cable.id,
    positionStart: 0,
    positionEnd: 500,
    imagePath: '/server/echa/teste.png'
  }
  let res = await server(INSERT_ANALYSIS, variables)
  let analysis = await knexInstance('analysis').where({ id: res }).first()

  t.is(res, analysis.id)
})

test.serial('mutation --- Should update a analysis', async t => {
  let analysis = await knexInstance('analysis').first()
  let path = analysis.image_path
  let variables = {
    id: analysis.id,
    imagePath: '/dev/null'
  }

  t.is(path, null)
  let res = await server(UPDATE_ANALYSIS, variables)
  t.is(res.image_path, '/dev/null')
})


test.serial('mutation --- Should delete a analysis', async t => {
  let analysis = await knexInstance('analysis').first()
  let variables = {
    id: analysis.id,
  }

  let res = await server(DELETE_ANALYSIS, variables)
  t.is(true, res)
})

test.serial('mutation --- Should not delete a analysis with wrong ID', async t => {
  let variables = {
    id: uuid(),
  }

  let res = await server(DELETE_ANALYSIS, variables)
  t.is(false, res)
})

test.serial('mutation --- Should throw an error trying to delete a analysis using no UUID value', async t => {
  let variables = {
    id: 'wrongId',
  }

  let error = await t.throwsAsync(async () => {
    await server(DELETE_ANALYSIS, variables) 
  }, Error)
  t.truthy(error.message.match('invalid input syntax'))
})
