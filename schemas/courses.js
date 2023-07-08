import mongoose from 'mongoose';
const { Schema, Types } = mongoose;
 
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
            placeId: {
                type: Types.ObjectId,
                required: true
            },

            order: {
                type: Number,
                required: true
            }
        }],
    },
    {
        timestamps: true
    }
);
const Course = mongoose.model('Course', courseSchema);
export default Course