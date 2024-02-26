// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const uniRouter = express.Router();
const { createUniversity, getUniversities, deleteUniversity, getUniversityImages, getUniversityDetail } = require("../controller/uniController")
const { upload } = require("../middleware/uploadMiddleware")

uniRouter.post('/universities', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'background', maxCount: 1 }]), createUniversity)
uniRouter.get('/universities', getUniversities)
uniRouter.delete("/universities/:uniId", deleteUniversity)
uniRouter.get('/universities/images/:uniId', getUniversityImages);
uniRouter.get('/universities/details/:uni_code', getUniversityDetail);
module.exports = {
    uniRouter
};
