const Joi = require('joi');


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().allow("", null),
}).required()
});


const reviewSchema = Joi.object({
    review: Joi.object({
      comment: Joi.string().required(), // Example: Require the comment field
      rating: Joi.number().min(1).max(5).required() // Example: Require the rating field
    }).required()
  });
  
  module.exports = { reviewSchema };