import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().required()
});

export const returnBookSchema = Joi.object({
    score: Joi.number().min(0).max(10).required()
});