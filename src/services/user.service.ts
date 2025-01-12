import db from '../config/database';
import { ApiError } from '../middlewares/error.middleware';
import { User, UserWithBooks } from '../types';
import logger from '../utils/logger';

export class UserService {
    async getAllUsers(): Promise<User[]> {
        logger.info('Fetching all users');
        const users = await db('users')
            .select('id', 'name')
            .orderBy('name');
        logger.debug('Retrieved users', { count: users.length });
        return users;
    }

    async getUserById(id: number): Promise<UserWithBooks> {
        logger.info('Fetching user by id', { userId: id });
        const user = await db('users')
            .where('id', id)
            .first('id', 'name');

        if (!user) {
            logger.warn('User not found', { userId: id });
            throw new ApiError(404, 'User not found');
        }

        logger.debug('Fetching user books', { userId: id });
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

        logger.debug('Retrieved user with books', { 
            userId: id, 
            pastBooksCount: pastBooks.length,
            presentBooksCount: presentBooks.length 
        });
        
        return {
            ...user,
            books: {
                past: pastBooks,
                present: presentBooks
            }
        };
    }

    async createUser(name: string): Promise<void> {
        logger.info('Creating new user', { name });
        await db('users').insert({ name });
        logger.info('User created successfully', { name });
    }
}