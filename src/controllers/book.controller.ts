import { Request, Response } from 'express';
import { NotFoundError } from '@/middlewares/error.middleware';
import BookModel from '../models/book.model';
import { asyncHandler } from '@/utils/async-handler';

export const getBooks = asyncHandler(async (_req: Request, res: Response) => {
    const books = await BookModel.findAll();
    res.json(books);
});

export const getBook = asyncHandler(async (req: Request, res: Response) => {
    const book = await BookModel.findById(Number(req.params.id));
    if (!book) {
        throw new NotFoundError('Book not found');
    }

    const score = await BookModel.getAverageScore(book.id);
    res.json({
        ...book,
        score
    });
});

export const createBook = asyncHandler(async (req: Request, res: Response) => {
    await BookModel.create(req.body.name);
    res.status(201).send();
});