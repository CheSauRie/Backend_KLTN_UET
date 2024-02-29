const { Review, Major, University, User } = require('../models');
require('dotenv').config({ path: '../.env' })

const createReview = async (req, res) => {
    const { id } = req.user;
    const { major_id, pros, cons } = req.body;

    try {
        // Tạo một đánh giá mới với thông tin từ request body
        const newReview = await Review.create({
            user_id: id,
            major_id,
            pros,
            cons
        });

        // Gửi đánh giá đã được tạo về client
        res.status(201).json(newReview);
    } catch (error) {
        // Nếu có lỗi, gửi mã lỗi và thông báo
        res.status(400).json({ error: error.message });
    }
}

const getReviewByUniCode = async (req, res) => {
    try {
        // Tìm university_id dựa trên uni_code
        const university = await University.findOne({
            where: { uni_code: req.params.uni_code },
        });

        if (!university) {
            return res.status(404).json({ message: 'Trường đại học không tồn tại.' });
        }

        // Lấy tất cả reviews của các majors trong university đó, bao gồm cả tên ngành và tên người dùng
        const reviews = await Review.findAll({
            include: [
                {
                    model: Major,
                    include: {
                        model: University,
                        where: { uni_id: university.uni_id },
                        attributes: [],
                    },
                    attributes: ['major_name'],
                },
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });
        // Định dạng lại dữ liệu trước khi gửi phản hồi
        const formattedReviews = reviews.map(review => ({
            review_id: review.review_id,
            pros: review.pros,
            cons: review.cons,
            majorName: review.Major.major_name, // Lấy tên ngành từ Major
            username: review.User.username, // Lấy tên người dùng từ User
        }));
        res.json(formattedReviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createReview,
    getReviewByUniCode
}