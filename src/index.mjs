import express from "express";

const app = express();

//  ?  A brief intro of middleware,  just the parse the incoming data through the post request into a json response, will talk about it later in upcoming course
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

// ? This send only hello and we learnt how to send json data directly
app.get("/", (req, res) => {
	res.status(200).send({ msg: "Hello" });
});

// ? This only sends the data of the mockUsers on the client side and we learnt about query params here
app.get("/users", (req, res) => {
	// destructure the query object from the req object
	// const { query } = req;
	// and then desctructre filter and value from the query object itself

	const query = req.query;
	const { filter, value } = query;

	console.log(req.query);
	console.log(query);

	// Case 1: , return the mockUsers as it is if filter and value query doesn't exists
	if (!filter && !value) {
		return res.send(mockUsers);
	}

	/**
	 * Case 2: Only if both 'filter' and 'value' are provided, the filter operation will be performed.
	 * - The 'filter' is expected to be a key in each user object (e.g., 'name', 'age', 'gender').
	 * - The 'value' is the string or number to be matched against the values of the specified 'filter' key.
	 * - This code filters the 'mockUsers' array to return users whose 'filter' key contains the 'value' as a substring.
	 *   For example, if 'filter' is 'name' and 'value' is 'Sumit', it will return all users with 'name' containing 'Sumit'.
	 * - The 'includes()' method checks for the presence of the 'value' in the specified field of each user.
	 */
	if (filter && value) {
		return res.send(
			// If filter = "name", then user[filter] is the same as user.name.
			mockUsers.filter((user) => user[filter].includes(value)),
		);
	}
});

// ? Reciving data from the client side
app.post("/users", (req, res) => {
	console.log(req.body); // Will log `undefined`

	// TODO: For now , we are just sending the data recived directly into that arrary of mockusers
	//TODO: as every user has id with him/her , we need to do so
	// TODO: So , what we can do is that we get the last user's id from that array and do +1 and assing the new id to the new user. We can achieve that by finding the length of the whole mockUsers array and .length()-1 and then .id + 1

	const { body } = req;

	const newUser = {
		id: mockUsers[mockUsers.length - 1].id + 1,
		...body,
	};
	// Adding the newUser to the mockUsers array
	mockUsers.push(newUser);

	res.sendStatus(201).send(newUser);
});

app.put("/users/:id", (req, res) => {
	const { body } = req;
	const { id } = req.params;

	const parsedId = parseInt(id);
	if (isNaN(parsedId)) {
		return res.status(400).send("Something Went Wrong");
	}

	const findUserByIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserByIndex === -1) {
		return res.status(404).send("User not found");
	}

	console.log(`Found User at Index: ${findUserByIndex}`);

	// Retrieve the current user object from mockUsers using findUserByIndex.
	const existingUser = mockUsers[findUserByIndex];

	// Merge the existing user data with the new data (body) using the spread operator (...).
	const updatedUser = { ...existingUser, ...body };

	// Save the updated user back to the array
	mockUsers[findUserByIndex] = updatedUser;

	return res.status(200).send(mockUsers[findUserByIndex]);
});

app.patch("/users/:id", (req, res) => {
	// Extract data from request
	const { body } = req;
	const { id } = req.params;

	// Convert ID to integer
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) {
		return res.status(400).send("Invalid ID format");
	}

	// Find user index
	const findUserByIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserByIndex === -1) {
		return res.status(404).send("User not found");
	}

	// Update user data (Merge old data with new data)
	const existingUser = mockUsers[findUserByIndex];
	console.log(`Existing User: `, existingUser);
	const updatedUser = { ...existingUser, ...body };
	console.log(`Updated User:`, updatedUser);
	mockUsers[findUserByIndex] = updatedUser;
	console.log(`Final Updated User:`, mockUsers[findUserByIndex]);

	// Send updated user as response
	return res.status(200).send(updatedUser);
});

// Removing a specific key from an object without deleteing that object -> Method = PATCH
app.patch("/users/:id/remove-key", (req, res) => {
	const { id } = req.params;
	const { key } = req.body;
	const parsedId = parseInt(id);

	if (isNaN(parsedId)) {
		return res.status(400).send("Need an ID with a number");
	}

	const findUserByIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserByIndex === -1) {
		return res.status(404).send("ID not found");
	}

	const existingUser = mockUsers[findUserByIndex];

	if (key in existingUser) {
		delete existingUser[key];
		return res
			.status(200)
			.send({ msg: `Key "${key}" removed`, user: existingUser });
	} else {
		return res.status(404).send("Key not found");
	}
});

// ? This retrieves the users data based on id -> /users/:id
app.get("/users/:id", (req, res) => {
	console.log(req.params);
	const parsedId = parseInt(req.params.id);
	console.log(parsedId);
	console.log(typeof parsedId);

	if (isNaN(parsedId)) {
		return res.status(400).send({ msg: "Invalid Request" });
	}

	const findUser = mockUsers.find((user) => user.id === parsedId);
	console.log(`findUser: ${findUser}`);

	if (!findUser) {
		return res.status(404).send({ msg: "User not found" });
	}

	return res.status(200).send({ msg: "User exists", user: findUser });
});

// ? listens the server on 8000
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
