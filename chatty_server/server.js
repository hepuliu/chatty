// server.js

const express = require('express');
const WebSocket = require('ws');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

let totalUsers = 0;

getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  totalUsers++;

  let color = getRandomColor();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'incomingUsers',
        content: totalUsers
      }));
    }
  })

  ws.on('message', (data) => {
    console.log('received: %s', data);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        message = JSON.parse(data);
        message.type = message.type.replace('post', 'incoming');
        message.color = color;
        console.log("sending: %s", JSON.stringify(message));
        client.send(JSON.stringify(message));
      }
    })
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    totalUsers--;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'incomingUsers',
          content: totalUsers
        }));
      }
    })
    console.log('Client disconnected')
  });
});
