function up (knex)  {
  return knex.schema.createTable('analysis', (table) => {
    table.uuid('id').primary()
    table.integer('position_start')
    table.integer('position_end')
    table.string('image_path')
    table.string('state')
    table.uuid('report_id').references('id').inTable('reports').onDelete('CASCADE')
    table.uuid('cable_id').references('id').inTable('cables').onDelete('CASCADE')
    table.timestamps(false, true)
  })
}

function down (knex) {
  return knex.schema.dropTable('analysis')
}

export {
  up,
  down
}