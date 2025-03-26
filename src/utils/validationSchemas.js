// Import express-validator for input validation
import { body, validationResult } from "express-validator";

// Validation rules for creating a new user
export const createUserValidationRules = [
	body("username")
		.trim() // Remove extra spaces
		.isString() // Ensure it's a string
		.notEmpty() // Ensure it's not empty
		.isLength({ min: 5, max: 10 }) // Set length between 5-10
		.withMessage("Username must be between 5-10 characters."),

	body("displayName")
		.trim()
		.isString()
		.notEmpty()
		.isLength({ min: 5, max: 10 })
		.withMessage("Display name must be between 5-10 characters."),
];

// Middleware to check validation results
export const validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};
