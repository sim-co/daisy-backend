import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import passportConfig from "./passport";
import session from "express-session";
import connect from "../schemas";
 
const app = express();
const port = 3000;

dotenv.config();

// 몽고 디비 연결
connect(); 

// 세션 활성화
app.use(
  session({
    secret: '비밀코드',
    resave: true,
    saveUninitialized: false
  })
);
app.use(express.json());
app.use(cors());
app.use(passport.initialize());// passport 구동
app.use(passport.session()); // 세션 연결
passportConfig(); // 이 부분 추가 (패스포트를 설정)


import { specs } from "../module/swagger"
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @path {GET} http://localhost:3000/
 */
app.get("/", (req, res) => {
  res.send("Hello World");
})

/**
 * @swagger
 * tags:
 *   name: client
 *   description: 유저 추가 수정 삭제 조회
 */
import client from "./route/client";
app.use("/client", client);

app.use((err, req, res, next) => {
  const { statusCode, errorCode, errorMsg } = err
  res.status(statusCode)
  res.json(err)
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

export default app;