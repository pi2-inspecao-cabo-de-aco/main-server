function up (knex)  {
  return knex.schema.createTable('cables', (table) => {
    table.uuid('id').primary()
    table.string('general_state')
    table.string('name')
    table.integer('size') // Milimeters
    table.integer('diameter') // Milimeters
    table.integer('lifespan') // Days
    table.timestamps(false, true)
  })
}

function down (knex) {
  return knex.schema.dropTable('cables')
}

export {
  up,
  down
}