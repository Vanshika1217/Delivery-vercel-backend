const Joi = require("joi");

// Signup Validation Middleware
const signupValidation = (req, res, next) => {
  console.log("hie");
  const schema = Joi.object({
    username: Joi.string().min(0).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

// Login Validation Middleware
const loginValidation = (req, res, next) => {
  console.log("hieee");
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};