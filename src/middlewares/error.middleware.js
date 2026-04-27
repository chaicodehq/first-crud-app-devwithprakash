import mongoose from "mongoose";

/**
 * TODO: Handle errors
 *
 * Required error format: { error: { message: "..." } }
 *
 * Handle these cases:
 * 1. Mongoose ValidationError → 400 with combined error messages
 * 2. Mongoose CastError → 400 with "Invalid id format"
 * 3. Other errors → Use err.status (or 500) and err.message
 */
export function errorHandler(err, req, res, next) {
  // Your code here
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");

    return res.status(400).json({ error: { message: messages } });
  } else if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: { message: "Invalid id format" } });
  } else {
    return res.status(500).json({ error: { message: err.message } });
  }
}
