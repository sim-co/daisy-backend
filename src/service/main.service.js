import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import Course from '../../schemas/courses';
import Location from '../../schemas/locations';

/**
 * access, refresh 토큰을 query에 담은 뒤 query값을 리턴
 * @param {String} myId
 */
const generateCourseService = async (myId, locationIds, courseName) => {
    const userInfo = await User.findById(myId);
    let courseUserList = [];
    courseUserList.push(userInfo.id);
    try { //친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }
        const course = await Course.create({ users: courseUserList, course: locationIds, courseName: courseName });
        return course.id;
    } catch(e) {
        throw e;
    }
}

const addLocationService = async (locationName, region, locationX, locationY, category) => {
    try { 
        const location = await Location.create({ 
            locationName, 
            region, 
            locationX, 
            locationY, 
            category});
        return location.id;
    } catch(e) {
        throw e;
    }
}

export default {
    generateCourseService,
    addLocationService
}