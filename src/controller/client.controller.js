import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { clientService } from "../service";
import { Request, Response } from "express";

// 간편로그인 리다이렉트
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const callBackRedirectInner = (req, res) => {
  const query = clientService.generateQueryService(req.user.id);
  // res.redirect("daisy-app://?" + query);
  res.redirect("/data-test" + query);
}

// 데이터 추가
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const addDataInner = async (req, res) => {
  const userId = res.app.user.id;
  const { nickName, gender, local, birthDay } = req.body;
  const userAddData = await clientService.loginLogAddData({ userId, nickName, gender, local, birthDay });
  return res.status(httpStatus.OK).json({ userAddData });
}

//유저 정보 수정
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const updateDataInner = async (req, res) => {
  const myId = res.app.user.id;
  const userUpdateData = await clientService.userUdpate(myId, req.body);
  return res.status(httpStatus.OK).json({ userUpdateData })
}

export const callBackRedirect = callBackRedirectInner;
export const addData = asyncWrapper(addDataInner);
export const updateData = asyncWrapper(updateDataInner);

