import mongoose from 'mongoose';
const { Schema } = mongoose;
 
const courseSchema = new Schema({
    // user: {
    //     type:String,
    //     required: true,
    // },
    course: {
        type: Array,
        required: true, // null 여부 (true면 null값이 들어갈 수 없음)
        unique: false, // 유니크 여부 (true면 값이 한개 이상 중복될 수 없음)
    },
});
const data = mongoose.model('Courses', courseSchema);
export default data