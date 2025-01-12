import db from '../config/database';
import { ApiError } from '@/middlewares/error.middleware';

export class BorrowingService {
    async borrowBook(userId: number, bookId: number): Promise<void> {
        await db.transaction(async (trx) => {
            // Check if book is already borrowed
            const existingBorrowing = await trx('borrowings')
                .where('book_id', bookId)
                .whereNull('return_date')
                .first();

            if (existingBorrowing) {
                throw new ApiError(400, 'Book is already borrowed');
            }

            await trx('borrowings').insert({
                user_id: userId,
                book_id: bookId,
                borrow_date: new Date()
            });
        });
    }

    async returnBook(userId: number, bookId: number, score: number): Promise<void> {
        const borrowing = await db('borrowings')
            .where({
                user_id: userId,
                book_id: bookId,
            })
            .whereNull('return_date')
            .first();

        if (!borrowing) {
            throw new ApiError(400, 'No active borrowing found for this book');
        }

        await db('borrowings')
            .where('id', borrowing.id)
            .update({
                return_date: new Date(),
                score
            });
    }
}