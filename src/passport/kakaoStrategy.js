import passport from 'passport';
import User from '../../schemas/users';
import { Strategy as kakaoStrategy } from "passport-kakao";
// const kakaoStrategy = require('passport-kakao').Strategy;

export default() => {
   passport.use(
      new kakaoStrategy(
         {
            clientID: process.env.KAKAO_ID,
            session: true, // 세선 저장여부
            callbackURL: '/client/kakao/callback',
         },
         async (accessToken, refreshToken, profile, done) => {
            try {
               const exUser = await User.findOne({ snsId: profile.id, provider: 'kakao' });
               if (exUser) {
                  done(null, exUser); // 기존 가입한 유저의 정보를 담아 리턴
               } else {
                  const newUser = await User.create({
                  //   email: profile.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                  });
                  const tokenNewUser = {
                     user : newUser,
                     accessToken : accessToken
                  }
                  done(null, tokenNewUser); // 회원가입한 유저의 정보를 담아 리턴
                  
               }
            //로그인 에러 발생시 api에러 발생.
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
};
 

 