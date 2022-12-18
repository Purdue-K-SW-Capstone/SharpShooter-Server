import express, { Application } from "express";
import http from "http";
import path from "path";
import * as dotenv from "dotenv";
import { WebSocketServer } from "ws";
import router from "./index.router";

// set .env for Secret variables
dotenv.config({ path: path.join(__dirname, "../.env") });

// load application using express
const app: Application = express();

// add several function to application like body parser, router
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

// create server
const server = http.createServer(app);
const port = Number(process.env.HTTP_PORT);

// start server
server.listen(port, () => {
  console.log(`start! express server on port ${port}`);
});

// Create new WebSocket Server
const wss: WebSocketServer = new WebSocketServer({
  port: Number(process.env.WS_PORT),
});

// websocket function setting
wss.on("connection", (ws, req) => {
  console.log(`WS is opened! at port ${process.env.WS_PORT}`);

  // if websocket server get a message from pi2
  ws.on("message", (data: Buffer) => {
    // extract the json in binary data(raw data)
    const res = JSON.parse(data.toString());
    console.log(res);

    // when get the {start: 1}
    if ("start" in res) {
      console.log("get start");
      wss.clients.forEach((client) => {
        // jpg to byte code for test (temp)
        const msg = {
          start: 1,
        };
        client.send(JSON.stringify(msg));
      });
    } else if ("coordinate" in res) { // if get coordinate from pi2
      // {"coordinate": [x,y]}
      wss.clients.forEach((client) => { // send coordinates to connected clinets
        client.send(JSON.stringify(res)); // send the coordinate(json of string type)
      });
    } else if ("img" in res) {  // if get image from pi2
      wss.clients.forEach((client) => {
        client.send(res?.img); // send image to client (Blob type)
      });
    } else if ("size" in res) { // if get image size from pi2
      console.log(res);
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(res)); // send target size to client (Blob type)
      });
    } else if ("finish" in res) { // if get finish
      const msg = {
        finish: 1,
      };
      wss.clients.forEach((client) => {
        client.send(JSON.stringify(res)); // send target size to client (Blob type)
      });
    }
  });
});
