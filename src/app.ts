import express, { Application } from "express";
import http from "http";
import path from "path";
import * as dotenv from "dotenv";
import fs from "fs";
import { WebSocketServer } from "ws";
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

// Create new WebSocket Server
const wss: WebSocketServer = new WebSocketServer({
  port: Number(process.env.WS_PORT),
});

// 전송받는 데이터 마다 웹소켓 포트를 다르게 해서 서버를 열까?
wss.on("connection", (ws, req) => {
  console.log(`WS is opened! at port ${process.env.WS_PORT}`);
  ws.on("message", (data: Buffer) => {
    // extract the json in binary data(raw data)
    const res = JSON.parse(data.toString());
    console.log(res.start);

    // when get the {start: 1}
    if ("start" in res) {
      console.log("start 받음");
      wss.on("connection", (ws, req) => {
        wss.clients.forEach((client) => {
          // jpg to byte code for test (temp)
          //test Code
          // const img = fs.readFileSync("./img/pictureTarget.jpg");
          // setTimeout(() => {
          //   client.send(img);
          //   console.log("보낸 이미지 데이터" + img);
          //   console.log("이미지 전송하였습니다.");
          // }, 1000);
          // //real code
          const msg = {
            start: 1,
          };
          client.send(JSON.stringify(msg));
        });
      });
    } else if ("coordinate" in res) {
      wss.on("connection", (ws, req) => {
        // {"coordinate": x, "time": x.xx}
        wss.clients.forEach((client) => {
          client.send(data); // send the coordinate(json of string type)
        });
      });
    } else if ("image" in res) {
      wss.on("connection", (ws, req) => {
        // {"image": Buffer}
        wss.clients.forEach((client) => {
          console.log("보낸 이미지 데이터" + res?.image);
          console.log("이미지 전송하였습니다.");
          client.send(res?.image); // send image to client (Blob type)
        });
      });
    }

    // This code is for check the Time
    // const time = data.readFloatBE();
    // console.log("time : " + data.readFloatBE());
  });
});
