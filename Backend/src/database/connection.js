const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        const connectionInstance = await mongoose.connect(uri)
        console.log(`MongoDB connected! ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MongoDB connection error', error);
        process.exit(1)
    }
}

module.exports = connectDB