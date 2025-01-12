import {Request, Response} from 'express';
import {NotFoundError} from '../middlewares/error.middleware';
import BookModel from '../models/book.model';
import {asyncHandler} from '../utils/async-handler';
import logger from '../utils/logger';

export const getBooks = asyncHandler(async (_req: Request, res: Response) => {
    logger.info('GET /books request received');
    const books = await BookModel.findAll();
    logger.debug('Sending books response', { count: books.length });
    res.json(books.map(book => ({
        id: book.id,
        name: book.name
    })));
});

export const getBook = asyncHandler(async (req: Request, res: Response) => {
    const bookId = Number(req.params.id);
    logger.info('GET /books/:id request received', {bookId});

    const book = await BookModel.findById(bookId);
    if (!book) {
        logger.warn('Book not found', {bookId});
        throw new NotFoundError('Book not found');
    }

    const score = await BookModel.getAverageScore(book.id);
    logger.debug('Sending book response', {bookId, score});
    res.json({
        id: book.id,
        name: book.name,
        score: score === -1 ? -1 : Number(score.toFixed(2))
    });
});

export const createBook = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    logger.info('POST /books request received', { name });
    await BookModel.create(name);
    logger.info('Book created successfully', { name });
    res.status(201).send();
});