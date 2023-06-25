const Joi = require('joi');

const newOrderSchema = {
    body: Joi.object({
        client_name: Joi.string().required().messages({
            'any.required': 'Client name is required.',
            'string.empty': 'Client name cannot be empty.',
        }),
        client_email: Joi.string().email().required().messages({
            'any.required': 'Client email is required.',
            'string.empty': 'Client email cannot be empty.',
            'string.email': 'Client email must be a valid email address.',
        }),
        client_phone: Joi.string().pattern(/^[\d\s/+]+$/).required().messages({
            'any.required': 'Client phone number is required.',
            'string.empty': 'Client phone number cannot be empty.',
            'string.pattern.base': 'Client phone number must contain only numbers, spaces, slashes, and plus sign.',
        }),
        client_vehicle: Joi.string().allow('').messages({
            'string.empty': 'Client vehicle cannot be empty.',
        }),
        notes: Joi.string().allow('').messages({
            'string.empty': 'Notes cannot be empty.',
        }),
        orderList: Joi.array().items(
            Joi.object({
                id: Joi.number().integer().required().messages({
                    'any.required': 'Item ID is required.',
                    'number.base': 'Item ID must be a number.',
                    'number.integer': 'Item ID must be an integer.',
                }),
                count: Joi.number().integer().required().messages({
                    'any.required': 'Item count is required.',
                    'number.base': 'Item count must be a number.',
                    'number.integer': 'Item count must be an integer.',
                }),
            })
        ).required().messages({
            'any.required': 'Order list is required.',
        }),
    })
};


const orderDateSchema = {
    query: Joi.object({
        start_date: Joi.date().required().messages({
            'any.required': 'Start date is required.',
            'date.base': 'Start date must be a valid date.',
        }),
        end_date: Joi.date().messages({
            'date.base': 'End date must be a valid date.',
        }),
    })
};

const idURLSchema = {
    params: Joi.object({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
}

const orderStatusSchema = {
    body: Joi.object({
        status: Joi.string().valid('pending', 'ready', 'delivered', 'cancelled').required().messages({
            'any.required': 'Status is required.',
            'string.empty': 'Status cannot be empty.',
            'any.only': 'Status must be one of the following values: pending, ready, delivered, cancelled.',
        }),
    }),
    params: Joi.object({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
};

const paginationSchema = {
    query: Joi.object({
        page: Joi.number().min(1).required().messages({
            'any': 'Invalid page number',
            'number.base': 'Invalid page number',
            'number.min': 'Invalid page number at least 1',
            'any.required': 'Invalid page number',
        })
    })
}

module.exports = { newOrderSchema, orderDateSchema, idURLSchema, paginationSchema, orderStatusSchema }