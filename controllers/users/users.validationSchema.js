const Joi = require('joi');
const { ref } = require('joi');


const newUserSchema = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
        // password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
        password: Joi.string().required().messages({
            "any.required": "You must enter Password",
            "string.empty": "You must enter password",
            // "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        confirm_password: Joi.string().valid(ref("password")).required().messages({
            "any.required": "You must enter Confirm Password",
            "string.empty": "You must enter Confirm password",
            "any.only": "password and confirm password should be the same"
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        phone: Joi.string().required().messages({
            'any.required': 'phone is required.',
            'string.empty': 'phone cannot be empty.',
        }),
        start_working_day: Joi.date().required().messages({
            'any.required': 'Start date of work is required.',
            'date.base': 'Start date must be a valid date.',
        }),
        role: Joi.string().required().messages({
            'any.required': 'Role is required.',
            'string.empty': 'Role cannot be empty.',
        }),
        notes: Joi.string().allow('').optional()

    })
};

const searchUserSchema = {
    query: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        start_working_day: Joi.date().required().messages({
            'any.required': 'Start date of work is required.',
            'date.base': 'Start date must be a valid date.',
        }),
        role: Joi.string().required().messages({
            'any.required': 'Role is required.',
            'string.empty': 'Role cannot be empty.',
        }),

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

const editUserSchema = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        phone: Joi.string().required().messages({
            'any.required': 'phone is required.',
            'string.empty': 'phone cannot be empty.',
        }),
        start_working_day: Joi.date().required().messages({
            'any.required': 'Start date of work is required.',
            'date.base': 'Start date must be a valid date.',
        }),
        role: Joi.string().required().messages({
            'any.required': 'Role is required.',
            'string.empty': 'Role cannot be empty.',
        }),
        notes: Joi.string().allow('').optional()

    }),
    params: Joi.object().required().keys({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
}

const editUserSettingsSchema = {
    body: Joi.object({
        name: Joi.string().required().messages({
            'any.required': 'Name is required.',
            'string.empty': 'Name cannot be empty.',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        phone: Joi.string().required().messages({
            'any.required': 'phone is required.',
            'string.empty': 'phone cannot be empty.',
        })

    }),
    params: Joi.object().required().keys({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
}

const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required.',
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Email must be a valid email address.',
        }),
        // password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
        password: Joi.string().required().messages({
            "any.required": "You must enter Password",
            "string.empty": "You must enter password",
            // "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        })
    })
};

const passwordChangechema = {
    body: Joi.object({
        // password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/)).required().messages({
        currentPassword: Joi.string().required().messages({
            "any.required": "You must enter Current Password",
            "string.empty": "You must enter Current password",
            // "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        newPassword: Joi.string().required().messages({
            "any.required": "You must enter New Password",
            "string.empty": "You must enter New password",
            // "string.pattern.base": ` password  at least 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and Can contain special characters`,
        }),
        confirmPassword: Joi.string().valid(ref("newPassword")).required().messages({
            "any.required": "You must enter Confirm Password",
            "string.empty": "You must enter Confirm password",
            "any.only": "password and confirm password should be the same"
        })
    }),
    params: Joi.object().required().keys({
        id: Joi.number().integer().messages({
            'any.required': 'invalid URL',
            'number.base': 'invalid URL',
            'number.integer': 'invalid URL',
        })
    })
};

module.exports = { 
    newUserSchema,
    searchUserSchema,
    idURLSchema, 
    loginSchema, 
    editUserSettingsSchema, 
    editUserSchema, 
    passwordChangechema }