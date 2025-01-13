import db from '../config/database';
import logger from '../utils/logger';

export interface Book {
    id: number;
    name: string;
    score?: number;
}

class BookModel {
    async findAll(): Promise<Book[]> {
        logger.info('Fetching all books from model');
        const books = await db('books')
            .select('id', 'name')
            .orderBy('name');
        logger.debug('Retrieved books from model', { count: books.length });
        return books;
    }

    async findById(id: number): Promise<Book | undefined> {
        logger.info('Fetching book by id from model', { bookId: id });
        const book = await db('books')
            .where({ id })
            .first('id', 'name');
        logger.debug('Retrieved book from model', { book });
        return book;
    }

    async create(name: string): Promise<void> {
        logger.info('Creating new book in model', { name });
        await db('books').insert({ name });
        logger.info('Book created successfully in model', { name });
    }

    async getAverageScore(bookId: number): Promise<number> {
        logger.info('Calculating average score for book', {bookId});
        const result = await db('borrowings')
            .where('book_id', bookId)
            .whereNotNull('score')
            .avg({average: 'score'})
            .first();
        const averageScore = typeof result?.average === 'string'
            ? Number(Number(result.average).toFixed(2))
            : -1;

        logger.debug('Retrieved average score', {bookId, score: averageScore});
        return averageScore;
    }
}

export default new BookModel();