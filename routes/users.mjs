import { Router } from "express";
import { ValidateSearchQuery } from "../validators/QueryValidator.mjs";
import { mockUsers } from "../common/constants.mjs";
import { validateRequestId } from "../middleWares/validateRequestId.mjs";

export const usersRouter = Router();

usersRouter.get("/", (req, res) => {
	res.json({ mockUsers });
});

usersRouter.get("/users/get/:id", validateRequestId, (req, res) => {

	const findUser = mockUsers.find((user) => user.id === req.parsedId);
	if (!findUser) {
		return res.status(404).json({ msg: "User doesn't exist" });
	}
	res.json(findUser);
});

usersRouter.post("/users/new", (req, res) => {
	const { username, displayName } = req.body;

	const newUser = {
		id: mockUsers[mockUsers.length - 1].id + 1,
		username,
		displayName,
	};

	mockUsers.push(newUser);
	res.json(newUser);
});

usersRouter.patch("/users/update/:id", validateRequestId, (req, res) => {
	const findUserIndex = mockUsers.findIndex(
		(user) => user.id === req.parsedId,
	);
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

usersRouter.put("/users/replace/:id", validateRequestId, (req, res) => {
	const findUserIndex = mockUsers.findIndex(
		(user) => user.id === req.parsedId,
	);
	if (findUserIndex === -1) {
		return res.status(404).json({ msg: "User not found" });
	}

	const { username, displayName } = req.body;
	if (!username || !displayName) {
		return res.status(400).json({ msg: "All fields are required" });
	}

	mockUsers[findUserIndex] = { id: req.parsedId, username, displayName };
	res.json({ user: mockUsers[findUserIndex] });
});

usersRouter.get("/users/search", ValidateSearchQuery, (req, res) => {
	const { filterBy, value } = req.query;
	const filteredUsers = mockUsers.filter((user) =>
		user[filterBy].toString().toLowerCase().includes(value.toLowerCase()),
	);

	if (filteredUsers.length === 0) {
		return res.status(404).json({ msg: "No users found" });
	}

	res.json({ users: filteredUsers });
});
