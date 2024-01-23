const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const jwtSecret = process.env.ACCESS_TOKEN_SECRET

const registerUser = async (req, res) => {
    try {
        //destructuring the fields from request's body
        const { username, password } = req.body;

        //check if the username is available or not
        const usernameNotAvailable = await User.findOne({ username });
        if(usernameNotAvailable) {
            res.status(400).json({
                error: "username already taken, try a different one!"
            });            //400 -> Bad Request
            console.log("username already taken, try a different one!");
        }

        //hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating the record in database
        const userGeneration = await User.create({ username, password:hashedPassword });

        //handle the response based on the result of userGeneration
        if(userGeneration) {
            console.log("User Created!");
            res.status(201).json({
                _id: userGeneration.id,
                username: userGeneration.username,
                password: userGeneration.password,
                message: "User Created"
            });
        } else {
            res.status(400);
            console.log("unable to create a new user.")
        }


    } catch (error) {
        console.log("Registration error :: ", error);
    }
};

// to get all the users data from the database
const getAllUsers = async (req, res) => {
    try {
        const usersData = await User.find({}, { '_id':1, username: 1 });
        if(usersData) {
            res.status(200).json(usersData);
        } else {
            res.status(500).json({message:"Error Fetching Users Data."});
        }
    } catch (error) {
        console.log("getAllUsers error :: ", error);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        //check for missing credentials
        if (!username || !password) {
            return res.status(400).json({
                message: "Missing Credentials!"
            });
        }

        let user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid Username or Password!"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("Invalid username or password")
            res.status(401).json({
                message: "Invalid Username or Password!"
            })
        }

        //create and assign a token
        const accessToken = jwt.sign(
            {
                username: user.username,
                _id: user._id
            },
            jwtSecret,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );

        // if (accessToken) {
        //     res.status(200).json({
        //         message: "successfully logged in!",
        //         Access_Token: accessToken
        //     });
        //     console.log("Successfully logged in");
        // } else {
        //     res.status(401).json({
        //         message: "unable to create a token, check your password"
        //     })
        //     console.log("unable to create a token");
        // }

        //* comment these if not working
        if (!accessToken) {
            res.status(401).json({
                message: "unable to create a token, check your password"
            })
            throw new Error('No Token created');
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        console.log(`${user.username} has logged in`)

        return res
        .status(200)
        .cookie('Access-Token', accessToken, options)
        .json({
            message: "Logged In Successfully!",
            userID : user._id,
            token: accessToken
        })

    } catch (error) {
        console.log("login error :: ", error);
    }
};

const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id
        // console.log("User Id of the current user",userId)

        const options = {
            httpOnly: true,
            secure: true
        }
        console.log("user logged out!")

        return res
        .status(200)
        .clearCookie("Access-Token", options)
        .json({
            message: "User logged out successfully!"
        })
    } catch (error) {
        console.log("logoutUser ERROR :: ", error)
    }
};

const currentUser = async (req, res) => {
    try {
        // console.log(req);
        const currentUserData = req.user
        // console.log("current user data",currentUserData)
        // console.log(currentUserData);
        res.status(200).json({
            data: currentUserData
        })
    } catch (error) {
        console.log("currentUser ERROR : ", error);
    }
};

const getUserDataFromRequest = async (req) => {
    return new Promise((resolve, reject) => {
        const token = req.headers.authorization
        // console.log(token)
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                // console.log("getUserDataFromRequest", userData)
                resolve(userData);
            });
        } else {
            reject('no token provided')
        }
    })
}

module.exports = { registerUser, getAllUsers, loginUser, logoutUser, currentUser, getUserDataFromRequest };