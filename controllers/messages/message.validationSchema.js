const Joi = require('joi');
const egyptianPatternOrSaudiArabian = /^(?:(?:\+|00)20[\s-]?)?(?:1[0-2]\d{1}|1[0-2])[\s-]?\d{7}$/;

const newMessageSchema = {
    body: Joi.object({
        subject: Joi.string().required().messages({
            'any.required': 'Subject is required.',
            'string.empty': 'Subject cannot be empty.',
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        // phone: Joi.string().required().pattern(egyptianPatternOrSaudiArabian).messages({
        phone: Joi.string().required().pattern(/^(010|011|012|015)\d{8}$/).messages({
            'any.required': 'Phone number is required.',
            'string.empty': 'Phone number cannot be empty.',
            'string.pattern.base': 'Phone number must be a valid Egyptian or Saudi Arabian number.',
        }),
        message: Joi.string().required().messages({
            'any.required': 'Message is required.',
            'string.empty': 'Message cannot be empty.',
        }),
    })
};

const readMessageSchema = {
    body: Joi.object({
        // @ts-ignore
        messageIds: Joi.array().items(Joi.number().integer()).error(errors => {
            errors.forEach((error) => {
                switch (error.code) {
                    case 'array.base':
                        error.message = 'Message IDs must be provided as an array';
                        break;
                    case 'number.base':
                        error.message = 'Message IDs must be integers';
                        break;
                    default:
                        break;
                }
            });
            return errors;
        })
    })
}

const paginationSchema={
    query:Joi.object({
        page:Joi.number().min(1).required().messages({
            'any': 'Invalid page number',
            'number.base': 'Invalid page number',
            'number.min': 'Invalid page number at least 1',
            'any.required': 'Invalid page number',
        })
    })
}

const idURLSchema = {
    params: Joi.object({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
}

module.exports = { newMessageSchema, readMessageSchema, paginationSchema, idURLSchema }