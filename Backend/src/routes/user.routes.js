const express = require("express");
const { registerUser, getAllUsers, loginUser, logoutUser, currentUser } = require("../controllers/user.controller");
const verifyJWT = require("../middleware/auth.middleware");

const router = express.Router();

router.post('/register', registerUser);     //route to create user
router.get('/users', getAllUsers);      //route to get data of all the users

router.post('/login', loginUser);        //route to login the user

router.post('/logout', verifyJWT, logoutUser);       //route to logout user

router.get('/current-user', verifyJWT, currentUser);        //route to get current user details

module.exports = router;