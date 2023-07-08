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
    // const myId = req.params.myId;
    const myId = res.app.user.id;
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

// 장소 검색 API
const searchLocationInner = async (req, res) => {
    const { locationId } = req.body;
    const locationCoordinate = await courseService.searchLocationService(locationId);
    return res.status(httpStatus.OK).json({ locationCoordinate });
}


// 위, 경도 범위에 따라 해당 범위 내부에 있는 장소들을 가져오는 API
const getPlacesInLatLngRangeInner = async (req, res) => {
    const { coordinateX1, coordinateY1, coordinateX2, coordinateY2 } = req.body;
    const locations = await courseService.getPlacesInLatLngRangeService(coordinateX1, coordinateY1, coordinateX2, coordinateY2);
    return res.status(httpStatus.OK).json({ locations });
} 

// 장소 등록 API(임의등록)
const registLocationInner = async (req, res) => {
    const { shopName, coordinateX, coordinateY } = req.body;
    const location = await courseService.registLocationService(shopName, coordinateX, coordinateY);
    return res.status(httpStatus.OK).json({ location });
}


export const generateCourse = asyncWrapper(generateCourseInner);
export const addLocation = asyncWrapper(addLocationInner);
export const deleteCourse = asyncWrapper(deleteCourseInner);
export const modifyCourse = asyncWrapper(modifyCourseInner);
export const viewCourse = asyncWrapper(viewCourseInner);
export const getPlacesInLatLngRange = asyncWrapper(getPlacesInLatLngRangeInner);
export const searchLocation = asyncWrapper(searchLocationInner);
export const registLocation = asyncWrapper(registLocationInner);