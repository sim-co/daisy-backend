import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { clientService } from "../service";
import { Request, Response } from "express";

/**
 * 간편로그인 리다이렉트 - 컨트롤러
 * @param {Request} req 
 * @param {Response} res
 */
const callBackRedirectInner = (req, res) => {
  const query = clientService.generateQueryService(req.user.id);
  res.redirect("daisy-app://?" + query);
  // res.redirect("/data-test" + query);
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const addDataInner = async (req, res) => {
  const userId = res.app.user.id;
  const { nickName, gender, local, birthDay } = req.body;
  const userAddData = await clientService.loginLogAddData({
    userId,
    nickName,
    gender,
    local,
    birthDay,
  });
  return res.status(httpStatus.OK).json({ userAddData });
};


/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const updateDataInner = async (req, res) => {
  const myId = res.app.user.id;
  const userUpdateData = await clientService.userUdpate(myId, req.body);
  return res.status(httpStatus.OK).json({ userUpdateData });
};


/**
 * 유저 추가데이터 보여주기 - 컨트롤러
 * @param {Request} req 
 * @param {Response} res
 */
const showDataInner = async (req, res) => {
  const myId = res.app.user.id;
  const userData = await clientService.showData(myId);
  return res.status(httpStatus.OK).json({ userData });
};

/**
 * 친구 데이터 보여주기 - 컨트롤러
 * @param {Request} req 
 * @param {Response} res
 */
const showFriendDataInner = async (req, res) => {
  const { friendCode } = req.body;
  const friendData = await clientService.showFriendData(friendCode);
  return res.status(httpStatus.OK).json({ friendData });
};

/**
 * 계정 탈퇴 - 컨트롤러
 * @param {Request} req 
 * @param {Response} res
 */
const deactivateUserInfoInner = async (req, res) => {
  const myId = res.app.user.id;
  const deldata = await clientService.deactivateUserInfo(myId);
  return res.status(httpStatus.OK).json({ deldata });
};

const uploadProfileInner = async (req, res) => {
  const signedUrlPut = await clientService.uploadProfileCode();
  return res.status(httpStatus.OK).json(
    {"filename" : signedUrlPut}
    );
}

export const callBackRedirect = callBackRedirectInner;
export const addData = asyncWrapper(addDataInner);
export const updateData = asyncWrapper(updateDataInner);
export const showData = asyncWrapper(showDataInner);
export const showFriendData = asyncWrapper(showFriendDataInner);
export const deactivateUserInfo = asyncWrapper(deactivateUserInfoInner);
export const uploadProfileCode = asyncWrapper(uploadProfileInner);