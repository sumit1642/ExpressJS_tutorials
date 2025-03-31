// validators/QueryValidator.mjs
import { query, validationResult } from "express-validator";

export const ValidateSearchQuery = [
	query("filterBy")
		.notEmpty()
		.isIn(["username", "displayName"])
		.withMessage("filterBy must be 'username' or 'displayName'")
		.escape(),

	query("value").notEmpty().withMessage("value is required").escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];
