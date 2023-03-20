import { Router } from "express";

import clientRouter from "./client.router";
import friendRouter from "./friend.router";
import mainRouter from "./main.router";

const router = Router();

router.use("/client", clientRouter);
router.use("/friend", friendRouter);
router.use("/main", mainRouter);

export default router;