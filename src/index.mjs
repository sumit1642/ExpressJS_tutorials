import express from "express";

const app = express();

// ? Middleware: Parses incoming JSON data in request body
// This allows us to access request body data as JSON objects in routes.
app.use(express.json());
const PORT = process.env.PORT || 8000;

// -------------------------------------------------------------------------------------
// ? Middleware Explanation
/**
 * Middleware functions execute in the request-response cycle and can be applied in two ways:
 * - Globally (app.use(middleware)) - Runs for every request after it is declared.
 * - Route-specific (app.use('/route', middleware)) - Runs only for specific routes.
 *
 * Middleware can be used for:
 * - Authentication
 * - Logging requests
 * - Validating request data
 * - Modifying request/response objects
 *
 * The next() function must be called to pass control to the next middleware or route handler.
 */

const resolveIndexByUserId = (req, res, next) => {
	const { id } = req.params;
	const parsedId = parseInt(id);

	if (isNaN(parsedId)) {
		return res.sendStatus(400); // Invalid ID format
	}
	const findUserByIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserByIndex === -1) {
		return res.sendStatus(400); // User not found
	}

	req.userIndex = findUserByIndex; // Store index for later use
	next();
};

// Mock user database
const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson" },
	{ id: 2, username: "jack", displayName: "Jack" },
	{ id: 3, username: "adam", displayName: "Adam" },
	{ id: 4, username: "tina", displayName: "Tina" },
	{ id: 5, username: "jason", displayName: "Jason" },
	{ id: 6, username: "henry", displayName: "Henry" },
	{ id: 7, username: "marilyn", displayName: "Marilyn" },
];

// ? Base route returning a basic JSON response
app.get("/", (req, res) => {
	res.status(200).send({ msg: "Hello" });
});

// ? Get all users or filter by query parameters
/**
 * Query Parameters:
 * - filter: The key in the user object to search by (e.g., "username").
 * - value: The value to match against the filter key.
 */
app.get("/users", (req, res) => {
	const { filter, value } = req.query;

	if (!filter || !value) {
		return res.send(mockUsers); // Return all users if no filter is applied.
	}

	const filteredUsers = mockUsers.filter((user) =>
		user[filter]?.toString().includes(value),
	);
	return res.send(filteredUsers);
});

// ? Add a new user
/**
 * The request body should include user details like:
 * {
 *   "username": "newUser",
 *   "displayName": "New User"
 * }
 */
app.post("/users", (req, res) => {
	const { body } = req;

	const newUser = {
		id: mockUsers.length + 1, // Assign the next sequential ID
		...body,
	};

	mockUsers.push(newUser);
	res.status(201).send(newUser);
});

// ? Update a user (PUT - full replacement)
app.put("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;

	// Replace the entire user object with the new data
	mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

// ? Update specific fields of a user (PATCH - partial update)
app.patch("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;

	// Merge existing user data with new fields
	mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

// ? Remove a specific key from a user
app.patch("/users/:id/remove-key", resolveIndexByUserId, (req, res) => {
	const { key } = req.body;
	const userIndex = req.userIndex;
	const user = mockUsers[userIndex];

	if (key in user) {
		delete user[key];
		return res.status(200).send({ msg: `Key "${key}" removed`, user });
	}
	return res.status(404).send("Key not found");
});

// ? Delete a user and reassign IDs
app.delete("/users/:id", resolveIndexByUserId, (req, res) => {
	const userIndex = req.userIndex;
	mockUsers.splice(userIndex, 1);

	// Reassign IDs sequentially
	mockUsers.forEach((user, index) => {
		user.id = index + 1;
	});

	return res.status(200).send({ msg: "User deleted successfully" });
});

// ? Get user by ID
app.get("/users/:id", resolveIndexByUserId, (req, res) => {
	const user = mockUsers[req.userIndex];
	return res.status(200).send({ msg: "User found", user });
});

// ? Start server
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
