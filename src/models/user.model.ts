import db from '../config/database';
import logger from '../utils/logger';

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
        logger.info('Fetching all users from model');
        const users = await db('users')
            .select('id', 'name')
            .orderBy('name');
        logger.debug('Retrieved users from model', { count: users.length });
        return users;
    }

    async findById(id: number): Promise<User | undefined> {
        logger.info('Fetching user by id from model', { userId: id });
        const user = await db('users')
            .where({ id })
            .first('id', 'name');
        logger.debug('Retrieved user from model', { user });
        return user;
    }

    async create(name: string): Promise<void> {
        logger.info('Creating new user in model', { name });
        await db('users').insert({ name });
        logger.info('User created successfully in model', { name });
    }

    async getUserBooks(userId: number): Promise<UserBooks> {
        logger.info('Fetching user books from model', { userId });
        
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

        logger.debug('Retrieved user books from model', { 
            userId,
            pastBooksCount: pastBooks.length,
            presentBooksCount: presentBooks.length 
        });

        return {
            past: pastBooks,
            present: presentBooks
        };
    }
}

export default new UserModel();