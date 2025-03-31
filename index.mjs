import express from "express";
import { ValidateSearchQuery } from "./validators/QueryValidator.mjs";

const app = express();
app.use(express.json());

const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson" },
	{ id: 2, username: "jack", displayName: "Jack" },
	{ id: 3, username: "adam", displayName: "Adam" },
	{ id: 4, username: "tina", displayName: "Tina" },
	{ id: 5, username: "jason", displayName: "Jason" },
	{ id: 6, username: "henry", displayName: "Henry" },
	{ id: 7, username: "marilyn", displayName: "Marilyn" },
];

app.get("/", (req, res) => {
	res.json({ mockUsers });
});

app.get("/users/get/:id", (req, res) => {
	const parsedId = parseInt(req.params.id);
	if (isNaN(parsedId) || parsedId <= 0) {
		return res.status(400).json({ msg: "Provide a valid id" });
	}

	const findUser = mockUsers.find((user) => user.id === parsedId);
	if (!findUser) {
		return res.status(404).json({ msg: "User doesn't exist" });
	}
	res.json(findUser);
});

app.post("/users/new", (req, res) => {
	const { username, displayName } = req.body;

	const newUser = {
		id: mockUsers[mockUsers.length - 1].id + 1,
		username,
		displayName,
	};

	mockUsers.push(newUser);
	res.json(newUser);
})

app.patch("/users/update/:id", (req, res) => {
	const parsedId = parseInt(req.params.id);
	if (isNaN(parsedId) || parsedId <= 0) {
		return res.status(400).json({ msg: "Provide a valid id" });
	}	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);if (findUserIndex === -1) {
		return res.status(404).json({ msg: "User not found" });
	}const { username, displayName } = req.body;
	mockUsers[findUserIndex] = {
		...mockUsers[findUserIndex],
		username: username || mockUsers[findUserIndex].username,
		displayName: displayName || mockUsers[findUserIndex].displayName
	};
	res.json({ user: mockUsers[findUserIndex] });
});

app.put("/users/replace/:id", (req, res) => {
	const parsedId = parseInt(req.params.id);
	if (isNaN(parsedId) || parsedId <= 0) {
		return res.status(400).json({ msg: "Provide a valid id" });
	}

	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) {
		return res.status(404).json({ msg: "User not found" });
	}

	const { username, displayName } = req.body;
	if (!username || !displayName) {
		return res.status(400).json({ msg: "All fields are required" });
	}

	mockUsers[findUserIndex] = { id: parsedId, username, displayName };
	res.json({ user: mockUsers[findUserIndex] });
});

app.get("/users/search", ValidateSearchQuery, (req, res) => {
	const { filterBy, value } = req.query;
	const filteredUsers = mockUsers.filter((user) =>
		user[filterBy].toString().toLowerCase().includes(value.toLowerCase()),
	);

	if (filteredUsers.length === 0) {
		return res.status(404).json({ msg: "No users found" });
	}

	res.json({ users: filteredUsers });
});

app.listen(8000, () => console.log("Server running on port 8000"));
