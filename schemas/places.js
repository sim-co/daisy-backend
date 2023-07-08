import mongoose from 'mongoose';
const { Schema } = mongoose;

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
    },
    {
        timestamps: true
    }
);

const Place = mongoose.model('Place', placeSchema);
export default Place