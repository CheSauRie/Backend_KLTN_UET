// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const consultationRouter = express.Router();
const { addConsultation, getConsultations, updateConsultationStatusAndNotify } = require("../controller/consultationController")
const { optionalVerifyToken } = require("../middleware/authMiddleware")
consultationRouter.post('/consultation', optionalVerifyToken, addConsultation)
consultationRouter.get('/consultation', getConsultations)
consultationRouter.post('/consultation/update', updateConsultationStatusAndNotify)
module.exports = {
    consultationRouter
};
