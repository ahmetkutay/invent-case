import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ApiError } from './error.middleware';

export const validateBody = (schema: Schema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body);
        if (error) {
            throw new ApiError(400, error.details[0].message);
        }
        next();
    };
};