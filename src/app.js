import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import { sequelize } from "../models";


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

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
dotenv.config();

//로그인 회원가입 기능
import client from "./route/client";
app.use("/client",client);


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

export default app;