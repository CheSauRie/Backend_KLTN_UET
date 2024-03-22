// Trong file route (ví dụ: authRoutes.js)
const express = require('express');
const consultationRouter = express.Router();
const { addConsultationSchedule, getConsultationSchedules, getConsultationSchedulesByUniCode, getConsultationRequestsByScheduleId, updateConsultationSchedule, deleteConsultationSchedule, getConsultationsByUserId, addConsultationRequest } = require("../controller/consultationController")
const { optionalVerifyToken, verifyToken } = require("../middleware/authMiddleware")
consultationRouter.post('/consultation-schedule', addConsultationSchedule)
consultationRouter.get("/consultation-schedule", getConsultationSchedules)
consultationRouter.get("/consultation-schedule/:uni_code", getConsultationSchedulesByUniCode)
consultationRouter.put("/consultation-schedule/:schedule_id", updateConsultationSchedule)
consultationRouter.delete("/consultation-schedule/:schedule_id", deleteConsultationSchedule)
consultationRouter.get('/consultation-request', verifyToken, getConsultationsByUserId)
consultationRouter.post('/consultation-request', optionalVerifyToken, addConsultationRequest)
consultationRouter.get('/consultation-schedule-by-schedule-id/:schedule_id', getConsultationRequestsByScheduleId)
module.exports = {
    consultationRouter
};
