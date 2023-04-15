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
    const courseName = req.body.courseName;
    const courseData = req.body.course;
    const course = await mainService.generateCourseService({myId, courseName, courseData});
    return res.status(httpStatus.OK).json({ course });
}

export const generateCourse = asyncWrapper(generateCourseInner);