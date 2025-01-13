import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Check if tables exist before creating them
  const hasUsers = await knex.schema.hasTable('users')
  const hasBooks = await knex.schema.hasTable('books')
  const hasBorrowings = await knex.schema.hasTable('borrowings')

  if (!hasUsers) {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.timestamps(true, true)
    })
  }

  if (!hasBooks) {
    await knex.schema.createTable('books', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.timestamps(true, true)
    })
  }

  if (!hasBorrowings) {
    await knex.schema.createTable('borrowings', (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.integer('book_id').references('id').inTable('books').onDelete('CASCADE')
      table.timestamp('borrow_date').notNullable().defaultTo(knex.fn.now())
      table.timestamp('return_date')
      table.integer('score').checkBetween([0, 10])
      table.timestamps(true, true)
    })
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('borrowings')
  await knex.schema.dropTableIfExists('books')
  await knex.schema.dropTableIfExists('users')
} 