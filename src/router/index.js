import { Router } from "express";

import clientRouter from "./client.router";
import friendRouter from "./friend.router";
import courseRouter from "./course.router";
import chatbotRouter from "./chatbot.router";

const router = Router();

router.use("/client", clientRouter);
router.use("/friend", friendRouter);
router.use("/course", courseRouter);
router.use("/chatbot", chatbotRouter);

export default router;