import db from '../config/database';

export interface User {
    id: number;
    name: string;
}

export interface UserBooks {
    past: Array<{ name: string; userScore: number }>;
    present: Array<{ name: string }>;
}

class UserModel {
    async findAll(): Promise<User[]> {
        return db('users')
            .select('id', 'name')
            .orderBy('name');
    }

    async findById(id: number): Promise<User | undefined> {
        return db('users')
            .where({ id })
            .first('id', 'name');
    }

    async create(name: string): Promise<void> {
        await db('users').insert({ name });
    }

    async getUserBooks(userId: number): Promise<UserBooks> {
        const pastBooks = await db('borrowings')
            .join('books', 'books.id', 'borrowings.book_id')
            .where({
                'borrowings.user_id': userId,
            })
            .whereNotNull('return_date')
            .select('books.name', 'borrowings.score as userScore');

        const presentBooks = await db('borrowings')
            .join('books', 'books.id', 'borrowings.book_id')
            .where({
                'borrowings.user_id': userId,
            })
            .whereNull('return_date')
            .select('books.name');

        return {
            past: pastBooks,
            present: presentBooks
        };
    }
}

export default new UserModel();