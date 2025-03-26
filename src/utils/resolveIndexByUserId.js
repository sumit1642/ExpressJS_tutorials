// Middleware to find user index by ID
export const resolveIndexByUserId = (mockUsers) => (req, res, next) => {
	const { id } = req.params;
	const parsedId = parseInt(id);

	// If ID is not a number, return an error
	if (isNaN(parsedId)) {
		return res
			.status(400)
			.json({ error: "Invalid ID format. ID must be a number." });
	}

	// Find user index in the array
	const userIndex = mockUsers.findIndex((user) => user.id === parsedId);

	// If user does not exist, return error
	if (userIndex === -1) {
		return res.status(404).json({ error: "User not found." });
	}

	// Store user index in the request object
	req.userIndex = userIndex;
	next();
};
