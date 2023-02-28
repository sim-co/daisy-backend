// passport/naverStrategy.js

//passport는 특이하게 strategy라는 전략을 사용한다.
//모든 passport의 플러그인들은 사용하려면 전략을 짜 주어야 합니다. 다음의 경우는 naver로 간편 로그인을하는 경우의 전략입니다

//done()
//done의 첫번째 인자는  DB조회 같은 때 발생하는 서버 에러를 넣는 곳입니다. 무조건 실패하는 경우에만 사용합니다
//두번째 인자는 성공했을때 리턴할 값을 넣는 곳이다.
//세 번째 인자는 언제 사용하나면, 사용자가 임의로 실패를 만들고 싶을 때 사용합니다. 
//첫 번째 인자를 사용하는 경우는 서버에서 에러가 났을 때 무조건 실패하는 경우라고 했죠. 
//세 번째 인자는 위에서 비밀번호가 틀렸다는 에러를 표현하고 싶을 때 사용하면 됩니다. 
//이것은 서버 에러도 아니고, 사용자가 임의로 만드는 에러이기 때문에, 직접 에러 메시지도 써주는 겁니다.

import passport from 'passport';
import User from '../../schemas/users';
import { Strategy as NaverStrategy } from "passport-naver"

export default() => {
   passport.use(
      new NaverStrategy( // Naver 전략을 세우기
         {
            clientID: process.env.NAVER_ID,
            clientSecret: process.env.NAVER_SECRET,
            session: true, // 세선 저장여부
            callbackURL: '/client/naver/callback',
         },
         async (accessToken, refreshToken, profile, done) => {
            try {
               //User DB에서 네이버로 간편 로그인한 유저가 있는지 검색.
               const exUser = await User.findOne({ snsId: profile._json.id, provider: 'naver' });
               // 이미 가입된 네이버 프로필이면 로그인 성공
               if (exUser) {
                  done(null, exUser) // 기존 가입한 유저의 정보를 담아 리턴
               } else {
                  // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                  const newUser = await User.create({
                     email: profile._json.email,
                     snsNickName: profile._json.nickname,
                     snsId: profile._json.id,
                     provider: 'naver',
                  });
                  done(null, newUser)
               }
               //로그인 에러 발생시 api에러 발생.
            } catch (error) {
               done(error);
            }
         },
      ),
   );
};


