import Joi from 'joi';

export const createBookSchema = Joi.object({
    name: Joi.string().required()
});