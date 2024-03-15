// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const followRouter = express.Router();
const { followUniversity, getFollowUni, unfollowUniversity } = require("../controller/followController.js")
const { verifyToken } = require("../middleware/authMiddleware")

followRouter.post('/follow', verifyToken, followUniversity)
followRouter.get('/follow', verifyToken, getFollowUni)
followRouter.delete('/follow/:uni_id', verifyToken, unfollowUniversity)
module.exports = {
    followRouter
};
