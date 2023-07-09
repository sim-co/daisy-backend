import APIError from "../util/apiError";
import errors from "../util/errors";
import querystring from "querystring";
import User from "../../schemas/users";
import Course from '../../schemas/courses';
import Place from "../../schemas/places";

/**
 * 데이트 코스 추가 - 서비스
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

/**
 * 데이트 코스 보여주기 - 서비스
 */
const viewCourseService = async (myId) => {
    try {
        const userInfo = await User.findById(myId);

        console.log("hi",userInfo);
        let courseUserList = [];
        courseUserList.push(userInfo.id);
            
        // 친구 동기화
        if (userInfo.connection === true) {
            const friendInfo = await User.findOne({ my_connection_id: userInfo.connection_id})
            courseUserList.push(friendInfo.id);
        }
        
        const course = await Course.findOne({users : myId});
        console.log(course);
        return course;

    } catch(e) {
        throw e;
    }
}

/**
 * 데이트 코스 수정 - 서비스
 */
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

        const course = await Course.findOne({users : myId});
        course.users = courseUserList;
        course.courseName = courseName;
        course.course = courseData;
        await course.save();
        return course;

    } catch(e) {
        throw e;
    }
}

/**
 * 데이트 코스 삭제 - 서비스
 */
const deleteCourseService = async (myId, courseId) => {
        if(!await Course.findOne({users : myId})) {
            throw new APIError(
                errors.COURSE_DELETE_ERROR.statusCode,
                errors.COURSE_DELETE_ERROR.errorCode,
                errors.COURSE_DELETE_ERROR.errorMsg,
            )
        };
        const course = await Course.deleteOne({ _id: courseId });
        console.log(course);
        return course;
}

/**
 * 장소검색 - 서비스
 */
const searchLocationService = async (locationId) => {
    try{
        const coordinate = await Place.findById(locationId);
        return coordinate;
    } catch(error) {
        throw new APIError(
            errors.LOCATION_NOTFOUND_ERROR.statusCode,
            errors.LOCATION_NOTFOUND_ERROR.errorCode,
            errors.LOCATION_NOTFOUND_ERROR.errorMsg,
        )
    }
}

/**
 * 좌표범위 내 장소 검색 - 서비스
 */
const getPlacesInLatLngRangeService = async (coordinateX1, coordinateY1, coordinateX2, coordinateY2) => {
    // 범위 내 검색
    const locations = Place.find({
      coordinateX: { $gte: coordinateX2, $lte: coordinateX1 },
      coordinateY: { $gte: coordinateY2, $lte: coordinateY1 }
    })
    return locations;
}

/**
 * 장소 추가 - 서비스
 */
const registLocationService = async (shopName, coordinateX, coordinateY) => {
    try{
        const location = await Place.create({
            shopName, 
            coordinateX, 
            coordinateY
        });
        return location;
    } catch(error) {

    }
}

export default {
    generateCourseService,
    deleteCourseService,
    modifyCourseService,
    viewCourseService,
    searchLocationService,
    getPlacesInLatLngRangeService,
    registLocationService
}