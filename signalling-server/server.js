const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;
const app = express();

const port = process.env.PORT || 9000;

//initialize a http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

// connected clients
let users = {};



//alert newly connected client of successful connection
const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message));
};
//alert connected clients of new connecting client
const sendToAll = (clients, type, { id, name: userName }) => {
  Object.values(clients).forEach(client => {
    if (client.name !== userName) {
      client.send(
        JSON.stringify({
          type,
          user: { id, userName }
        })
      );
    }
  });
};


//when connection starts
wss.on("connection", ws => {
  //send immediate a feedback to the incoming connection
  ws.send(
    JSON.stringify({
      type: "connect",
      message: "Well hello there, I am a WebSocket server"
    })
  );
  
  //when a message is sent
  ws.on("message", msg => {
    let data;
    //first validate message as JSON
    try {
      data = JSON.parse(msg);
    } catch (e) {
      console.log("Invalid JSON");
      data = {};
    }
    //then respond based on message type 
    const { type, name, offer, answer, candidate } = data;
    //Handle message by type
    switch (type) {
      //for initial connection login
      case "login":
        //First check if username is available
        if (users[name]) {
          //if taken, return rejection message 
          sendTo(ws, {
            type: "login",
            success: false,
            message: "Username is unavailable"
          });
        } else {
          //if available, return an id and the names of all logged in clients
          const id = uuidv4();
          const loggedIn = Object.values(
              users
          ).map(({ id, name: userName }) => ({ id, userName }));
          //and register connection in users object
          users[name] = ws;
          ws.name = name;
          ws.id = id;
          sendTo(ws, {
            type: "login",
            success: true,
            users: loggedIn
          });
          //notify all connected clients of the new user
          sendToAll(users, "updateUsers", ws);
        }
      break;
      //for connection offer between users
      case "offer":
        //Check if user exists to send offer
        const offerRecipient = users[name];
        //if exists, send offer type containing dispatching username
        if (!!offerRecipient) {
          sendTo(offerRecipient, {
            type: "offer",
            offer,
            name: ws.name
          });
        } else {
          //otherwise notify dispatcher that user does not exists
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
      break;
      case "answer":
        //Check if user who sent request still exists
        const answerRecipient = users[name];
        //if exists, submit connection offer answer
        if (!!answerRecipient) {
          sendTo(answerRecipient, {
            type: "answer",
            answer,
          });
        } else {
          //otherwise notify that user does not exist
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
      break;
      //for negotiating connection between users
      case "candidate":
        //Check if user to send candidate to exists
        const candidateRecipient = users[name];
        if (!!candidateRecipient) {
          sendTo(candidateRecipient, {
            type: "candidate",
            candidate
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`
          });
        }
      break;
      //for when user disconnects
      case "leave":
        //notify others of disconnected user
        sendToAll(users, "leave", ws);
      break;
      //if error or invalid type return rejection
      default:
        sendTo(ws, {
          type: "error",
          message: "Command not found: " + type
        });
      break;
    }       
  });
  //when user disconnects, dispatch leave message
  ws.on("close", function() {
    delete users[ws.name];
    sendToAll(users, "leave", ws);
  });
});

//start our server
server.listen(port, () => {
  console.log(`Signalling Server running on port: ${port}`);
});