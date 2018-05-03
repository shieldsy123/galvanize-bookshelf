
exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments()
    table.integer('user_id').notNullable().references('users.id').onDelete('CASCADE')
    table.integer('book_id').notNullable().references('books.id').onDelete('CASCADE')
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'))
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'))
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('favorites')
}
