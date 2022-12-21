import { Router } from "express";
import { body, param, query } from "express-validator";
import httpStatus, { NO_CONTENT } from "http-status";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../util/jwt"
import passport from "passport";
import asyncWrapper from "../util/asyncWrapper";
import validation from "../middleware/validation";
import APIError from "../util/apiError";
import errors from "../util/errors";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/verifyToken";


const router = Router();
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
 *    summary: "네이버 간편 로그인 페이지"
 *    description: "로그인 인증 시 Redirect URL로 보낸다."
 *    tags: [client]
 */
router.get('/naver', passport.authenticate('naver'));

/**
 * @swagger
 *
 * /client/naver/:
 *  post:
 *    summary: "네이버 간편 로그인"
 *    description: "POST 방식으로 네이버에 간편 로그인 요청을 보냄. 로그인 성공시 엑세스 토큰과 리프레시 토큰을 Json 형태로 응답합니다."
 *    tags: [client]
 */
router.get('/naver/callback',
   //그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
   passport.authenticate('naver', { 
      //로그인 실패시 get 요청할 주소.
      failureRedirect: '/fail'
   }), (req, res) => {
      console.log(req.user.dataValues.snsId)
      const accessToken = generateAccessToken(req.user.dataValues.snsId);
      const refreshToken = generateRefreshToken(req.user.dataValues.snsId);
      res.json({
         accessToken,
         refreshToken,
      })
   },
);

/**
 * @swagger
 *
 * /client/kakao:
 *  get:
 *    summary: "카카오 간편 로그인 페이지"
 *    description: "로그인 인증 시 Redirect URL로 보낸다."
 *    tags: [client]
 */
router.get('/kakao', passport.authenticate('kakao'));

/**
 * @swagger
 *
 * /client/kakao/callback:
 *  post:
 *    summary: "카카오 간편 로그인"
 *    description: "POST 방식으로 네이버에 간편 로그인 요청을 보냄. 로그인 성공시 엑세스 토큰과 리프레시 토큰을 Json 형태로 응답합니다."
 *    tags: [client]
 */
router.get('/kakao/callback',
   //그리고 passport 로그인 전략에 의해 naverStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
   passport.authenticate('kakao', { 
      //로그인 실패시 get 요청할 주소.
      failureRedirect: '/fail' 
   }), (req, res) => {
      console.log(req.user.dataValues.snsId)
      const accessToken = generateAccessToken(req.user.dataValues.snsId);
      const refreshToken = generateRefreshToken(req.user.dataValues.snsId);
      res.json({
         accessToken,
         refreshToken,
      })
   },
);

/**
 * @swagger
 *
 * /client/google:
 *  get:
 *    summary: "구글 간편 로그인 페이지"
 *    description: "로그인 인증 시 Redirect URL로 보낸다."
 *    tags: [client]
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 *
 * /client/google/callback:
 *  post:
 *    summary: "구글 간편 로그인"
 *    description: "POST 방식으로 네이버에 간편 로그인 요청을 보냄. 로그인 성공시 엑세스 토큰과 리프레시 토큰을 Json 형태로 응답합니다."
 *    tags: [client]
 */
router.get('/google/callback',
   passport.authenticate('google', { 
      failureRedirect: '/fail' 
   }), (req, res) => {
      console.log(req.user.dataValues.snsId)
      const accessToken = generateAccessToken(req.user.dataValues.snsId);
      const refreshToken = generateRefreshToken(req.user.dataValues.snsId);
      res.json({
         accessToken,
         refreshToken,
      })
   },
);


router.get('/fail',async(req,res)=> {
   res.send('로그인 실패');
});

router.get('/success', async(req,res)=>{
   res.send('로그인 성공');
});


/**
 * @swagger
 *
 * /client/test:
 *  get:
 *    summary: "테스트"
 *    description: "요청시 토큰 값을 Bearer Auth에 첨부하여 요청해야 합니다. 검증 성공 시 해당 유저의 정보가 json 형태로 리턴됩니다."
 *    tags: [client]
 */
router.get('/test', verifyToken, async (req, res) => {
   res.send(res.app.user);
   // res.json({
   //    id: res.app
   // })
});

export default router;