
exports.up = (knex, Promise) => {
  return knex.schema.createTable('books', (table) => {
    table.increments()
    table.varchar('title', 255).notNullable().defaultTo('')
    table.varchar('author', 255).notNullable().defaultTo('')
    table.varchar('genre', 255).notNullable().defaultTo('')
    table.text('description').notNullable().defaultTo('')
    table.text('cover_url').notNullable().defaultTo('')
    table.timestamp('created_at').defaultTo(knex.raw('now()')).notNullable()
    table.timestamp('updated_at').defaultTo(knex.raw('now()')).notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTableIfExists('books')
}
