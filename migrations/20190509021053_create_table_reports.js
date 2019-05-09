function up (knex)  {
  return knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary()
    table.boolean('break')
    table.boolean('corrosion')
    table.boolean('distortion')
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