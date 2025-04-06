import express from "express";
import { mainRoutes } from "./routes/index.mjs";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(mainRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
