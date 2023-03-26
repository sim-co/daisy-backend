import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { mainService } from "../service";
import { Request, Response } from "express";

// 코스 생성
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const generateCourseInner = async (req, res) => {
    const myId = res.app.user.id;
    console.log('myId:', myId);
    const courseCode = await mainService.generateCourseService(myId);
    // return res.status(httpStatus.OK);
    console.log(courseCode);
    console.log('dfsd12');
    return res.json({courseCode});
    // return res.status(httpStatus.OK).json({ courseCode });
}

export const generateCourse = asyncWrapper(generateCourseInner);