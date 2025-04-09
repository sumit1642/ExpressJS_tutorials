import { Router } from "express";
import { ValidateSearchQuery } from "../validators/QueryValidator.mjs";
import { mockUsers } from "../common/constants.mjs";
import { validateRequestId } from "../middleWares/validateRequestId.mjs";

export const usersRouter = Router();

/**
 * NOTE: req.headers.cookie : It logs the cookie in un-parsed or raw format
 * req.cookies : It show the parsed cookies into json using cookie-parser, that we have included into server's main index.js file
 */

usersRouter.get("/", (req, res) => {
	console.log(`Session ID:==> `, req.sessionID);
	console.log(`Session Object :  \n `, req.session);

	// this will stop re-generation of session id on subsequent requests, it should never be set false
	req.session.visited = true;

	res.send("This is Home Page");
});

usersRouter.get("/users", (req, res) => {
	res.cookie("Hello", "World", { signed: true }); // setting cookie in response
	req.session.visited = true;
	console.log(`Session ID:==> `, req.sessionID);
	console.log(`Session Object :  \n `, req.session);
	
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
