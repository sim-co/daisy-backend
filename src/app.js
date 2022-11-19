import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

dotenv.config();

//로그인 회원가입 기능
import client from "./route/client";
app.use("/client",client);


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

export default app;