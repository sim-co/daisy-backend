import asyncWrapper from "../util/asyncWrapper";
import httpStatus from "http-status";
import { courseService } from "../service";
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
    const course = await courseService.generateCourseService({myId, courseName, courseData});
    return res.status(httpStatus.OK).json({ course });
}

// 코스 보여주기
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const viewCourseInner = async (req, res) => {
    const myId = res.app.user.id;
    const viewCourseCode = await courseService.viewCourseService(myId);
    return res.status(httpStatus.OK).json({ viewCourseCode });
}

// 코스 수정
/**
 * 
 * @param {Request} req 
 * @param {Response} res
*/
const modifyCourseInner = async (req, res) => {
    const myId = res.app.user.id;
    const courseName = req.body.courseName;
    const courseData = req.body.course;
    const course = await courseService.modifyCourseService({myId, courseName, courseData});
    return res.status(httpStatus.OK).json({ course });
}

// 코스 삭제
/**
 * 
 * @param {Request} req 
 * @param {Response} res
*/
const deleteCourseInner = async (req, res) => {
    const myId = req.params.myId;
    const courseId = req.params.courseId;
    const locationCode = await courseService.deleteCourseService(myId, courseId);
    return res.status(httpStatus.OK).json({ locationCode });
}


// 장소 생성
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const addLocationInner = async (req, res) => {
    const { locationName, region, locationX, locationY, category } = req.body;
    const locationCode = await courseService.addLocationService(locationName, region, locationX, locationY, category);
    return res.status(httpStatus.OK).json({ locationCode });
}

export const generateCourse = asyncWrapper(generateCourseInner);
export const addLocation = asyncWrapper(addLocationInner);
export const deleteCourse = asyncWrapper(deleteCourseInner);
export const modifyCourse = asyncWrapper(modifyCourseInner);
export const viewCourse = asyncWrapper(viewCourseInner);