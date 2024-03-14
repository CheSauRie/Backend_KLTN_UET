// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const majorRouter = express.Router();
const { createMajor, getMajors, getMajorDetailByUniCode, updateMajor, searchUniversitiesAndMajors } = require("../controller/majorController")
const { upload } = require("../middleware/uploadMiddleware")

majorRouter.post('/major', createMajor)
majorRouter.get("/major", getMajors)
majorRouter.get("/major/:uni_code", getMajorDetailByUniCode)
majorRouter.put("/major/:major_id", updateMajor)
majorRouter.post('/major/recommendation', searchUniversitiesAndMajors)
module.exports = {
    majorRouter
};
