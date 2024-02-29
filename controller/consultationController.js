const { Consultation, User, Major, University } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' })

const { google } = require('googleapis');
const { OAuth2 } = google.auth;

function getConfiguredOAuth2Client() {
    const oAuth2Client = new OAuth2(
        // process.env.CLIENT_ID,
        // process.env.CLIENT_SECRET
        "274909628938-cvcmcv5m46rc2ubfjbc74jk1qc8sqtiq.apps.googleusercontent.com",
        "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"
    );

    oAuth2Client.setCredentials({
        refresh_token: "1//0erBYcWrHx6H6CgYIARAAGA4SNwF-L9IrfJPYZXrlUbZqhQRKNuMoUN7K3O3znBTW57Pap5VuD2i41TKzT2expu7MijEuoaiZf_0",
    });
    return oAuth2Client;
}

const oAuth2Client = getConfiguredOAuth2Client();
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
async function createGoogleMeet(startMeeting, endMeeting, consultation_email) {
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
        attendees: [
            { email: process.env.EMAIL_USERNAME },
            { email: consultation_email },
        ],
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

const updateConsultationStatusAndNotify = async (req, res) => {
    const { consultation_id, start_meeting, end_meeting } = req.body;

    try {
        // Cập nhật trạng thái tư vấn
        const consultation = await Consultation.findByPk(consultation_id);
        if (!consultation) {
            return res.status(404).send("Consultation not found.");
        }
        // Gửi email thông báo
        const consultationEmail = consultation.consultation_email;
        const consultationName = consultation.consultation_name;
        // Tạo cuộc họp Google Meet
        const meetUrl = await createGoogleMeet(start_meeting, end_meeting, consultationEmail);
        await sendConsultationMeetingEmail(consultationEmail, consultationName, meetUrl);
        consultation.status = 1;
        consultation.consultation_time = start_meeting;
        consultation.meet_url = meetUrl;
        await consultation.save()
        return res.status(200).json({
            message: "Consultation status updated and notification sent.",
            meetUrl: meetUrl
        });
    } catch (error) {
        console.error("Error updating consultation status or sending notification:", error);
        return res.status(500).send("An error occurred.");
    }
};

async function sendConsultationMeetingEmail(consultationEmail, consultationName, meetUrl) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: `"Hệ thống tư vấn tuyển sinh" <${process.env.EMAIL_USERNAME}>`,
        to: consultationEmail,
        subject: 'Cuộc họp tư vấn đã được lên lịch',
        text: `Xin chào ${consultationName},\n\nCuộc họp của bạn đã được lên lịch. Vui lòng tham gia cuộc họp tại đây: ${meetUrl}\n\nTrân trọng,`
    };

    await transporter.sendMail(mailOptions);
}

const sendConsultationConfirmationEmail = async (consultationEmail, consultationName) => {
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
        text: `Xin chào ${consultationName},\n\nYêu cầu tư vấn của bạn đã được nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.\n\nTrân trọng,`
    });
}

const addConsultation = async (req, res) => {
    // Dữ liệu từ request body
    const { major_id, consulting_information } = req.body;
    let user_id = null;
    let consultation_phone, consultation_email, consultation_name;

    if (req.user) {
        user_id = req.user.id; // Hoặc req.user.user_id tùy vào payload của token

        // Truy vấn thông tin người dùng từ bảng Users
        try {
            const user = await User.findByPk(user_id);
            if (user) {
                // Lấy thông tin từ bảng Users nếu người dùng đã đăng nhập
                // consultation_phone = user.phone; // Giả sử trường thông tin điện thoại trong bảng User là phone
                consultation_email = user.email;
                consultation_name = user.username; // Hoặc bất kỳ trường nào khác bạn muốn sử dụng làm tên tư vấn
            }
        } catch (userError) {
            console.error("Failed to retrieve user information:", userError);
            return res.status(500).send("An error occurred while retrieving user information.");
        }
    }

    // Nếu người dùng không đăng nhập, sử dụng thông tin từ request body
    if (!user_id) {
        consultation_phone = req.body.consultation_phone || null;
        consultation_email = req.body.consultation_email || null;
        consultation_name = req.body.consultation_name || null;
    }

    try {
        const newConsultation = await Consultation.create({
            major_id,
            user_id, // Có thể là null nếu không đăng nhập
            consulting_information,
            consultation_phone,
            consultation_email,
            consultation_name,
            status: false, // Giả sử mặc định là false khi mới tạo
        });
        sendConsultationConfirmationEmail(consultation_email, consultation_name).then(() => {
            console.log('Email xác nhận đã được gửi.');
        }).catch(error => {
            console.error('Lỗi khi gửi email xác nhận:', error);
        });
        return res.status(201).json({
            message: "Consultation request submitted successfully.",
            consultation: newConsultation
        });
    } catch (error) {
        console.error("Failed to add consultation:", error);
        return res.status(500).send("An error occurred while submitting the consultation request.");
    }
};

const getConsultations = async (req, res) => {
    try {
        const consultations = await Consultation.findAll({
            include: [
                {
                    model: Major,
                    attributes: ['major_name'],
                    include: [
                        {
                            model: University,
                            attributes: ['uni_name']
                        }
                    ]
                }
            ],
            attributes: ['consultation_id', 'consulting_information', 'status', 'consultation_phone', 'consultation_email', 'consultation_name', 'meet_url', "consultation_time"],
        });

        if (!consultations) {
            return res.status(404).send("Consultations not found.");
        }
        const formattedConsultations = consultations.map(consultation => {
            return {
                consultation_id: consultation.consultation_id,
                consulting_information: consultation.consulting_information,
                status: consultation.status,
                consultation_phone: consultation.consultation_phone,
                consultation_email: consultation.consultation_email,
                consultation_name: consultation.consultation_name,
                major_name: consultation.Major.major_name,
                uni_name: consultation.Major.University.uni_name,
                consultation_time: consultation.consultation_time,
                meet_url: consultation.meet_url
            };
        });
        return res.status(200).json(formattedConsultations);
    } catch (error) {
        console.error("Failed to retrieve consultations:", error);
        return res.status(500).send("An error occurred while retrieving consultations.");
    }
};


module.exports = {
    addConsultation,
    getConsultations,
    updateConsultationStatusAndNotify
}