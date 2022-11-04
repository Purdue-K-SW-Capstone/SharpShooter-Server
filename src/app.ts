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

//multer 사용코드

const axios = require("axios");
const https = require("https");
const multer = require("multer");
const FormData = require("form-data");

const upload = multer();

router.post(
  "/upload",
  upload.single("filepond"), // multer를 이용하여 업로드 파일 처리

  async (req, res, next) => {
    try {
      // buffer를 FormData로 감쌈
      const formData = new FormData();
      formData.append("filepond", req.file.buffer, {
        filename: req.file.originalname,
      });

      // 다른 서버로 전송
      const result = await axios.post(
        `http://192.168.2.202:${CLIENT_PORT}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "Content-Length": formData.getLengthSync(),
            apikey: "apikey",
            host: "hosts",
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        }
      );
      res.status(200).json(result.data);
    } catch (err) {
      logger.error(err);
      res.status(500).send(`${err}`);
    }
  }
);
