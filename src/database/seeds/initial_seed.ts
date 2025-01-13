import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('borrowings').del()
  await knex('books').del()
  await knex('users').del()

  // Insert users
  await knex('users').insert([
    { name: 'Eray Aslan' },
    { name: 'Enes Faruk Meniz' },
    { name: 'Sefa Eren Şahin' },
    { name: 'Kadir Mutlu' },
    { name: 'Mehmet Yılmaz' },
    { name: 'Ayşe Demir' },
    { name: 'Fatma Kaya' },
    { name: 'Ali Öztürk' },
    { name: 'Zeynep Çelik' },
    { name: 'Mustafa Şahin' }
  ])

  // Insert books
  await knex('books').insert([
    { name: 'The Hitchhiker\'s Guide to the Galaxy' },
    { name: 'I, Robot' },
    { name: 'Dune' },
    { name: '1984' },
    { name: 'Brave New World' },
    { name: 'Foundation' },
    { name: 'Neuromancer' },
    { name: 'Snow Crash' },
    { name: 'The War of the Worlds' },
    { name: 'Do Androids Dream of Electric Sheep?' }
  ])

  // Get user IDs for reference
  const users = await knex('users').select('id', 'name')
  const books = await knex('books').select('id', 'name')

  // Insert borrowings
  await knex('borrowings').insert([
    // Past borrowings
    {
      user_id: users[1].id, 
      book_id: books[1].id, 
      borrow_date: '2023-12-01',
      return_date: '2023-12-15',
      score: 5
    },
    {
      user_id: users[1].id, 
      book_id: books[0].id, 
      borrow_date: '2023-12-01',
      return_date: '2023-12-15',
      score: 10
    },
    // Current borrowing
    {
      user_id: users[1].id, 
      book_id: books[4].id, 
      borrow_date: knex.fn.now()
    }
  ])
} 