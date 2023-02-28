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
    secret: 'secretKey',
    resave: true, // 세션이 수정되었을 때 자동으로 저장할지 여부
    saveUninitialized: false // 초기화되지 않은 세션을 저장할지 여부
  })
);
app.use(express.json());
app.use(cors());
app.use(passport.initialize());// passport 구동
app.use(passport.session()); // 세션 연결
passportConfig(); // 이 부분 추가 (패스포트를 설정)

import swaggerUi from 'swagger-ui-express';
import { specs } from "../module/swagger"
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @path {GET} http://localhost:3000/
*/
app.get("/", (req, res) => {
  res.send("Hello World");
})

// 라우터 모음


/**
 * @swagger
 * tags:
 *   name: client
 *   description: 간편로그인 및 추가정보 추가
*/
import client from "./route/client";
app.use("/client", client);

/**
 * @swagger
 * tags:
 *   name: friend-connect
 *   description: 친구코드 생성 및 친구코드 연결
*/
import friendconnect from "./route/friend-connect";
app.use("/friend-connect", friendconnect);

app.use((err, req, res, next) => {
  const { statusCode, errorCode, errorMsg } = err
  res.status(statusCode)
  res.json(err)
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});


export default app;