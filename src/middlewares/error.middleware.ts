import e, { Request, Response, NextFunction } from 'express';
import {Schema} from "joi";
import logger from '../utils/logger'

export class ApiError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string) {
        super(404, message);
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string) {
        super(401, message);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string) {
        super(403, message);
    }
}

const handleValidationErrorDB = (err: any) => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ApiError(400, message);
};

const handleDuplicateFieldsDB = (err: any) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new ApiError(400, message);
};

export const errorHandler: (err: any, req: e.Request, res: e.Response, next: e.NextFunction) => (e.Response<any, Record<string, any>>) = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    if (err.isOperational) {
        // Operational, trusted error: send message to client
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }

    if (err.code === '23505') { // unique violation
        const duplicateError = handleDuplicateFieldsDB(err);
        return res.status(duplicateError.statusCode).json({
            status: duplicateError.status,
            message: duplicateError.message
        });
    }

    if (err.name === 'ValidationError') {
        const validationError = handleValidationErrorDB(err);
        return res.status(validationError.statusCode).json({
            status: validationError.status,
            message: validationError.message
        });
    }

    logger.error('ERROR 💥', { error: err })
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
};

process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', {
        name: err.name,
        message: err.message
    })
    process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
        name: err.name,
        message: err.message
    })
    process.exit(1);
});

export const validateBody = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errorMessages = error.details
                .map((detail: { message: any; }) => detail.message)
                .join(', ');

            throw new BadRequestError(errorMessages);
        }

        next();
    };
};