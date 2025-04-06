import express from "express";
import { mainRoutes } from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
// cookie-parser parses incoming Cookie headers into req.cookies (and req.signedCookies if used with a secret)
app.use(cookieParser("testingSeceret")); // 🔥 Must be called to activate parsing
app.use(mainRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});