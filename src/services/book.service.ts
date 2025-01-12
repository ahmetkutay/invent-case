import db from '../config/database';
import { ApiError } from '../middlewares/error.middleware';
import { Book, BookWithScore } from '../types';
import logger from '../utils/logger'

export class BookService {
    async getAllBooks(): Promise<Book[]> {
        logger.info('Fetching all books')
        const books = await db('books')
            .select('id', 'name')
            .orderBy('name')
        logger.debug('Retrieved books', { count: books.length })
        return books
    }

    async getBookById(id: number): Promise<BookWithScore> {
        logger.info('Fetching book by id', { bookId: id })
        const book = await db('books')
            .where('id', id)
            .first('id', 'name')

        if (!book) {
            logger.warn('Book not found', { bookId: id })
            throw new ApiError(404, 'Book not found')
        }

        const scoreResult = (await db('borrowings')
            .where('book_id', id)
            .whereNotNull('score')
            .avg('score as average')
            .first()) || { average: null };

        logger.debug('Retrieved book with score', { bookId: id, book })
        return {
            ...book,
            score: scoreResult.average !== null ? Number(scoreResult.average.toFixed(2)) : -1
        };
    }

    async createBook(name: string): Promise<void> {
        await db('books').insert({ name });
    }
}