function up (knex)  {
  return knex.schema.alterTable('reports', (table) => {
    table.uuid('cable_id').references('id').inTable('cables').onDelete('CASCADE')
  })
}

function down (knex) {
  return knex.schema.alterTable('analysis', t => {
    t.dropColumn('cable_id')
  })
}

export {
  up,
  down
}
