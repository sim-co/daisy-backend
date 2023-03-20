import User from "../../schemas/users";
import querystring from "querystring";
import APIError from "../util/apiError";
import errors from "../util/errors";
import asyncWrapper from "../util/asyncWrapper";
import { clientService } from "../service";
import httpStatus from "http-status";

// 간편로그인 리다이렉트
export const callBackRedirect = (req, res) => {
  const query = clientService.generateQueryService(req.user.id);
  // res.redirect("daisy-app://?" + query);
  res.redirect("/data-test" + query);
}

// 데이터 추가
export const addData = async (req, res) => {
  const userId = res.app.user.id;
  const { nickName, gender, local, birthDay } = req.body;
  const userAddData = await clientService.loginLogAddData({userId, nickName, gender, local, birthDay});
  return res.status(httpStatus.OK).json({ userAddData });
}

export default {
  callBackRedirect,
  addData: asyncWrapper(addData),
}

