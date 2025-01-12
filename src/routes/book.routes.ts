import { Router } from 'express';
import { validateBody } from '@/middlewares/error.middleware';
import { createUserSchema, returnBookSchema } from '@/validators/user.validator';
import {
    getUsers,
    getUser,
    createUser,
    borrowBook,
    returnBook
} from '@/controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validateBody(createUserSchema), createUser);
router.post('/:userId/borrow/:bookId', borrowBook);
router.post('/:userId/return/:bookId', validateBody(returnBookSchema), returnBook);

export default router;