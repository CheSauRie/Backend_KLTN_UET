const { Consultation_Schedule, User, Major, University, ConsultationRequest } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config()

const { google } = require('googleapis');
const { OAuth2 } = google.auth;

function getConfiguredOAuth2Client() {
    const oAuth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });
    return oAuth2Client;
}

const oAuth2Client = getConfiguredOAuth2Client();
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
async function createGoogleMeet(startMeeting, endMeeting) {
    const event = {
        summary: 'Cuộc họp tư vấn',
        description: 'Cuộc họp tư vấn cho sinh viên.',
        start: {
            dateTime: startMeeting, // ISO string e.g., "2024-02-27T09:00:00-07:00"
            timeZone: 'Asia/Ho_Chi_Minh',
        },
        end: {
            dateTime: endMeeting, // ISO string e.g., "2024-02-27T10:00:00-07:00"
            timeZone: 'Asia/Ho_Chi_Minh',
        },
        conferenceData: {
            createRequest: { requestId: "sample123", conferenceSolutionKey: { type: "hangoutsMeet" } }
        },
    };
    try {
        const { data } = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            sendNotifications: true,
        });

        return data.hangoutLink; // Trả về URL của cuộc họp Google Meet
    } catch (error) {
        console.error('Error creating Google Meet event:', error);
        throw error; // Hoặc xử lý lỗi theo cách khác
    }
}

const sendConsultationConfirmationEmail = async (consultationEmail, consultationName, timeConsulting, meetUrl, uniName, consulting_information) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: `"Hệ thống tư vấn tuyển sinh" <${process.env.EMAIL_USERNAME}>`,
        to: consultationEmail,
        subject: 'Xác nhận yêu cầu tư vấn',
        text: `Xin chào ${consultationName},\n\nYêu cầu tư vấn của bạn đã được nhận.
        \nTrường: ${uniName} 
        \nYêu cầu tư vấn của bạn: ${consulting_information}
        \nThời gian tư vấn của bạn là: ${timeConsulting}
        \nLink phòng họp: ${meetUrl}
        \n\nTrân trọng,`
    });
}

//Người dùng thêm yêu cầu tư vấn
const addConsultationRequest = async (req, res) => {
    const { schedule_id, consulting_information } = req.body;
    let user_id = null;
    let user_phone, user_email, username;

    if (req.user) {
        user_id = req.user.id;

        // Truy vấn thông tin người dùng từ bảng Users
        try {
            const user = await User.findByPk(user_id);
            if (user) {
                // Lấy thông tin từ bảng Users nếu người dùng đã đăng nhập
                // user_phone = user.phone; // Giả sử trường thông tin điện thoại trong bảng User là phone
                user_email = user.email;
                username = user.username;
            }
        } catch (userError) {
            console.error("Failed to retrieve user information:", userError);
            return res.status(500).send("An error occurred while retrieving user information.");
        }
    }

    // Nếu người dùng không đăng nhập, sử dụng thông tin từ request body
    if (!user_id) {
        user_phone = req.body.user_phone || null;
        user_email = req.body.user_email || null;
        username = req.body.username || null;
    }

    try {
        const newConsultation = await ConsultationRequest.create({
            user_id,
            schedule_id,
            consulting_information,
            user_phone,
            user_email,
            username,
        });
        const schedule = await Consultation_Schedule.findByPk(schedule_id);
        if (schedule) {
            const timeConsulting = schedule.consultation_time
            const meetUrl = schedule.meet_url
            const uni = await University.findByPk(schedule.uni_id)
            const uniName = uni.uni_name
            sendConsultationConfirmationEmail(user_email, username, timeConsulting, meetUrl, uniName, consulting_information).then(() => {
                console.log('Email xác nhận đã được gửi.');
            }).catch(error => {
                console.error('Lỗi khi gửi email xác nhận:', error);
            });
        } else {
            return res.status(404).json({
                message: 'Cannot find schedule'
            })
        }

        return res.status(201).json({
            message: "Consultation request submitted successfully.",
            consultation: newConsultation
        });
    } catch (error) {
        console.error("Failed to add consultation:", error);
        return res.status(500).send("An error occurred while submitting the consultation request.");
    }
};

//Người dùng lấy danh sách tư vấn bằng user_id
const getConsultationsByUserId = async (req, res) => {
    const { id } = req.user
    try {
        const consultations = await ConsultationRequest.findAll({
            where: { user_id: id },
            include: [
                {
                    model: Consultation_Schedule,
                    attributes: ['schedule_id', 'meet_url', 'consultation_time'],
                    include: [
                        {
                            model: University,
                            attributes: ['uni_name']
                        }
                    ]
                }
            ],
            attributes: ['request_id', 'consulting_information', 'schedule_id'],
        });
        if (!consultations) {
            return res.status(404).send("Consultations not found.");
        }
        const formattedConsultations = consultations.map(consultation => {
            return {
                schedule_id: consultation.schedule_id,
                consulting_information: consultation.consulting_information,
                consultation_phone: consultation.user_phone,
                consultation_email: consultation.user_email,
                consultation_name: consultation.user_name,
                uni_name: consultation.Consultation_Schedule.University.uni_name,
                consultation_time: consultation.Consultation_Schedule.consultation_time,
                meet_url: consultation.Consultation_Schedule.meet_url
            };
        });
        return res.status(200).json(formattedConsultations);
    } catch (error) {
        console.error("Failed to retrieve consultations:", error);
        return res.status(500).send("An error occurred while retrieving consultations.");
    }
}

// Admin thêm lịch tư vấn
const addConsultationSchedule = async (req, res) => {
    const { uni_id, consultation_time } = req.body;
    try {
        // Tìm email của trường đại học dựa trên uni_id
        const university = await University.findByPk(uni_id);
        if (!university) {
            return res.status(404).send("University not found");
        }

        // Định dạng thời gian kết thúc cho cuộc họp (ví dụ: thêm 1 giờ)
        const endTime = new Date(consultation_time);
        endTime.setHours(endTime.getHours() + 1); // Thêm 1 giờ cho thời gian kết thúc

        // Tạo cuộc họp Google Meet
        const meetUrl = await createGoogleMeet(consultation_time, endTime.toISOString());

        // Tạo mới một lịch tư vấn trong bảng consultation_schedules
        const newSchedule = await Consultation_Schedule.create({
            uni_id,
            consultation_time,
            meet_url: meetUrl
        });

        return res.status(201).json({
            message: "Consultation schedule created successfully.",
            schedule: newSchedule
        });
    } catch (error) {
        console.error("Failed to create consultation schedule:", error);
        return res.status(500).send("An error occurred while creating the consultation schedule.");
    }
};

// Admin lấy toàn bộ lịch tư vấn
const getConsultationSchedules = async (req, res) => {
    try {
        const consultationSchedules = await Consultation_Schedule.findAll({
            include: [{
                model: University,
                attributes: ['uni_name'], // Lấy chỉ tên trường đại học
            }],
            attributes: ['schedule_id', 'uni_id', 'consultation_time', 'meet_url'], // Lấy các trường bạn cần từ consultation_schedules
        });

        if (!consultationSchedules) {
            return res.status(404).send("No consultation schedules found.");
        }
        const formattedSchedules = consultationSchedules.map(schedule => ({
            schedule_id: schedule.schedule_id,
            uni_id: schedule.uni_id,
            uni_name: schedule.University.uni_name,
            consultation_time: schedule.consultation_time,
            meet_url: schedule.meet_url,
        }));
        return res.status(200).json(formattedSchedules);
    } catch (error) {
        console.error("Failed to retrieve consultation schedules:", error);
        return res.status(500).send("An error occurred while retrieving consultation schedules.");
    }
};

// Admin lấy tư vấn bởi uni_code
const getConsultationSchedulesByUniCode = async (req, res) => {
    const { uni_code } = req.params;

    try {
        // Tìm trường đại học dựa trên uni_code
        const university = await University.findOne({ where: { uni_code } });

        if (!university) {
            return res.status(404).send("University not found.");
        }

        // Tìm lịch tư vấn dựa trên uni_id
        const consultationSchedules = await Consultation_Schedule.findAll({
            where: { uni_id: university.uni_id },
            include: [{
                model: University,
                attributes: ['uni_name', 'uni_code'], // Lấy tên và mã trường
            }],
            attributes: ['schedule_id', 'uni_id', 'consultation_time'], // Các thông tin cần lấy từ consultation_schedules
        });

        if (consultationSchedules.length === 0) {
            return res.status(404).send("No consultation schedules found for the specified university.");
        }
        const formattedSchedules = consultationSchedules.map(schedule => ({
            schedule_id: schedule.schedule_id,
            uni_id: schedule.uni_id,
            uni_name: schedule.University.uni_name,
            uni_code: schedule.University.uni_code,
            consultation_time: schedule.consultation_time,
            meet_url: schedule.meet_url,
        }));
        return res.status(200).json(formattedSchedules);
    } catch (error) {
        console.error("Failed to retrieve consultation schedules:", error);
        return res.status(500).send("An error occurred while retrieving consultation schedules.");
    }
};

// Update lịch tư vấn admin
const updateConsultationSchedule = async (req, res) => {
    const { schedule_id } = req.params;
    const { consultation_time, meet_url } = req.body;

    try {
        const schedule = await Consultation_Schedule.findByPk(schedule_id);

        if (!schedule) {
            return res.status(404).send("Consultation schedule not found.");
        }

        // Cập nhật lịch tư vấn với thông tin mới
        if (consultation_time) schedule.consultation_time = consultation_time;
        if (meet_url) schedule.meet_url = meet_url;

        await schedule.save(); // Lưu thay đổi

        return res.status(200).json({
            message: "Consultation schedule updated successfully.",
            schedule: {
                schedule_id: schedule.schedule_id,
                uni_id: schedule.uni_id,
                consultation_time: schedule.consultation_time,
                meet_url: schedule.meet_url,
            }
        });
    } catch (error) {
        console.error("Failed to update consultation schedule:", error);
        return res.status(500).send("An error occurred while updating the consultation schedule.");
    }
};

// Xóa lịch tư vấn admin
const deleteConsultationSchedule = async (req, res) => {
    try {
        const { schedule_id } = req.params;
        const schedule = await Consultation_Schedule.findByPk(schedule_id);

        if (!schedule) {
            return res.status(404).send({ message: "Schedule not found." });
        }

        await schedule.destroy();
        return res.status(200).send({ message: "Schedule deleted successfully." });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return res.status(500).send({ message: "Error deleting schedule." });
    }
};


module.exports = {
    addConsultationSchedule,
    getConsultationSchedules,
    getConsultationSchedulesByUniCode,
    updateConsultationSchedule,
    deleteConsultationSchedule,
    getConsultationsByUserId,
    addConsultationRequest
}