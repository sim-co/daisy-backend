import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import Course from '../../schemas/courses';
import { NOTFOUND } from "dns";

/**
 * 데이트 코스 추가
 * @param {String} myId
 */

const generateCourseService = async ({myId, courseName, courseData}) => {
    try {
        const userInfo = await User.findById(myId);
        //데이트 코스 추가하는 로직은 추후에 개발 예정
        //나중에 데이트 코스 개수 제한을 걸어서 유료화로 가져가는 것도 나쁘지 않을듯 합니다.
        let courseUserList = [];
        courseUserList.push(userInfo.id);
            
        // 친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }
        
        const course = await Course.create({
            users: courseUserList,
            courseName: courseName,
            course: courseData,
        });
        return course;

    } catch(e) {
        throw e;
    }
}

const viewCourseService = async ({myId}) => {
    try {
        const userInfo = await User.findById(myId);

        let courseUserList = [];
        courseUserList.push(userInfo.id);
            
        // 친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }

        const course = await Course.findById(myId);
        return course;

    } catch(e) {
        throw e;
    }
}

const modifyCourseService = async ({myId, courseName, courseData}) => {
    try {
        const userInfo = await User.findById(myId);
        
        let courseUserList = [];
        courseUserList.push(userInfo.id);
            
        // 친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }

        const course = await Course.findById(courseId);
        course.users = courseUserList;
        course.courseName = courseName;
        course.course = courseData;
        await course.save();
        return course;

    } catch(e) {
        throw e;
    }
}

const deleteCourseService = async (myId, courseId) => {
    try{
        const course = await Course.findByIdAndRemove({ _id: courseId, users: { $in: [myId] } });
    } catch(error) {
        throw new APIError(
            errors.COURSE_DELETE_ERROR.statusCode,
            errors.COURSE_DELETE_ERROR.errorCode,
            errors.COURSE_DELETE_ERROR.errorMsg,
        )
    }
}

const searchLocationService = async (locationId) => {
    try{
        const coordiante = await Course.findById(locationId);
    } catch(error) {
        throw new APIError(
            errors.LOCATION_NOTFOUND_ERROR.statusCode,
            errors.LOCATION_NOTFOUND_ERROR.errorCode,
            errors.LOCATION_NOTFOUND_ERROR.errorMsg,
        )
    }
}

export default {
    generateCourseService,
    deleteCourseService,
    modifyCourseService,
    viewCourseService,
    searchLocationService
}