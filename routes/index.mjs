// routes/index.mjs
// This file will be used to call all the newRoutes in a single file and then import them into the servers main index.mjs file so that , server's index.mjs doesn't get cluttery

import { Router } from "express";
import { usersRouter } from "./users.mjs";

const mainRoutes = Router();

mainRoutes.use("/", usersRouter); // Mount usersRouter at root

export { mainRoutes };