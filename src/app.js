import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import passportConfig from "./passport";
import session from "express-session";

const { sequelize } = require("../models");

const app = express();
const port = 3000;

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

dotenv.config();
app.use(session({ secret: '비밀코드', resave: true, saveUninitialized: false })); // 세션 활성화
app.use(express.json());
app.use(cors());
app.use(passport.initialize());// passport 구동
app.use(passport.session()); // 세션 연결
passportConfig(); // 이 부분 추가


//로그인 회원가입 기능
import client from "./route/client";
app.use("/client",client);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

export default app;