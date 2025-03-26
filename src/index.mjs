// Import required modules
import express from "express";
import userRoutes from "./routes/users.js"; // Import user routes

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());

// Root route
app.get("/", (req, res) =>
	res.status(200).json({ message: "Welcome to the User API" }),
);

// Use user-related routes
app.use("/users", userRoutes);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
