import express from "express";

const app = express();
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

// This send only hello
app.get("/", (req, res) => {
	res.status(200).send({ msg: "Hello" });
});

app.get("/api/users", (req, res) => {
	console.log(req.query);

	// destructure the query object from the req object
	// const { query } = req;
	// and then desctructre filter and value from the query object itself

	const {
		query: { filter, value },
	} = req;
	console.log(req.query);

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

// This retrieves the users data based on id -> /users/:id
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

// listens the server on 8000
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
