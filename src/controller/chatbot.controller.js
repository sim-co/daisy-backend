import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { chatbotService } from "../service";
import { Request, Response } from "express";

// 간편로그인 리다이렉트
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const chatCompletionInner = async (req, res) => {
    const myId = res.app.user.id;
    const prompt = req.body.prompt;
    const addPrompt = await chatbotService.chatCompletion({myId, prompt});
    return res.status(httpStatus.OK).json({ addPrompt });
}

export const chatprompt = asyncWrapper(chatCompletionInner);