import express from "express";
import { ValidateSearchQuery } from "./validators/QueryValidator.mjs";
import { router } from "./routes/users.mjs";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

app.use(router);

const mockUsers = [
	{ id: 1, username: "anson", displayName: "Anson" },
	{ id: 2, username: "jack", displayName: "Jack" },
	{ id: 3, username: "adam", displayName: "Adam" },
	{ id: 4, username: "tina", displayName: "Tina" },
	{ id: 5, username: "jason", displayName: "Jason" },
	{ id: 6, username: "henry", displayName: "Henry" },
	{ id: 7, username: "marilyn", displayName: "Marilyn" },
];

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
