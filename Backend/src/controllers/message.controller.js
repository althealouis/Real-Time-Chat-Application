const Message = require("../models/message.model")
// const jwt = require("jsonwebtoken")
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
        // console.log(req)
        const {userId} = req.params;
        // console.log("userID of the selected user :",userId);

        const userData = await getUserDataFromRequest(req)
        // console.log("current user data :",userData)
        const ourId = userData._id
        const messages = await Message.find({
            sender: {$in: [userId, ourId]},
            receiver: {$in: [userId, ourId]}
        }).sort({createdAt : 1})
        res.json(messages)
        // res.json({userId})
    } catch (error) {
        console.log("getMessages ERROR :: ", error);
    }
}

module.exports = { sendMessage, getMessages }