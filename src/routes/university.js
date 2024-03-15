// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const uniRouter = express.Router();
const { createUniversity, getUniversities, deleteUniversity, getUniversityImages, getUniversityDetail, getUniversitiesByAddress, getUniversitiesByMajor } = require("../controller/uniController")
const { upload } = require("../middleware/uploadMiddleware");
const { getMajorsByUniversityCode, getAllUniversityNames, getScoresByMajorCodeAndUniversityCode } = require('../controller/uniScoreController');

uniRouter.post('/universities', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'background', maxCount: 1 }]), createUniversity)
uniRouter.get('/universities', getUniversities)
uniRouter.delete("/universities/:uniId", deleteUniversity)
uniRouter.get('/universities/images/:uniId', getUniversityImages);
uniRouter.get('/universities/details/:uni_code', getUniversityDetail);
uniRouter.post('/universities/address', getUniversitiesByAddress)
uniRouter.post('/universities/major', getUniversitiesByMajor)
// Dùng cho bảng score
uniRouter.get('/score/:uniCode/majors', getMajorsByUniversityCode)
uniRouter.get('/score/universities', getAllUniversityNames)
uniRouter.get('/score/:uniCode/majors/:majorCode/scores', getScoresByMajorCodeAndUniversityCode);

module.exports = {
    uniRouter
};
