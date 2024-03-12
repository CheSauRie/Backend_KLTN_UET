const { FollowUni, University } = require('../models');
require('dotenv').config({ path: '../.env' })

const followUniversity = async (req, res) => {
    const { id } = req.user;
    const { uni_id } = req.body;

    try {
        // Kiểm tra xem người dùng đã theo dõi trường này chưa
        const isAlreadyFollowing = await FollowUni.findOne({
            where: {
                user_id: id,
                uni_id
            }
        });

        if (isAlreadyFollowing) {
            return res.status(400).json({ message: 'You are already following this university.' });
        }

        // Nếu chưa theo dõi, tạo bản ghi mới
        const follow = await FollowUni.create({
            user_id: id,
            uni_id,
        });

        return res.json({ message: 'University followed successfully.', follow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'There was a problem following the university.' });
    }
};

const getFollowUni = async (req, res) => {
    const { id } = req.user;
    try {
        const followedUnis = await FollowUni.findAll({
            where: { user_id: id },
            include: [
                {
                    model: University,
                }
            ]
        });
        // Trích xuất thông tin trường đại học từ kết quả
        const universities = followedUnis.map(follow => follow.University);
        res.status(200).json(universities);
    } catch (error) {
        console.error('Error getting followed universities:', error);
        res.status(500).send('An error occurred while retrieving followed universities.');
    }
}

const unfollowUniversity = async (req, res) => {
    const { id } = req.user; // Lấy user_id từ thông tin người dùng đã đăng nhập
    const { uni_id } = req.params;

    try {
        // Tìm và hủy bản ghi theo dõi
        const result = await FollowUni.destroy({
            where: {
                user_id: id,
                uni_id: uni_id,
            },
        });

        if (result > 0) {
            res.json({ message: 'University unfollowed successfully.' });
        } else {
            res.status(404).json({ message: 'Follow record not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'There was a problem unfollowing the university.' });
    }
};

module.exports = {
    followUniversity,
    getFollowUni,
    unfollowUniversity
}