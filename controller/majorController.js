const { Major, University } = require('../models');

const createMajor = async (req, res) => {
    try {
        const { uni_id, major_name, major_code, admissions_information, admissions_method, description_major } = req.body;

        // Tạo major mới
        const major = await Major.create({
            uni_id,
            major_name,
            major_code,
            admissions_information,
            admissions_method,
            description_major
        });

        res.status(201).json(major);
    } catch (error) {
        console.error('Error creating major:', error);
        res.status(500).json({ message: 'Error creating major', error: error.message });
    }
};

const getMajors = async (req, res) => {
    try {
        const major = await Major.findAll();
        res.json({ major });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch majors", error: error.message });
    }
};

// Detail Major
const getMajorDetailByUniCode = async (req, res) => {
    try {
        const { uni_code } = req.params;
        const uni = await University.findOne({
            where: { uni_code }
        })
        const major = await Major.findAll({
            where: { uni_id: uni.uni_id },
        });

        if (!major) {
            return res.status(404).json({ message: 'major not found.' });
        }

        res.json(major);
    } catch (error) {
        console.error('Error fetching major detail:', error);
        res.status(500).json({ message: 'Error fetching major detail', error: error.message });
    }
};
//update Major
const updateMajor = async (req, res) => {
    const { major_id } = req.params; // Lấy ID của ngành từ params
    const { admissions_information, admissions_method, description_major, quota } = req.body; // Lấy dữ liệu cần cập nhật từ body của request

    try {
        // Tìm ngành cần cập nhật dựa trên majorId
        const major = await Major.findByPk(major_id);

        // Kiểm tra xem ngành có tồn tại không
        if (!major) {
            return res.status(404).json({ message: "Major not found" });
        }

        // Cập nhật ngành với dữ liệu mới
        await Major.update(
            { admissions_information, admissions_method, description_major, quota },
            { where: { major_id: major_id } }
        );

        // Gửi phản hồi thành công
        res.status(200).json({ message: "Major updated successfully" });
    } catch (error) {
        // Xử lý lỗi và gửi phản hồi lỗi
        console.error('Error updating major:', error);
        res.status(500).json({ message: "Error updating major", error: error.message });
    }
};


module.exports = {
    createMajor,
    getMajors,
    getMajorDetailByUniCode,
    updateMajor
}