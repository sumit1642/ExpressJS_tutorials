import express from "express";
import { router } from "./routes/users.mjs";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

app.use(router);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
