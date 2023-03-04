import { Router } from "express";
import passport, { use } from "passport";
import { verifyToken } from "../middleware/verifyToken";
import { generateAccessToken, generateRefreshToken } from "../util/jwt"
import User from '../../schemas/users';
import Course from '../../schemas/courses';
import querystring from "querystring";

import { body, param, query } from "express-validator";
import httpStatus, { NO_CONTENT } from "http-status";
import asyncWrapper from "../util/asyncWrapper";
import validation from "../middleware/validation";
import APIError from "../util/apiError";
import errors from "../util/errors";
import { type } from "os";

const router = Router();

router.post('/add-course',verifyToken,asyncWrapper( async(req, res) => {
    const userInfo = await User.findById(res.app.user.id);
    //데이트 코스 추가하는 로직은 추후에 개발 예정
    //나중에 데이트 코스 개수 제한을 걸어서 유료화로 가져가는 것도 나쁘지 않을듯 합니다.
    const newCourse = await Course.create({
        course:['김밥나라','구르는 파스타']
    });
    try {
        let courseList = userInfo.course_ids;
        courseList.push(newCourse.id);
        await User.findByIdAndUpdate(userInfo.id, {
            course_ids: courseList
        });
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            await User.findByIdAndUpdate(friendInfo.id, {
                course_ids: courseList
            });
        }
        
    } catch(e) {
        throw e;
    }
    res.send("코스 추가 완료");
}))

export default router;