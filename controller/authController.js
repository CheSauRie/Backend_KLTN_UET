// Trong file controller (ví dụ: authController.js)
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const checkExistUser = await User.findOne({
            where: {
                email,
            }
        })
        if (checkExistUser) {
            res.status(500).send("Email đã tồn tại")
        } else {
            const user = await User.create({ name, email, password: hashedPassword });
            res.status(201).send(user);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Trong file controller

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login
}