import db from '../config/database';

export interface Book {
    id: number;
    name: string;
    score?: number;
}

class BookModel {
    async findAll(): Promise<Book[]> {
        return db('books')
            .select('id', 'name')
            .orderBy('name');
    }

    async findById(id: number): Promise<Book | undefined> {
        return db('books')
            .where({ id })
            .first('id', 'name');
    }

    async create(name: string): Promise<void> {
        await db('books').insert({ name });
    }

    async getAverageScore(bookId: number): Promise<number> {
        const result = await db('borrowings')
            .where('book_id', bookId)
            .whereNotNull('score')
            .avg('score as average')
            .first();

        return result?.average !== undefined && result.average !== null
            ? Number(result.average.toFixed(2))
            : -1;
    }
}

export default new BookModel();