import db from '../config/database';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../utils/logger'

export class BorrowingService {
    async borrowBook(userId: number, bookId: number): Promise<void> {
        logger.info('Attempting to borrow book', { userId, bookId })
        
        await db.transaction(async (trx) => {
            const existingBorrowing = await trx('borrowings')
                .where('book_id', bookId)
                .whereNull('return_date')
                .first()

            if (existingBorrowing) {
                logger.warn('Book already borrowed', { bookId, existingBorrowing })
                throw new ApiError(400, 'Book is already borrowed')
            }

            await trx('borrowings').insert({
                user_id: userId,
                book_id: bookId,
                borrow_date: new Date()
            })
            
            logger.info('Book borrowed successfully', { userId, bookId })
        })
    }

    async returnBook(userId: number, bookId: number, score: number): Promise<void> {
        logger.info('Attempting to return book', { userId, bookId, score })
        
        const borrowing = await db('borrowings')
            .where({
                user_id: userId,
                book_id: bookId,
            })
            .whereNull('return_date')
            .first()

        if (!borrowing) {
            logger.warn('No active borrowing found', { userId, bookId })
            throw new ApiError(400, 'No active borrowing found for this book')
        }

        await db('borrowings')
            .where('id', borrowing.id)
            .update({
                return_date: new Date(),
                score
            })
            
        logger.info('Book returned successfully', { userId, bookId, score })
    }
}