const Joi = require('joi');


const newMenuSchema = {
    body: Joi.object().required().keys({
        name_en: Joi.string().required().messages({
            'any.required': 'English name is required.',
            'string.empty': 'English name cannot be empty.',
        }),
        name_ar: Joi.string().required().messages({
            'any.required': 'Arabic name is required.',
            'string.empty': 'Arabic name cannot be empty.',
        }),
        price: Joi.number().min(0).required().messages({
            'any.required': 'Price is required.',
            'number.base': 'Price must be a number.',
            'number.min': 'Price cannot be less than 0.',
        }),
        discount: Joi.number().min(0).max(1).messages({
            'number.base': 'Discount must be a number.',
            'number.min': 'Discount cannot be less than 0.',
            'number.max': 'Discount cannot be greater than 1.',
        }),
        menu_type: Joi.number().integer().required().messages({
            'any.required': 'Menu type is required.',
            'number.base': 'Menu type must be a number.',
            'number.integer': 'Menu type must be an integer.',
        }),
    })
};


const editMenuSchema = {
    body: Joi.object().required().keys({
        name_en: Joi.string().required().messages({
            'any.required': 'English name is required.',
            'string.empty': 'English name cannot be empty.',
        }),
        name_ar: Joi.string().required().messages({
            'any.required': 'Arabic name is required.',
            'string.empty': 'Arabic name cannot be empty.',
        }),
        price: Joi.number().min(0).required().messages({
            'any.required': 'Price is required.',
            'number.base': 'Price must be a number.',
            'number.min': 'Price cannot be less than 0.',
        }),
        discount: Joi.number().min(0).max(1).messages({
            'number.base': 'Discount must be a number.',
            'number.min': 'Discount cannot be less than 0.',
            'number.max': 'Discount cannot be greater than 1.',
        }),
        menu_type: Joi.number().integer().required().messages({
            'any.required': 'Menu type is required.',
            'number.base': 'Menu type must be a number.',
            'number.integer': 'Menu type must be an integer.',
        }),
    }),
    params: Joi.object().required().keys({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
};

const idURLSchema = {
    params: Joi.object().required().keys({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
}

module.exports = { newMenuSchema, editMenuSchema, idURLSchema }