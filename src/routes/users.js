// Import necessary modules
import express from "express";
import { resolveIndexByUserId } from "../utils/resolveIndexByUserId.js";
import {
	createUserValidationRules,
	validateRequest,
} from "../utils/validationSchemas.js";

// Create a router instance
const router = express.Router();

// Mock user data
const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson" },
	{ id: 2, username: "jack", displayName: "Jack" },
	{ id: 3, username: "adam", displayName: "Adam" },
	{ id: 4, username: "tina", displayName: "Tina" },
	{ id: 5, username: "jason", displayName: "Jason" },
	{ id: 6, username: "henry", displayName: "Henry" },
	{ id: 7, username: "marilyn", displayName: "Marilyn" },
];

// 📌 Get all users
router.get("/", (req, res) => res.status(200).json(mockUsers));

// 📌 Create a new user
router.post("/new", createUserValidationRules, validateRequest, (req, res) => {
	const { username, displayName } = req.body;
	const newUser = { id: mockUsers.length + 1, username, displayName };
	mockUsers.push(newUser);
	res.status(201).json(newUser);
});

// 📌 Get user by ID
router.get("/:id", resolveIndexByUserId(mockUsers), (req, res) =>
	res.status(200).json(mockUsers[req.userIndex]),
);

// 📌 Update user (full replacement)
router.put("/:id/update", resolveIndexByUserId(mockUsers), (req, res) => {
	mockUsers[req.userIndex] = { id: mockUsers[req.userIndex].id, ...req.body };
	res.status(200).json(mockUsers[req.userIndex]);
});

// 📌 Edit user (partial update)
router.patch("/:id/edit", resolveIndexByUserId(mockUsers), (req, res) => {
	mockUsers[req.userIndex] = { ...mockUsers[req.userIndex], ...req.body };
	res.status(200).json(mockUsers[req.userIndex]);
});

// 📌 Remove a specific field from a user
router.patch(
	"/:id/remove-field",
	resolveIndexByUserId(mockUsers),
	(req, res) => {
		const { key } = req.body;
		const user = mockUsers[req.userIndex];

		if (key in user) {
			delete user[key];
			return res.status(200).json({ msg: `Key "${key}" removed`, user });
		}
		return res.status(404).json({ error: "Key not found" });
	},
);

// 📌 Delete a user
router.delete("/:id/delete", resolveIndexByUserId(mockUsers), (req, res) => {
	mockUsers.splice(req.userIndex, 1);

	// Reassign IDs to maintain order
	mockUsers.forEach((user, index) => (user.id = index + 1));

	res.status(200).json({ msg: "User deleted successfully" });
});

// Export the router to be used in index.mjs
export default router;
