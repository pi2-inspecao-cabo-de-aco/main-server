function up (knex)  {
  return knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary()
    table.timestamp('start')
    table.timestamp('end')
    table.string('alert_level')
    table.timestamps(false, true)
  })
}

function down (knex) {
  return knex.schema.dropTable('reports')
}

export {
  up,
  down
}