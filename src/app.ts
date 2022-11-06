import express, { Application } from "express";
import { WebSocketServer } from "ws";
import http from "http";
import path from "path";
import * as dotenv from "dotenv";

// import cookieParser from "cookie-parser";

import router from "./index-router";

dotenv.config({ path: path.join(__dirname, "../.env") });

const app: Application = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

const server = http.createServer(app);
const port = Number(process.env.HTTP_PORT);

server.listen(port, () => {
  console.log(`start! express server on port ${port}`);
});

const wss: WebSocketServer = new WebSocketServer({
  port: Number(process.env.WS_PORT),
});

wss.on("connection", (ws, req) => {
  console.log(`WS is opened! at port ${process.env.WS_PORT}`);

  // console.log(wss.clients);
  ws.on("message", (data: Buffer) => {
    // const time = data.readFloatBE();
    // console.log("time : " + data.readFloatBE());

    const time = data.toString();
    console.log("get : " + time);

    wss.clients.forEach((client) => {
      client.send(time);
    });
  });
});

//이미지 바이너리로 인코딩
const fs = require('fs');
let readFile = fs.readFileSync("../pictureTarget.jpg"); //이미지 파일 읽기
let encode = Buffer.from(readFile).toString('base64'); //파일 인코딩
let makeEncodeFile = fs.writeFileSync('./encodeFile', encode) //인코딩 파일 만들기
let readFile2 = fs.readFileSync('./encodeFile', 'base64'); //인코딩된 파일 읽기
let decode = Buffer.from(encode, 'base64'); //파일 디코딩
let makeDecodeFile = fs.writeFileSync('./decode.jpg', decode); //디코딩된 파일 만들기