const { Review, Major, University, User } = require('../models');
require('dotenv').config({ path: '../.env' })

const createReview = async (req, res) => {
    const { id } = req.user;
    const { major_id, content, parent_review_id } = req.body;

    // Validate input
    if (!id || !major_id || !content) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    try {
        const newComment = await Review.create({
            user_id: id,
            major_id,
            content,
            parent_review_id,
        });

        return res.status(201).send(newComment);
    } catch (error) {
        return res.status(500).send({ message: 'Error adding comment', error: error.message });
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

        const reviews = await Review.findAll({
            include: [
                {
                    model: Major,
                    where: { uni_id: university.uni_id },
                    attributes: ['major_name'],
                    include: [
                        {
                            model: University,
                        }
                    ]
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
            content: review.content,
            major_id: review.major_id,
            majorName: review.Major.major_name,
            username: review.User.username,
            parent_review_id: review.parent_review_id,
            createdAt: review.createdAt
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