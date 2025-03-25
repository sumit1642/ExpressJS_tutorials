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

/* 
🛑 MIDDLEWARE: RESOLVE USER INDEX BY ID
---------------------------------------------------
✅ Purpose: Finds the user index based on ID from request params
✅ Used In: Routes that require user modification or retrieval
✅ Process:
   1️⃣ Extracts the `id` from request params.
   2️⃣ Converts `id` to an integer and validates it.
   3️⃣ Searches for the user in the mock database.
   4️⃣ If user exists, stores index in `req.userIndex` and calls `next()`.
   5️⃣ If user is not found, returns an error.
*/
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

/* 
🌍 BASE ROUTE 
------------------------------------
✅ Purpose: Returns a simple welcome message 
✅ Method: GET 
*/
app.get("/", (req, res) => {
	res.status(200).send({ msg: "Hello" });
});

/* 
🔍 GET USERS (with optional filtering) 
------------------------------------------------------
✅ Purpose: Fetch all users OR filter users by a query
✅ Method: GET 
✅ Query Params:
   - filter (string) ➝ The field to filter by (e.g., "username")
   - value (string)  ➝ The value to match in the field
✅ Process:
   1️⃣ If no filter or value is provided, return all users.
   2️⃣ If both are provided, filter the users accordingly.
*/
app.get("/users", (req, res) => {
	const { filter, value } = req.query;

	if (filter && typeof filter !== "string") {
		return res.status(400).json({ error: "Filter must be a string" });
	}
	if (value && typeof value !== "string") {
		return res.status(400).json({ error: "Value must be a string" });
	}

	if (!filter || !value) return res.json(mockUsers);

	const filteredUsers = mockUsers.filter(
		(user) => user[filter] && user[filter].toString().includes(value),
	);

	res.json(filteredUsers);
});

/* 
➕ ADD A NEW USER 
---------------------------------------------
✅ Purpose: Adds a new user to the list 
✅ Method: POST 
✅ Process:
   1️⃣ Extracts user data from request body.
   2️⃣ Assigns a new unique ID.
   3️⃣ Saves the user in the mock database.
   4️⃣ Returns the newly added user.
*/
app.post("/users", (req, res) => {
	const { body } = req;
	const newUser = { id: mockUsers.length + 1, ...body };
	mockUsers.push(newUser);
	res.status(201).send(newUser);
});

/* 
🔄 REPLACE A USER (FULL UPDATE) 
---------------------------------------------------
✅ Purpose: Completely replaces an existing user 
✅ Method: PUT 
✅ Process:
   1️⃣ Finds user by ID via middleware.
   2️⃣ Replaces user data while keeping the same ID.
   3️⃣ Returns the updated user.
*/
app.put("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;
	mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

/* 
✏️ UPDATE SPECIFIC USER FIELDS 
----------------------------------------------
✅ Purpose: Update specific fields of a user 
✅ Method: PATCH 
✅ Process:
   1️⃣ Finds user by ID via middleware.
   2️⃣ Updates only the provided fields.
   3️⃣ Returns the updated user.
*/
app.patch("/users/:id", resolveIndexByUserId, (req, res) => {
	const { body } = req;
	const userIndex = req.userIndex;
	mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };
	return res.status(200).send(mockUsers[userIndex]);
});

/* 
❌ REMOVE A SPECIFIC USER PROPERTY 
-----------------------------------------------------
✅ Purpose: Deletes a specified key from the user object 
✅ Method: PATCH 
✅ Process:
   1️⃣ Finds user by ID via middleware.
   2️⃣ Checks if the key exists in the object.
   3️⃣ If found, deletes the key and returns updated user.
   4️⃣ If not found, returns an error.
*/
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

/* 
🗑 DELETE A USER & REASSIGN IDs 
----------------------------------------------------
✅ Purpose: Deletes a user and updates IDs sequentially 
✅ Method: DELETE 
✅ Process:
   1️⃣ Finds user by ID via middleware.
   2️⃣ Removes user from the array.
   3️⃣ Reassigns all user IDs sequentially.
   4️⃣ Returns success message.
*/
app.delete("/users/:id", resolveIndexByUserId, (req, res) => {
	const userIndex = req.userIndex;
	mockUsers.splice(userIndex, 1);

	mockUsers.forEach((user, index) => {
		user.id = index + 1;
	});

	return res.status(200).send({ msg: "User deleted successfully" });
});

/* 
🔍 GET USER BY ID 
------------------------------------------
✅ Purpose: Fetch a user by their ID 
✅ Method: GET 
✅ Process:
   1️⃣ Finds user by ID via middleware.
   2️⃣ Returns the user details.
*/
app.get("/users/:id", resolveIndexByUserId, (req, res) => {
	const user = mockUsers[req.userIndex];
	return res.status(200).send({ msg: "User found", user });
});

/* 
🚀 START SERVER 
--------------------------------
✅ Purpose: Runs the Express server on the given port 
*/
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
