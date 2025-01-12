import db from '../config/database';
import { ApiError } from '@/middlewares/error.middleware';
import { Book, BookWithScore } from '@/types';

export class BookService {
    async getAllBooks(): Promise<Book[]> {
        return db('books')
            .select('id', 'name')
            .orderBy('name');
    }

    async getBookById(id: number): Promise<BookWithScore> {
        const book = await db('books')
            .where('id', id)
            .first('id', 'name');

        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        const scoreResult = (await db('borrowings')
            .where('book_id', id)
            .whereNotNull('score')
            .avg('score as average')
            .first()) || { average: null };

        return {
            ...book,
            score: scoreResult.average !== null ? Number(scoreResult.average.toFixed(2)) : -1
        };
    }

    async createBook(name: string): Promise<void> {
        await db('books').insert({ name });
    }
}