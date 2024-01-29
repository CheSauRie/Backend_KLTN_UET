const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' })
//Hàm gửi yêu cầu xác thực email
const sendVerificationEmail = async (user, emailVerificationToken) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hongquanvd1@gmail.com', // Địa chỉ email của bạn
            pass: 'icly rjbv fpdp xgal'      // Mật khẩu ứng dụng của Gmail
        }
    });

    const verificationUrl = `http://localhost:2000/api/v1/user/verify-email?token=${emailVerificationToken}`;

    await transporter.sendMail({
        from: '"Hệ thống tư vấn tuyển sinh" <hongquanvd1@gmail.com>',
        to: user.email,
        subject: 'Verify Email',
        text: `Please click on the following link to verify your email: ${verificationUrl}`
    });
}

//Hàm đăng ký
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkExistUser = await User.findOne({
            where: {
                email,
            }
        })
        if (checkExistUser) {
            res.status(500).send("Email đã tồn tại")
        } else {
            const user = await User.create({ username, email, password: hashedPassword });

            const emailVerificationToken = jwt.sign(
                { userId: user.user_id },
                "anhquan1",
                { expiresIn: '24h' }
            );

            user.emailVerificationToken = emailVerificationToken;
            await user.save();

            // Gửi email xác minh
            sendVerificationEmail(user, emailVerificationToken);
            res.status(201).send('User registered successfully. Please check your email to verify.');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Hàm login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const token = jwt.sign({ id: user.user_id }, 'anhquan1', { expiresIn: '1h' });

        res.json({ message: "Login successful", token, userName: user.username, user_id: user.user_id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Hàm xác thực email
const emailVerify = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, "anhquan1");
        const user = await User.findByPk(decoded.userId);

        if (!user) return res.status(400).send('Invalid token.');

        user.isVerified = true;
        user.emailVerificationToken = null;
        await user.save();

        res.send('Email verified successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

//Hàm gửi yêu cầu resetpass
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send("Không tìm thấy người dùng với email này.");
        }

        const resetToken = jwt.sign({ userId: user.user_id }, 'anhquan1', { expiresIn: '1h' });

        // Lưu token đặt lại mật khẩu vào cơ sở dữ liệu hoặc bảng tạm thời
        user.emailVerificationToken = resetToken;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hongquanvd1@gmail.com', // Địa chỉ email của bạn
                pass: 'icly rjbv fpdp xgal'      // Mật khẩu ứng dụng của Gmail
            }
        });

        // Gửi email
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: '"Hệ thống tư vấn tuyển sinh" <hongquanvd1@gmail.com>',
            to: user.email,
            subject: 'Reset Password',
            text: `Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn: ${resetUrl}`
        });

        res.send('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn.');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Hàm reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const decoded = jwt.verify(token, "anhquan1");
        const user = await User.findByPk(decoded.userId);

        if (!user || user.emailVerificationToken !== token) {
            return res.status(400).send('Token không hợp lệ hoặc đã hết hạn.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.emailVerificationToken = null; // Xóa token sau khi đặt lại mật khẩu
        await user.save();

        res.send('Mật khẩu đã được đặt lại thành công.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports = {
    register,
    login,
    emailVerify,
    requestPasswordReset,
    resetPassword
}