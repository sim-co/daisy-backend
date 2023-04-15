import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import User from "../../schemas/users";
import APIError from "../util/apiError";
import errors from "../util/errors";
import asyncWrapper from "../util/asyncWrapper";
import { body } from "express-validator";
import validation from "../middleware/validation";
import { generateMyFriendCode, FriendCodeConnect } from "../controller/friend.controller"

const router = Router();

/**
 * @swagger
 * tags:
 *   name: friend
 *   description: 친구코드 생성 및 친구코드 연결
*/

/**
 * @swagger
 *
 * /friend/my-id:
 *  post:
 *    summary: "친구코드 생성"
 *    description: "본인의 친구코드를 생성해준다."
 *    tags: [friend]
 *    responses:
 *       "200":
 *          description: 추가된 데이터를 DB에 저장합니다.
 *          content:
 *             application/json:
 *                example:
 *                   my_connection_id: "ABC1234AB"
 * 
 */
router.post('/my-id', verifyToken, generateMyFriendCode);

/**
 * @swagger
 *
 * /friend/connect:
 *  post:
 *    summary: "친구코드 연결"
 *    description: "상대의 친구코드를 이용하여 친구 연결을 진행할 수 있다. (친구코드가 없을 시 오류)"
 *    tags: [friend]
 *    requestBody:
 *       required: true
 *       content:
 *          application/json:
 *             schema:
 *                type: object
 *                properties:
 *                   friendConnectionCode:
 *                      type: string
 *    responses:
 *       "200":
 *          description: 추가된 데이터를 DB에 나눠 저장합니다. (친구코드를 등록한사람, 친구에 의해 친구코드가 등록된 사람)
 *          content:
 *             application/json:
 *                example:
 *                   connection: true
 *                   connection_id: "ABCAB123AC"
 * 
 */
router.post('/connect', verifyToken, FriendCodeConnect, validation);

export default router;