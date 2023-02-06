import mongoose from 'mongoose';
const { Schema } = mongoose;
 
const userSchema = new Schema({
  // _id 부분은 기본적으로 생략. 알아서 Object.id를 넣어줌
  // 추가 데이터 넣기 전 default
  email: {
    type: String,
    required: false, // null 여부 (true면 null값이 들어갈 수 없음)
    unique: false, // 유니크 여부 (true면 값이 한개 이상 중복될 수 없음)
  },
  snsNickName: {
    type: String,
    required: true,
    unique: false,
  },
  snsId: {
    type: String,
    required: true, 
    unique: false,
  },
  provider: {
    type: String,
    required: true, 
    unique: false,
  },

  // Token
  accessToken: {
    type: String,
    required: false, 
    unique: false,
  },
  refreshToken: {
    type: String,
    required: false, 
    unique: false,
  },

  // 추가데이터 여부 확인
  loginLog: {
    type: Boolean,
    required: true, 
    unique: false,
    default : false // 기본값
  },

  // 추가 데이터
  nickName: {
    type: String,
    required: false, 
    unique: false,
  },
  gender: {
    type: String,
    required: false, 
    unique: false,
  },
  local: {
    type: String,
    required: false, 
    unique: false,
  },
  birthDay: {
    type: String,
    required: false, 
    unique: false,
  },

  // 친구 연결
  connection: {
    type: Boolean,
    required: true, 
    unique: false,
    default : false
  },
  connection_id: {
    type: String,
    required: false, 
    unique: false,
  },

});
const data = mongoose.model('User', userSchema);
export default data