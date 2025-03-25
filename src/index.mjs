import express from "express";
import { body, validationResult } from "express-validator";

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

const resolveIndexByUserId = (req, res, next) => {
	const { id } = req.params;
	const parsedId = parseInt(id);

	if (isNaN(parsedId)) {
		return res
			.status(400)
			.json({ error: "Invalid ID format. ID must be a number." });
	}

	const userIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (userIndex === -1) {
		return res.sendStatus(400);
	}

	req.userIndex = userIndex;
	next();
};

app.get("/", (req, res) =>
	res.status(200).json({ message: "Welcome to the User API" }),
);

app.get("/users", (req, res) => res.status(200).json(mockUsers));

app.post(
	"/users/new",
	[
		body("username")
			.trim()
			.isString()
			.notEmpty()
			.isLength({ min: 5, max: 10 })
			.withMessage("Username must be between 5-10 characters.")
			.custom((value) => {
				if (mockUsers.some((user) => user.username === value)) {
					throw new Error("Username already taken.");
				}
				return true;
			}),
		body("displayName")
			.trim()
			.isString()
			.notEmpty()
			.isLength({ min: 5, max: 10 })
			.withMessage("Display name must be between 5-10 characters."),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { username, displayName } = req.body;
		const newUser = { id: mockUsers.length + 1, username, displayName };
		mockUsers.push(newUser);

		res.status(201).json(newUser);
	},
);

app.get("/users/:id", resolveIndexByUserId, (req, res) =>
	res.status(200).send(mockUsers[req.userIndex]),
);

app.put("/users/:id/update", resolveIndexByUserId, (req, res) => {
	mockUsers[req.userIndex] = { id: mockUsers[req.userIndex].id, ...req.body };
	res.status(200).send(mockUsers[req.userIndex]);
});

app.patch("/users/:id/edit", resolveIndexByUserId, (req, res) => {
	mockUsers[req.userIndex] = { ...mockUsers[req.userIndex], ...req.body };
	res.status(200).send(mockUsers[req.userIndex]);
});

app.patch("/users/:id/remove-field", resolveIndexByUserId, (req, res) => {
	const { key } = req.body;
	const user = mockUsers[req.userIndex];

	if (key in user) {
		delete user[key];
		return res.status(200).send({ msg: `Key "${key}" removed`, user });
	}
	return res.status(404).send("Key not found");
});

app.delete("/users/:id/delete", resolveIndexByUserId, (req, res) => {
	mockUsers.splice(req.userIndex, 1);
	mockUsers.forEach((user, index) => (user.id = index + 1));
	res.status(200).send({ msg: "User deleted successfully" });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
