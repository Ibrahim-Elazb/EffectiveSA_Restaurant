const Joi = require('joi');


const newMenuTypeSchema = {
    body: Joi.object({
        name_en: Joi.string().required().messages({
            'any.required': 'English name is required.',
            'string.empty': 'English name cannot be empty.',
        }),
        name_ar: Joi.string().required().messages({
            'any.required': 'Arabic name is required.',
            'string.empty': 'Arabic name cannot be empty.',
        })
    })
};


const editMenuTypeSchema = {
    body: Joi.object({
        name_en: Joi.string().required().messages({
            'any.required': 'English name is required.',
            'string.empty': 'English name cannot be empty.',
        }),
        name_ar: Joi.string().required().messages({
            'any.required': 'Arabic name is required.',
            'string.empty': 'Arabic name cannot be empty.',
        })
    }),
    params: Joi.object({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
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

module.exports = { newMenuTypeSchema, editMenuTypeSchema, idURLSchema }