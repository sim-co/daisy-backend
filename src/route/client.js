import { Router } from "express";
import { body, param, query } from "express-validator";
import httpStatus, { NO_CONTENT } from "http-status";
import crypto from "crypto";

import asyncWrapper from "../util/asyncWrapper";
import validation from "../middleware/validation";
// import Client from "../models/clients";
import APIError from "../util/apiError";
import errors from "../util/errors";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/verifyToken";

const router = Router();

//회원가입

const postClient = async (req,res) => {
    const { email, password, nickname } = req.body;
  
    // 이메일이 존재하는지 확인
    if (await Client.exists({ email })) {
      // 흐름때문에 에러 처리를, throw new APIError 하는 방향으로 합니다
      throw new APIError(
        errors.EMAIL_ALREADY_EXISTS.statusCode,
        errors.EMAIL_ALREADY_EXISTS.errorCode,
        errors.EMAIL_ALREADY_EXISTS.errorMsg
      );
    }

    //닉네임이 존재하는지 확인
    if (await Client.exists({ nickname })) {
      throw new APIError(
        errors.NICKNAME_ALREADY_EXISTS.statusCode,
        errors.NICKNAME_ALREADY_EXISTS.errorCode,
        errors.NICKNAME_ALREADY_EXISTS.errorMsg
      )
    }
  
    /**
     * 비밀번호 sha256 해시걸기
     * sha256:SHA-256은 현재 블록체인에서 가장 많이 채택하여 사용되고 있는 암호 방식이다. 출력 속도가 빠르다는 장점을 갖고 있다. 또한 단방향성의 성질을 띄고 있는 암호화 방법으로 복호화가 불가능하다. 
     * 로그인 할때도 해시 암호화가 된 비밀번호와 비교해야 합니다
     */ 
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
  
    const client = new Client();
    client.email = email;
    client.password = hashedPassword;
    client.nickname = nickname;
    //body에서 받아온 고객 정보를 데이터베이스에 저장.
    await client.save();
  
    // 보통 생성시에 httpStatus 를 CREATED 로 전송합니다
    res.status(httpStatus.CREATED).json(
    { 
        id: client.id 
    });
};

router.post(
    "/",

    body("email").not().isEmpty(),
    body("password").not().isEmpty(),
    body("nickname").not().isEmpty(),
    validation,

    asyncWrapper(postClient)
);

export default router;