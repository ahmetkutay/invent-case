import { Request, Response } from 'express';
import { NotFoundError } from '@/middlewares/error.middleware';
import UserModel from '../models/user.model';
import {BorrowingService} from '@/services/borrowing.service';
import { asyncHandler } from '@/utils/async-handler';

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await UserModel.findAll();
    res.json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(Number(req.params.id));
    if (!user) {
        throw new NotFoundError('User not found');
    }

    const books = await UserModel.getUserBooks(user.id);
    res.json({
        ...user,
        books
    });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    await UserModel.create(req.body.name);
    res.status(201).send();
});

export const borrowBook = asyncHandler(async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    const borrowingService = new BorrowingService();
    await borrowingService.borrowBook(Number(userId), Number(bookId));
    res.status(204).send();
});

export const returnBook = asyncHandler(async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    const { score } = req.body;
    const borrowingService = new BorrowingService();
    await borrowingService.returnBook(Number(userId), Number(bookId), score);
    res.status(204).send();
});