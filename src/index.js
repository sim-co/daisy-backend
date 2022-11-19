import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) =>{
    res.send("기본페이지");
});

