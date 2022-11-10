// const ws = new WebSocket('ws://10.42.0.1:3030')
const ws = new WebSocket("ws://192.168.2.202:3030");

// ws.on('open', () => {
//     ws.send('Hello World')
// })

// ws.on('message', (data) => {
//     console.log(data)
// })

ws.onopen = () => {
  console.log("connected");
};

// ws.onmessage = (event) => {
//     console.log(event.data);
//     ws.send("Answer");
// };

receiveMessage = (event) => {
  console.log(event.data);
  const chat = document.createElement("div");
  const message = document.createTextNode(event.data);
  chat.appendChild(message);

  const chatLog = document.body;
  chatLog.appendChild(chat);
};

ws.onmessage = receiveMessage;
