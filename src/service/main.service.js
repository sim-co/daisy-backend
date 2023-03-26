import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import { generateAccessToken, generateRefreshToken } from "../util/jwt";
import User from "../../schemas/users";
import Course from '../../schemas/courses';

/**
 * access, refresh 토큰을 query에 담은 뒤 query값을 리턴
 * @param {String} myId
 */
const generateCourseService = async (myId) => {
    const userInfo = await User.findById(myId);
    //데이트 코스 추가하는 로직은 추후에 개발 예정
    //나중에 데이트 코스 개수 제한을 걸어서 유료화로 가져가는 것도 나쁘지 않을듯 합니다.
    console.log('dfsd');
    let course = ['김밥나라','구르는 파스타'];
    let courseUserList = [];
    courseUserList.push(userInfo.id);
    try { //친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }
        const course = await Course.create({ users: courseUserList, course: course });
        return course.id;
    } catch(e) {
        throw e;
    }
}

export default {
    generateCourseService,
}