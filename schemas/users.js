import mongoose from 'mongoose';
const { Schema } = mongoose;
 
const userSchema = new Schema({
  // _id 부분은 기본적으로 생략. 알아서 Object.id를 넣어줌
  email: {
    type: String,
    required: false, // null 여부
    unique: true, // 유니크 여부
  },
  nick: {
    type: String,
    required: true, // null 여부
    unique: true, // 유니크 여부
  },
  snsId: {
    type: String,
    required: false, // null 여부
    unique: true, // 유니크 여부
  },
  provider: {
    type: String,
    required: true, // null 여부
    unique: false, // 유니크 여부
  },
  accessToken: {
    type: String,
    required: true, // null 여부
    unique: false, // 유니크 여부
  },
  refreshToken: {
    type: String,
    required: true, // null 여부
    unique: false, // 유니크 여부
  },
});
const data = mongoose.model('User', userSchema);
export default data