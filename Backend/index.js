require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/database/connection");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const { WebSocketServer } = require("ws");
const { log } = require("node:console");
const jwt = require("jsonwebtoken");

const port = process.env.PORT;
const mongodb_uri = process.env.MONGODB_URI;

const app = express();
const server = createServer(app);
// Allow CORS from any origin. Update this if you want to restrict access to a specific
// domain or IP address.
const wss = new WebSocketServer({ server });

//Middlewares
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the API</h1>");
});

//* ROUTES ----
const userEndpoint = require("./src/routes/user.routes");
const messageEndpoint = require('./src/routes/message.routes');

//* ENDPOINTS ----
app.use("/api/v1/", userEndpoint);
app.use("/api/v2/", messageEndpoint);


const Message = require("./src/models/message.model");


// starting the wss connection
wss.on("connection", (socket, request) => {

    function notifyAboutOnlineUsers () {
        [...wss.clients].forEach((client) => {
            client.send(
            JSON.stringify({
                onlineUsers: [...wss.clients].map((connectedUsers) => ({
                userId: connectedUsers.userId,
                username: connectedUsers.username,
                })),
            })
            );
        });
    }

    socket.isAlive = true;

    socket.timer = setInterval(() => {
        socket.ping();
        socket.deathTimer = setTimeout(() => {
            socket.isAlive = false;
            socket.terminate();
            notifyAboutOnlineUsers();
            // console.log("client disconnected due to some issue.")
        }, 1000);
    }, 5000);

    socket.on('pong', () => {
        clearTimeout(socket.deathTimer)
    })

  //extracting the cookies from request.headers
  //read username and id from cookie for the connection
    const cookies = request.headers.cookie || "";

    const rawCookies = cookies
    .split(";")
    .find((str) => str.startsWith("Access-Token="));
  // log(rawCookies);

    if (rawCookies) {
        const token = rawCookies.split("=")[1];
        // log(token);
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // log(decodedToken)

        //destructure the information
        const { username, _id: userId } = decodedToken;
        socket.username = username;
        socket.userId = userId;
    }
  // log([...wss.clients].map(client => client.username))

    
    //for messages -> 
    socket.on("message", async (message) => {
        const { messageData } = JSON.parse(message.toString());
        // log(messageData);
        const { text, receiver } = messageData;
        // log(text)
        // log(receiver)
        if (text && receiver) {
            log(receiver)
            // log(author)
            const messageDoc = await Message.create({
                sender: socket.userId,
                receiver: receiver,
                text
            })
            let receiverSocket = [...wss.clients].find(
                (client) =>
                client.userId && client.userId === receiver
            );
            if (!receiverSocket) return;
            receiverSocket.send(
                JSON.stringify({
                    text: text,
                    sender: socket.userId,
                    receiver: receiver,
                    timestamp: new Date().toISOString(),
                    id: messageDoc._id
                })
            );
        }

        // if (text && author && receiver) {
        //     [...wss.clients]
        //     .filter(client => client.username === receiver)
        //     .forEach(client => client.send(JSON.stringify({
        //         text
        //     })))
        // }
    });

  //notify everyone about the connected users
    notifyAboutOnlineUsers();
});

// closing the wss connection
// wss.on('close', data => {
//     console.log(`Client disconnected ${data}`);
// })

const start = async () => {
    try {
        await connectDB(mongodb_uri);
        server.listen(port, () => {
        log(`Server started on http://localhost:${port}`);
        });
    } catch (error) {
        log(error);
    }
};

start();
