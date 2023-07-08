import mongoose from 'mongoose';
const { Schema, Types } = mongoose;

const placeSchema = new Schema(
    {
        shopName: {
            type: String,
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
    }
);

const Place = mongoose.model('Places', placeSchema);
export default Place