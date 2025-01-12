import db from '../config/database';
import { ApiError } from '@/middlewares/error.middleware';
import { User, UserWithBooks } from '@/types';

export class UserService {
    async getAllUsers(): Promise<User[]> {
        return db('users')
            .select('id', 'name')
            .orderBy('name');
    }

    async getUserById(id: number): Promise<UserWithBooks> {
        const user = await db('users')
            .where('id', id)
            .first('id', 'name');

        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        const pastBooks = await db('borrowings')
            .join('books', 'books.id', 'borrowings.book_id')
            .where('borrowings.user_id', id)
            .whereNotNull('return_date')
            .select('books.name', 'borrowings.score as userScore');

        const presentBooks = await db('borrowings')
            .join('books', 'books.id', 'borrowings.book_id')
            .where('borrowings.user_id', id)
            .whereNull('return_date')
            .select('books.name');

        return {
            ...user,
            books: {
                past: pastBooks,
                present: presentBooks
            }
        };
    }

    async createUser(name: string): Promise<void> {
        await db('users').insert({ name });
    }
}