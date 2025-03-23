import express from "express";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;


const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson" },
	{ id: 2, username: "jack", displayName: "Jack" },
	{ id: 3, username: "adam", displayName: "Adam" },
	{ id: 4, username: "tina", displayName: "Tina" },
	{ id: 5, username: "jason", displayName: "Jason" },
	{ id: 6, username: "henry", displayName: "Henry" },
	{ id: 7, username: "marilyn", displayName: "Marilyn" },
];

// Middleware to resolve user index by ID
const resolveIndexByUserId = (req, res, next) => {
	const { id } = req.params;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) {
		return res
			.status(400)
			.json({ error: "Invalid ID format. ID must be a number." });
	}
	const findUserByIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserByIndex === -1) {
		return res.sendStatus(400);
	}
	req.userIndex = findUserByIndex;
	next();
};

// Base route
app.get("/", (req, res) => {
	res.status(200).send({ msg: "Hello" });
});

// Get all users or filter users by query parameters
app.get("/users", (req, res) => {
	const { filter, value } = req.query;

	if (!filter || !value) {
		return res.send(mockUsers);
	}

	const filteredUsers = mockUsers.filter((user) =>
		user[filter]?.toString().includes(value),
	);
	return res.send(filteredUsers);
});

// Add a new user
app.post("/users", (req, res) => {
	const { body } = req;

	const newUser = {
		id: mockUsers.length + 1,
		...body,
	};

	mockUsers.push(newUser);
	res.status(201).send(newUser);
});

// Update a user completely (PUT)
app.put("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;

	mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

// Update specific fields of a user (PATCH)
app.patch("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;

	mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

// Remove a specific key from a user object
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

// Delete a user and reassign IDs sequentially
app.delete("/users/:id", resolveIndexByUserId, (req, res) => {
	const userIndex = req.userIndex;
	mockUsers.splice(userIndex, 1);

	mockUsers.forEach((user, index) => {
		user.id = index + 1;
	});

	return res.status(200).send({ msg: "User deleted successfully" });
});

// Get user by ID
app.get("/users/:id", resolveIndexByUserId, (req, res) => {
	const user = mockUsers[req.userIndex];
	return res.status(200).send({ msg: "User found", user });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
