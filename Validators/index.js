const Joi = require("joi");
const registerValidationSchema = Joi.object({
  userName: Joi.string().min(2).required().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name should have atleast one character",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email should be valid",
  }),
  password: Joi.string().min(5).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 5 characters",
  }),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email should be valid",
  }),
  password: Joi.string().min(5).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 5 characters",
  }),
});

const addressValidationSchema = Joi.object({
  userId: Joi.string().optional(),
  address: Joi.string().min(5).max(255).required().messages({
    "string.base": "Address must be a string.",
    "string.empty": "Address cannot be empty.",
    "string.min": "Address should be at least 5 characters.",
    "string.max": "Address should not exceed 255 characters.",
    "any.required": "Address is required.",
  }),
  city: Joi.string().min(2).max(100).required().messages({
    "string.base": "City must be a string.",
    "string.empty": "City cannot be empty.",
    "string.min": "City should be at least 2 characters.",
    "string.max": "City should not exceed 100 characters.",
    "any.required": "City is required.",
  }),
  pincode: Joi.string()
    .pattern(/^\d{4,10}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be between 4 and 10 digits.",
      "string.empty": "Pincode cannot be empty.",
      "any.required": "Pincode is required.",
    }),
  phone: Joi.string()
    .pattern(/^\d{7,15}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone must be a valid number with 7 to 15 digits.",
      "string.empty": "Phone number cannot be empty.",
      "any.required": "Phone number is required.",
    }),
  notes: Joi.string().allow("").max(500).messages({
    "string.max": "Notes should not exceed 500 characters.",
  }),
});

const productValidationSchema = Joi.object({
  image: Joi.string().uri().required().messages({
    "string.empty": "Image URL is required",
    "string.uri": "Image must be a valid URL",
  }),
  title: Joi.string().min(1).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must not be empty",
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description should be at least 10 characters",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required",
  }),
  brand: Joi.string().required().messages({
    "string.empty": "Brand is required",
  }),
  price: Joi.number().min(1).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 1 or more",
  }),
  salePrice: Joi.number().min(0).messages({
    "number.base": "Sale price must be a number",
  }),
  totalStock: Joi.number().integer().min(1).required().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be 1 or more",
    "number.integer": "Stock must be an integer",
  }),
});
const updateProductValidationSchema = Joi.object({
  image: Joi.string(),
  title: Joi.string().min(5).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 character long",
  }),
  description: Joi.string().min(10).messages({
    "string.empty": "Description is required",
    "string.min": "Description should be at least 10 characters",
  }),
  category: Joi.string().messages({
    "string.empty": "Category is required",
  }),
  brand: Joi.string().messages({
    "string.empty": "Brand is required",
  }),
  price: Joi.number().min(1).messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be 1 or more",
  }),
  salePrice: Joi.number().min(0).messages({
    "number.base": "Sale price must be a number",
  }),
  totalStock: Joi.number().integer().min(1).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock must be 1 or more",
    "number.integer": "Stock must be an integer",
  }),
}).unknown(true);

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  addressValidationSchema,
  productValidationSchema,
  updateProductValidationSchema,
};
