import mongoose from 'mongoose';
const { Schema } = mongoose;
 
const locationSchema = new Schema(
    {
        locationName: {
            type:String,
            required: true,
        },
        region: {
            type:String,
        },
        locationX: {
            type: Number,
            required: true, // null 여부 (true면 null값이 들어갈 수 없음)
        },
        locationY: {
            type: Number,
            required: true, // null 여부 (true면 null값이 들어갈 수 없음)
        },
        category: { 
            type: String, // 근데 이거 타입스크립트 처럼 타입 지정하고 싶어요.
            required: true,
        },
    },
);
const data = mongoose.model('Locations', locationSchema);
export default data