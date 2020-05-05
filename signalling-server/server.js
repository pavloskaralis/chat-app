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
        const { type, name } = data;
        //Handle message by type
        switch (type) {
            //for login type
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
            //if error or invalid type return rejection
            default:
                sendTo(ws, {
                    type: "error",
                    message: "Command not found: " + type
                });
            break;
        }
        
    });
  //send immediate a feedback to the incoming connection
  ws.send(
    JSON.stringify({
      type: "connect",
      message: "Well hello there, I am a WebSocket server"
    })
  );
});

//start our server
server.listen(port, () => {
  console.log(`Signalling Server running on port: ${port}`);
});