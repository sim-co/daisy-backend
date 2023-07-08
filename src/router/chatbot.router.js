import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { chatprompt } from '../controller/chatbot.controller';

const router = Router();

router.post('/chat', verifyToken, chatprompt);

export default router;
