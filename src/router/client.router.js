import { Router } from "express";
import passport from "passport";
import { verifyToken } from "../middleware/verifyToken";
import { body, param, query } from "express-validator";
import httpStatus, { NO_CONTENT } from "http-status";
import asyncWrapper from "../util/asyncWrapper";
import validation from "../middleware/validation";
import { reissueTK } from "../util/reissueTK";
import { callBackRedirect,
         addData,
         updateData,
         showData,
         showFriendData,
         deactivateUserInfo,
         uploadProfileCode} from "../controller/client.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: client
 *   description: 간편로그인 및 추가정보 추가
*/

// 네이버는 필수정보 항목에 체크를 하지 않아도 로그인이 된다. 필수 항목 또한 사용자가 선택할 수 있다는데, 그럼 선택이랑 다를게 없어 보이는데 왜 그랬는지 알 수 없다. 참고

// 이 부분은 서비스를 개발할 때 문제가 된다. 네아로에서 받은 이메일을 통해 서비스에 회원가입을 하는 로직이 있다면 서비스 서버에서는 오류를 내뱉을 것이다.

// 필수임에도 동의 체크를 하지 않고 들어온 고객에 한하여 다시 동의창을 보여주는게 이상적으로 보인다.

//* 네이버로 로그인하기 라우터 ***********************
//? 위에서 네이버 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
//그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.

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
router.get("/naver/callback", passport.authenticate("naver", {failureRedirect: "/client/fail"}), callBackRedirect);

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
router.get("/kakao/callback", passport.authenticate("kakao", {failureRedirect: "/client/fail"}), callBackRedirect);

/**
 * @swagger
 *
 * /client/google:
 *  get:
 *    summary: "구글 Oauth인증 간편 로그인 페이지"
 *    description: "로그인 인증 시 설정한 callBack URL로 보낸다."
 *    tags: [client]
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 *
 * /client/google/callback:
 *  post:
 *    summary: "구글 Oauth callBack URL"
 *    description: "회원가입 또는 로그인 처리 성공시 추가데이터를 적지않았다면 /client/add-data, 추가데이터를 적었다면 /main 으로 refreshTK, accessTK을 querystring으로담아 redirect시킨다. 로그인실패시 /fail로 redirect된다."
 *    tags: [client]
 */
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/client/fail"}), callBackRedirect);

router.get("/fail", async (req, res) => {
  res.send("로그인 실패");
});

router.post(
  "/refresh",
  body("refreshToken").exists(),
  validation,
  asyncWrapper(async (req, res) => {
    const { refreshToken } = req.body;

    const reissuedAccessToken = await reissueTK(refreshToken);

    res.status(200).json({
      accessToken: reissuedAccessToken,
    });
  })
);

/**
 * @swagger
 * /client/add-data:
 *   post:
 *     summary: 로그인 로그 데이터를 추가하는 API입니다.
 *     tags: [client]
 *     security:
 *       - verifyToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *                 description: 사용자 닉네임
 *               gender:
 *                 type: string
 *                 description: 사용자 성별
 *               local:
 *                 type: string
 *                 description: 사용자 지역
 *               birthDay:
 *                 type: string
 *                 format: date
 *                 description: 사용자 생년월일 (YYYY-MM-DD)
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     nickName:
 *                       type: string
 *                       description: 사용자 닉네임
 *                     gender:
 *                       type: string
 *                       description: 사용자 성별
 *                     local:
 *                       type: string
 *                       description: 사용자 지역
 *                     birthDay:
 *                       type: string
 *                       format: date
 *                       description: 사용자 생년월일 (YYYY-MM-DD)
 *                     loginLog:
 *                       type: boolean
 *                       description: 로그인 로그 여부
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: 클라이언트가 존재하지 않을 때의 에러 코드
 *                 errorMessage:
 *                   type: string
 *                   description: 클라이언트가 존재하지 않을 때의 에러 메시지
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                   description: 사용자 정보를 업데이트하는 과정에서 오류가 발생했을 때의 에러 코드
 *                 errorMessage:
 *                   type: string
 *                   description: 사용자 정보를 업데이트하는 과정에서 오류가 발생했을 때의 에러 메시지
 *     securitySchemes:
 *       verifyToken:
 *         type: apiKey
 *         in: header
 *         name: Authorization  # 요청 헤더에 Authorization 필드에 토큰을 추가
 */
router.post("/add-data", verifyToken, addData);

/**
 * @swagger
 *
 * /client/update-data:
 *  patch:
 *    summary: "개인 정보 수정"
 *    description: "개인 정보 수정 API"
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
 *          description: 수정된 데이터를 DB에 저장합니다.
 *          content:
 *             application/json:
 *                example:
 *                   nickName: jaehyung
 *                   gender: male
 *                   local: korea
 *                   birthDay: 1996-03-02
 *
 */
router.patch("/update-data", verifyToken, updateData);

/**
 * @swagger
 *
 * /client/show-data:
 *   get:
 *     summary: "개인 정보 조회"
 *     description: "개인 정보 조회 API"
 *     tags: [client]
 *     security:
 *       - verifyToken: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: 사용자 아이디
 *                 email:
 *                   type: string
 *                   description: 사용자 이메일
 *                 snsNickName:
 *                   type: string
 *                   description: 간편 로그인 사용자 닉네임
 *                 snsId:
 *                   type: string
 *                   description: 간편 로그인시 등록되는 snsID
 *                 provider:
 *                   type: string
 *                   description: 간편 로그인 등록 사이트
 *                 loginLog:
 *                   type: string
 *                   description: 개인정보 등록 여부
 *                 connection:
 *                   type: string
 *                   description: 친구 등록 여부
 *                 birthDay:
 *                   type: string
 *                   format: date
 *                   description: 사용자 생년월일 (YYYY-MM-DD)
 *                 gender:
 *                   type: string
 *                   description: 성별 (male, female)
 *                 local:
 *                   type: string
 *                   description: 거주지
 *                 nickName:
 *                   type: string
 *                   description: 사용자 닉네임
 */
router.get("/show-data", verifyToken, showData);

/**
 * @swagger
 *
 * /client/show-friend-data:
 *   get:
 *     summary: "친구 정보 조회"
 *     description: "친구 정보 조회 API"
 *     tags: [client]
 *     security:
 *       - verifyToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendCode:
 *                 type: string
 *                 description: 친구 코드
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: 사용자 아이디
 *                 email:
 *                   type: string
 *                   description: 사용자 이메일
 *                 snsNickName:
 *                   type: string
 *                   description: 간편 로그인 사용자 닉네임
 *                 snsId:
 *                   type: string
 *                   description: 간편 로그인시 등록되는 snsID
 *                 provider:
 *                   type: string
 *                   description: 간편 로그인 등록 사이트
 *                 loginLog:
 *                   type: string
 *                   description: 개인정보 등록 여부
 *                 connection:
 *                   type: string
 *                   description: 친구 등록 여부
 *                 birthDay:
 *                   type: string
 *                   format: date
 *                   description: 사용자 생년월일 (YYYY-MM-DD)
 *                 gender:
 *                   type: string
 *                   description: 성별 (male, female)
 *                 local:
 *                   type: string
 *                   description: 거주지
 *                 nickName:
 *                   type: string
 *                   description: 사용자 닉네임
 */
router.get("/show-friend-data", verifyToken, showFriendData);

/**
 * @swagger
 *
 * /client/deactivate:
 *   delete:
 *     summary: "회원 탈퇴"
 *     description: "회원 탈퇴 API"
 *     tags: [client]
 *     security:
 *       - verifyToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *     responses:
 *       '200':
 *         description: OK
 */
router.delete("/deactivate", verifyToken, deactivateUserInfo);

router.post("/profile-upload", verifyToken, uploadProfileCode);


export default router;
