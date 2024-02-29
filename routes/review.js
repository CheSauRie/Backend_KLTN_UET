// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const reviewRouter = express.Router();
const { createReview, getReviewByUniCode } = require("../controller/reviewController")
const { verifyToken } = require("../middleware/authMiddleware")

reviewRouter.post('/add-review', verifyToken, createReview)
reviewRouter.get('/review/:uni_code', getReviewByUniCode)
module.exports = {
    reviewRouter
};
