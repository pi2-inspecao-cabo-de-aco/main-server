function up (knex)  {
  return knex.schema.alterTable('analysis', (table) => {
    table.string('neural_net_state')
  })
}

function down (knex) {
  return knex.schema.alterTable('analysis', t => {
    t.dropColumn('neural_net_state')
  })
}

export {
  up,
  down
}