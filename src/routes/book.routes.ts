import { Router } from 'express';
import { validateBody } from '../middlewares/validate.middleware';
import { createBookSchema } from '../validators/book.validator';
import {
    getBooks,
    getBook,
    createBook
} from '../controllers/book.controller';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', validateBody(createBookSchema), createBook);

export default router;