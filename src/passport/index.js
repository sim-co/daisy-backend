// passport에 대한 설명은 이 주소를 참고하시면 이해하기 더 편하실것 같습니다. 
//https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457

import passport from 'passport';
// import local from './localStrategy'; //로컬 서버로 로그인할때
import naver from './naverStrategy'; // 네이버서버로 로그인할때
import kakao from './kakaoStrategy'; // 카카오서버로 로그인할때
import google from './googleStrategy'; // 구글서버로 로그인할때
import User from '../../schemas/users';

// 세션은 방문자의 요청에 따른 정보를 방문자 메모리에 저장하는 것이 아닌 
// 웹 서버가 세션 아이디 파일을 만들어 서비스가 돌아가고 있는 서버에 저장을 하는것을 말한다.

export default() => {
   // 로그인 성공시 user 객체를 전달받아 세션(정확히는 req.session.passport.user에 저장함.
   passport.serializeUser((user, done) => { //Startegy 성공 시 호출됨.
      done(null, user.id); // 여기의 user가 deserializeUser의 첫 번째 매개변수로 이동
   });

   //실제 서버로 들어오는 요청마다 세션 정보(serializeUser에서 저장됨)를 실제 DB의 데이터와 비교합니다.
   //해당하는 유저 정보가 있으면 done의 두 번째 인자를 req.user에 저장하고, 요청을 처리할 때 유저의 정보를 req.user를 통해서 넘겨줍니다. 
   passport.deserializeUser((id, done) => {
      console.log(id);
      console.log("실행");
      User.findById(id) //유저 DB에 유저의 아이디가 존재하는지 검색 
         .then(user => done(null, user))
         .catch(err => done(err));
   });
   // local();

   naver(); // 네이버 전략 등록 naverStrategy.js파일로 넘어감.
   kakao();
   google();

};
