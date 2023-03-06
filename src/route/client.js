import { Router } from "express";
import passport from "passport";
import { verifyToken } from "../middleware/verifyToken";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import querystring from "querystring";

import { body, param, query } from "express-validator";
import httpStatus, { NO_CONTENT } from "http-status";
import asyncWrapper from "../util/asyncWrapper";
import validation from "../middleware/validation";
import APIError from "../util/apiError";
import errors from "../util/errors";

const router = Router();

const loginRedirectUriPrefix = "daisy-app://?";

router.get("/test", verifyToken, async (req, res) => {
  res.send("인가 성공1");
});

// 네이버는 필수정보 항목에 체크를 하지 않아도 로그인이 된다. 필수 항목 또한 사용자가 선택할 수 있다는데, 그럼 선택이랑 다를게 없어 보이는데 왜 그랬는지 알 수 없다. 참고

// 이 부분은 서비스를 개발할 때 문제가 된다. 네아로에서 받은 이메일을 통해 서비스에 회원가입을 하는 로직이 있다면 서비스 서버에서는 오류를 내뱉을 것이다.

// 필수임에도 동의 체크를 하지 않고 들어온 고객에 한하여 다시 동의창을 보여주는게 이상적으로 보인다.

//* 네이버로 로그인하기 라우터 ***********************
//? 위에서 네이버 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다.

/**
 * @swagger
 *
 * /client/naver:
 *  get:
 *    summary: "네이버 Oauth인증 간편 로그인 페이지"
 *    description: "로그인 인증 시 설정한 callBack URL로 보낸다."
 *    tags: [client]
 */
router.get("/naver", passport.authenticate("naver"));

/**
 * @swagger
 *
 * /client/naver/callback:
 *  post:
 *    summary: "네이버 Oauth callBack URL"
 *    description: "회원가입 또는 로그인 처리 성공시 추가데이터를 적지않았다면 /client/add-data, 추가데이터를 적었다면 /main 으로 refreshTK, accessTK을 querystring으로담아 redirect시킨다. 로그인실패시 /fail로 redirect된다."
 *    tags: [client]
 */
router.get(
  "/naver/callback",
  //그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate("naver", {
    //로그인 실패시 get 요청할 주소.
    failureRedirect: "/client/fail",
  }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user.id);
    const refreshToken = generateRefreshToken(req.user.id);
    if (req.user.loginLog == false) {
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect(loginRedirectUriPrefix + query);
    } else if (req.user.loginLog == true) {
      //로그인 성공시 get 요청할 주소 (메인화면으로 보낸다.)
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect("/main" + query);
    }
  }
);

/**
 * @swagger
 *
 * /client/kakao:
 *  get:
 *    summary: "카카오 Oauth인증 간편 로그인 페이지"
 *    description: "로그인 인증 시 설정한 callBack URL로 보낸다."
 *    tags: [client]
 */
router.get("/kakao", passport.authenticate("kakao"));

/**
 * @swagger
 *
 * /client/kakao/callback:
 *  post:
 *    summary: "카카오 Oauth callBack URL"
 *    description: "회원가입 또는 로그인 처리 성공시 추가데이터를 적지않았다면 /client/add-data, 추가데이터를 적었다면 /main 으로 refreshTK, accessTK을 querystring으로담아 redirect시킨다. 로그인실패시 /fail로 redirect된다."
 *    tags: [client]
 */
router.get(
  "/kakao/callback",
  //그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  passport.authenticate("kakao", {
    //로그인 실패시 get 요청할 주소.
    failureRedirect: "/client/fail",
  }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user.id);
    const refreshToken = generateRefreshToken(req.user.id);
    // 만약 추가 데이터를 적지 않았다면 (신규 사용자라면)
    if (req.user.loginLog == false) {
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect(loginRedirectUriPrefix + query);
    } else if (req.user.loginLog == true) {
      //로그인 성공시 get 요청할 주소 (메인화면으로 보낸다.)
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect("/main" + query);
    }
  }
);

/**
 * @swagger
 *
 * /client/google:
 *  get:
 *    summary: "구글 Oauth인증 간편 로그인 페이지"
 *    description: "로그인 인증 시 설정한 callBack URL로 보낸다."
 *    tags: [client]
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 *
 * /client/google/callback:
 *  post:
 *    summary: "구글 Oauth callBack URL"
 *    description: "회원가입 또는 로그인 처리 성공시 추가데이터를 적지않았다면 /client/add-data, 추가데이터를 적었다면 /main 으로 refreshTK, accessTK을 querystring으로담아 redirect시킨다. 로그인실패시 /fail로 redirect된다."
 *    tags: [client]
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/client/fail",
  }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user.id);
    const refreshToken = generateRefreshToken(req.user.id);

    if (req.user.loginLog == false) {
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect(loginRedirectUriPrefix + query);
    } else if (req.user.loginLog == true) {
      //로그인 성공시 get 요청할 주소 (메인화면으로 보낸다.)
      const query = querystring.stringify({
        access: accessToken,
        refresh: refreshToken,
      });
      res.redirect("/main" + query);
    }
  }
);

router.get("/fail", async (req, res) => {
  res.send("로그인 실패");
});

/**
 * @swagger
 *
 * /client/add-data:
 *  post:
 *    summary: "추가데이터 추가"
 *    description: "간편로그인에 성공한 유저 중 한번도 추가데이터를 적지않은 유저들을 위한 추가데이터 API"
 *    tags: [client]
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   nickName:
 *                      type: string
 *                   gender:
 *                      type: string
 *                   local:
 *                      type: string
 *                   birthDay:
 *                      type: string
 *    responses:
 *       "200":
 *          description: 추가된 데이터를 DB에 저장합니다.
 *          content:
 *             application/json:
 *                example:
 *                   nickName: jaehyung
 *                   gender: male
 *                   local: korea
 *                   birthDay: 1996-03-02
 *                   loginLog: true
 *
 */
router.post(
  "/add-data",
  asyncWrapper(async (req, res) => {
    console.log(req.user);
    const userId = req.user.id;
    const { nickName, gender, local, birthDay } = req.body;
    try {
      await User.findByIdAndUpdate(userId, {
        nickName: nickName,
        gender: gender,
        local: local,
        birthDay: birthDay,
        loginLog: true,
      });
      res.send("add-data 완료");
    } catch (error) {
      //사용자 정보를 업데이트하는 과정에서 오류가 발생했습니다.
      throw new APIError(
        errors.CANT_UPDATE_USER_INFORMATION.statusCode,
        errors.CANT_UPDATE_USER_INFORMATION.errorCode,
        errors.CANT_UPDATE_USER_INFORMATION.errorMsg
      );
    }
  })
);

export default router;
