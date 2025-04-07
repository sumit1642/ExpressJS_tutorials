import express from "express";
import { mainRoutes } from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
// cookie-parser parses incoming Cookie headers into req.cookies (and req.signedCookies if used with a secret)
app.use(cookieParser("testingSeceret")); // 🔥 Must be called to activate parsing

/** NOTE: Always implement session before routes or routemiddleWare like mainRoutes */
app.use(
	session({
		secret: "sumit-secret-key",
		saveUninitialized: false,
		resave: false,
		cookie: {
			// 60000 ms = 60seconds
			maxAge: 60000 * 60, // 1hr
		},
	}),
);

app.use(mainRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
