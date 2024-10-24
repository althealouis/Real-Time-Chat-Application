require("dotenv").config({ path: "./.env" });
const Message = require("../models/message.model")
const jwt = require("jsonwebtoken")
const jwtSecret = process.env.ACCESS_TOKEN_SECRET; // Replace with your actual secret

const { getUserDataFromRequest } = require("./user.controller")


const sendMessage = async (req, res) => {
    try {
        // console.log(req.body)
        
} catch (error) {
        console.log("sendMessage ERROR :: ", error)
    }
}

const getMessages = async (req, res) => {
    try {
        // console.log("Request.headers --> ",req.headers)
        const {userId} = req.params;
        // console.log("userID of the selected user :",userId);

        const token = req.headers.authorization
        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: 'No token provided' }); // Handle case where token is not provided
        }

        // Verify the token
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(403).json({ message: 'Invalid token' }); // Handle invalid token
            }

            // If token is valid, get the current user's ID
            const ourId = userData._id;
            // console.log("Current user's ID:", ourId);

            // Fetch messages between the current user and the selected user
            const messages = await Message.find({
                sender: { $in: [userId, ourId] },
                receiver: { $in: [userId, ourId] }
            }).sort({ createdAt: 1 });

            // Send the messages as response
            res.json(messages);
        });
    } catch (error) {
        console.log("getMessages ERROR:", error);
        res.status(500).json({ message: 'Internal server error' }); // Handle any other errors
    }
}

module.exports = { sendMessage, getMessages }