const { validationResult } = require("express-validator");

// Sends the first validation error as `message` and returns true if there was one
const validationError = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return false;
  res.status(400).json({
    success: false,
    message: errors.array()[0].msg,
    errors: errors.array(),
  });
  return true;
};

module.exports = { validationError };
