import passport from 'passport';
import User from '../../models/User';
import { Strategy as googleStrategy } from "passport-google-oauth20";
 
module.exports = () => {
   passport.use(
      new googleStrategy(
         {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            session: true, // 세선 저장여부
            callbackURL: '/client/google/callback',
         },
         async (accessToken, refreshToken, profile, done) => {
            console.log('google profile : ', profile);
            try {
               const exUser = await User.findOne({
                  where: { snsId: profile.id, provider: 'google' },
               });
               if (exUser) {
                  done(null, exUser); // 기존 가입한 유저의 정보를 담아 리턴
               } else {
                  const newUser = await User.create({
                    email: profile._json.email,
                    nick: profile._json.email,
                    snsId: profile.id,
                    provider: 'google',
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
 

 