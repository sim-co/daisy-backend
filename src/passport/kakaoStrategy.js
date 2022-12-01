import passport from 'passport';
import User from '../../models/User';
import { Strategy as kakaoStrategy } from "passport-kakao";
// const kakaoStrategy = require('passport-kakao').Strategy;

module.exports = () => {
   passport.use(
      new kakaoStrategy(
         {
            clientID: process.env.KAKAO_ID,
            session: true, // 세선 저장여부
            callbackURL: '/client/kakao/callback',
         },
         async (accessToken, refreshToken, profile, done) => {
            console.log('kakao profile : ', profile);
            try {
               const exUser = await User.findOne({
                  where: { snsId: profile.id, provider: 'kakao' },
               });
               if (exUser) {
                  done(null, exUser); // 기존 가입한 유저의 정보를 담아 리턴
               } else {
                  const newUser = await User.create({
                    email: profile.email,
                    nick: profile.name,
                    snsId: profile.id,
                    provider: 'kakao',
                  });
                  done(null, newUser); // 회원가입한 유저의 정보를 담아 리턴
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
 

 