require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/database/connection");
const cookieParser = require("cookie-parser");
const { createServer } = require("node:http");
const { WebSocketServer } = require("ws");
const { log } = require("node:console");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

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
app.use("/uploads/", express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the API</h1>");
});

//* ROUTES ----
const userEndpoint = require("./src/routes/user.routes.js");
const messageEndpoint = require('./src/routes/message.routes.js');

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
        const { text, receiver, author, file } = messageData;
        let filename = null;
        if (file) {
            // Get file extension
            const parts = file.name.split('.');
            const extension = parts[parts.length - 1];
            // Generate a unique filename
            filename = uuidv4() + '.' + extension;
            // Secure file path using `path.join`
            const uploadPath = path.join(__dirname, 'public', filename);
            // Convert base64 to Buffer
            const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
            // Save the file locally
            fs.writeFile(uploadPath, bufferData, (err) => {
                if (err) {
                    console.error('Error saving file:', err);
                } else {
                    console.log('File Saved:', uploadPath);
                }
                });
        }
        //* save message to the database
        if ((text || file) && receiver && author) {

            const messageDoc = await Message.create({
                sender: socket.userId,
                receiver: receiver,
                text,
                file : file ? filename : null
            })

            let receiverSocket = [...wss.clients].find(
                (client) =>
                client.userId && client.userId === receiver
            );

            if (!receiverSocket) return;
            receiverSocket.send(
                JSON.stringify({
                    sender: socket.userId,
                    receiver: receiver,
                    text: text,
                    file: file ? filename : null,
                    timestamp: new Date().toISOString(),
                    id: messageDoc._id
                })
            );
        }
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
