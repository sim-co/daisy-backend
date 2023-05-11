import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { friendService } from "../service";
import { Request, Response } from "express";

// 친구코드 생성
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const generateMyFriendCodeInner = async (req, res) => {
    const myId = res.app.user.id;
    const userFriendCode = await friendService.generateFriendCode(myId);
    return res.status(httpStatus.OK).json({ userFriendCode });
}

// 친구코드 연결
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const FriendCodeConnectInner = async (req, res) => {
    const myId = res.app.user.id;
    const friendConnectionCode = req.body.friendConnectionCode;
    const userConnectCode = await friendService.connectCode({myId, friendConnectionCode});
    return res.status(httpStatus.OK).json({userConnectCode});
}

// 친구 연결 끊기
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const FriendDisconnectInner = async (req, res) => {
    const myId = res.app.user.id;
    await friendService.disconnectFriendCode(myId);
    return res.status(httpStatus.OK).json({ message: '친구 연결이 끊어졌습니다.'});
}

export const generateMyFriendCode = asyncWrapper(generateMyFriendCodeInner);
export const FriendCodeConnect = asyncWrapper(FriendCodeConnectInner);
export const FriendDisconnect = asyncWrapper(FriendDisconnectInner);