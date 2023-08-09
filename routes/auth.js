const express = require('express');
const authMiddleware = require("../middleware/authentication");
const testUser = require("../middleware/testUser");

// * Rate Limit Functionality
const rateLimiter = require("express-rate-limit");

const rateLimit = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        msg: "Too many requests from this IP, please try again after 15 minutes"
    }
})

const router = express.Router()
const { register, login, updateUser } = require('../controllers/auth')
router.post('/register', rateLimit, register)
router.post('/login', rateLimit, login)
router.patch('/updateUser', authMiddleware, testUser, updateUser);

module.exports = router
