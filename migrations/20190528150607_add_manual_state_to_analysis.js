function up (knex)  {
  return knex.schema.alterTable('analysis', (table) => {
    table.string('manual_state')
  })
}

function down (knex) {
  return knex.schema.alterTable('analysis', t => {
    t.dropColumn('manual_state')
  })
}

export {
  up,
  down
}