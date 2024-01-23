const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const jwtSecret = process.env.ACCESS_TOKEN_SECRET

const verifyJWT = async (req, res, next) => {
    try {
        // first retrieve the token from the header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        // console.log(token);
    
        if (!token) {
            res.status(401).json({
                error: "Unauthorized request -> No token provided"
            })
        }
    
        // decode the information from the retrieved token.
        const decodedToken = jwt.verify(token, jwtSecret)
        // console.log(decodedToken)
    
        //get the user id from token
        const userId = decodedToken?._id;
    
        //retrieve the user from the database based on the id
        const user = await User.findById(userId);
        // console.log(user)
    
        if (!user) {
            return res.status(404).send('The user with this token does not exist anymore')
        } else {
            //* add the user to the request so it can be accessed in other routes
            req.user = user;
            //go to the next middleware function
            next();
        }
    } catch (error) {
        console.log("Token Validation Error :: ", error);
    }
}

module.exports = verifyJWT