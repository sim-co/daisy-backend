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
    const { locationIds, courseName } = req.body;
    const courseCode = await mainService.generateCourseService(myId, locationIds, courseName);
    return res.status(httpStatus.OK).json({ courseCode });
}

// 장소 생성
/**
 * 
 * @param {Request} req 
 * @param {Response} res
 */
const addLocationInner = async (req, res) => {
    const { locationName, region, locationX, locationY, category } = req.body;
    const locationCode = await mainService.addLocationService(locationName, region, locationX, locationY, category);
    return res.status(httpStatus.OK).json({ locationCode });
}

export const generateCourse = asyncWrapper(generateCourseInner);
export const addLocation = asyncWrapper(addLocationInner);