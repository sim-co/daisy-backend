import { Router } from "express";

import clientRouter from "./client.router";
import friendRouter from "./friend.router";
import courseRouter from "./course.router";

const router = Router();

router.use("/client", clientRouter);
router.use("/friend", friendRouter);
router.use("/course", courseRouter);

export default router;