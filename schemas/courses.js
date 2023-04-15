import mongoose from 'mongoose';
const { Schema } = mongoose;
 
const courseSchema = new Schema(
    {
        users: {
            type: Array,
            required: true,
        },
        courseName: {
            type: String,
            required: false,
        },
        course: [{
            shopName: {
                type: String,
                required: true,
            },
            order: {
                type: Number,
                required: true,
            },
            coordinateX: {
                type: Number,
                required: true,
            },
            coordinateY: {
                type: Number,
                required: true,
            }
        }],
    },
    {timestamps: true}
);
const data = mongoose.model('Courses', courseSchema);
export default data