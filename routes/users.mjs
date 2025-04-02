// routes/users.mjs
import { Router } from "express";
import { ValidateSearchQuery } from "../validators/QueryValidator.mjs";

export const router = Router();

router.get("/", (req, res) => {
	res.json({ mockUsers });
});

router.get("/users/get/:id", (req, res) => {
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

router.post("/users/new", (req, res) => {
	const { username, displayName } = req.body;

	const newUser = {
		id: mockUsers[mockUsers.length - 1].id + 1,
		username,
		displayName,
	};

	mockUsers.push(newUser);
	res.json(newUser);
});

router.patch("/users/update/:id", (req, res) => {
	const parsedId = parseInt(req.params.id);
	if (isNaN(parsedId) || parsedId <= 0) {
		return res.status(400).json({ msg: "Provide a valid id" });
	}
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) {
		return res.status(404).json({ msg: "User not found" });
	}
	const { username, displayName } = req.body;
	mockUsers[findUserIndex] = {
		...mockUsers[findUserIndex],
		username: username || mockUsers[findUserIndex].username,
		displayName: displayName || mockUsers[findUserIndex].displayName,
	};
	res.json({ user: mockUsers[findUserIndex] });
});

router.put("/users/replace/:id", (req, res) => {
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

router.get("/users/search", ValidateSearchQuery, (req, res) => {
	const { filterBy, value } = req.query;
	const filteredUsers = mockUsers.filter((user) =>
		user[filterBy].toString().toLowerCase().includes(value.toLowerCase()),
	);

	if (filteredUsers.length === 0) {
		return res.status(404).json({ msg: "No users found" });
	}

	res.json({ users: filteredUsers });
});
