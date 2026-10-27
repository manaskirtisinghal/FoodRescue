const Joi = require('joi');

module.exports.foodSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    type: Joi.string().valid('Vegetarian', 'Non-Vegetarian','Vegan').required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    availableUntil: Joi.date().required(),
    providerName: Joi.string().required(),
    image: Joi.string().allow("",null),
    status: Joi.string().valid('available', 'expired', 'claimed', 'unavailable')
});

