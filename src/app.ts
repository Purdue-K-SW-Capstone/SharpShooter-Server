import express, { Application } from "express";
import http from "http";
import path from "path";
import * as dotenv from "dotenv";
import fs from "fs";
import { WebSocketServer } from "ws";
import router from "./index.router";

// TypeORM
import { AppDataSource } from "./ormconfig";

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

//TypeORM
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.log("Error during Data Source initialization : ", err);
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
    console.log(res);

    // when get the {start: 1}
    if ("start" in res) {
      console.log("start 받음");
      wss.clients.forEach((client) => {
        // jpg to byte code for test (temp)
        const msg = {
          start: 1,
        };
        client.send(JSON.stringify(msg));
      });
    } else if ("coordinate" in res) {
      // {"coordinate": [x,y]}
      console.log("실제 데이터" + res);
      console.log("타입은? " + typeof res);
      wss.clients.forEach((client) => {
        console.log("변형 후 " + JSON.stringify(res));
        client.send(JSON.stringify(res)); // send the coordinate(json of string type)
      });
    } else if ("img" in res) {
      //real code
      wss.clients.forEach((client) => {
        client.send(res?.img); // send image to client (Blob type)
      });
    } else if ("size" in res) {
      console.log("서버에서 사진 사이즈 보냄");
      console.log(res);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(res)); // send target size to client (Blob type)
      });
    } else if ("finish" in res) {
      console.log("새로운 타깃을 받기 위해 메인페이지로 복귀");
      const msg = {
        finish: 1,
      };
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(res)); // send target size to client (Blob type)
      });
    }
    // This code is for check the Time
    // const time = data.readFloatBE();
    // console.log("time : " + data.readFloatBE());
  });
});
