const { University, MarkdownUni } = require('../models');
require('dotenv').config({ path: '../.env' })

// Tạo mới university
const createUniversity = async (req, res) => {
    const { uni_code, uni_name, address, phone, website, email, description, mission, admissions_criteria, admission_method, tution_fee, teaching_staff, dormitory, library } = req.body;
    const { logo, background } = req.files;
    try {
        // Lưu thông tin trường đại học
        const university = await University.create({
            uni_code,
            uni_name,
            address,
            phone,
            website,
            email,
            description,
        });

        // Lưu thông tin markdown liên quan
        const markdownUni = await MarkdownUni.create({
            uni_id: university.uni_id, // Sử dụng ID của trường đại học vừa được tạo
            mission,
            admissions_criteria,
            admission_method,
            tution_fee,
            teaching_staff,
            dormitory,
            library,
            logo: logo[0].path, // Lưu đường dẫn file
            background: background[0].path // Lưu đường dẫn file
        });

        res.status(201).json({ message: "University and related information successfully added", university, markdownUni });
    } catch (error) {
        console.error("Error adding university information:", error);
        res.status(500).json({ message: "Failed to add university information", error: error.message });
    }
}
// Lấy danh sách university
const getUniversities = async (req, res) => {
    try {
        const universities = await University.findAll();
        res.json({ universities });
    } catch (error) {
        res.status(500).json({ message: "Could not fetch universities", error: error.message });
    }
};
// Xóa 1 university
const deleteUniversity = async (req, res) => {
    try {
        const { uniId } = req.params; // Lấy uniId từ URL
        const deleted = await University.destroy({
            where: { uni_id: uniId }
        });

        if (deleted) {
            res.json({ message: "University deleted successfully" });
        } else {
            res.status(404).json({ message: "University not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Could not delete university", error: error.message });
    }
};

// Lấy image của university
const getUniversityImages = async (req, res) => {
    try {
        const { uniId } = req.params;
        const markdownUni = await MarkdownUni.findOne({
            where: { uni_id: uniId },
            attributes: ['logo', 'background'] // Chỉ lấy các trường logo và background
        });

        if (markdownUni) {
            res.json(markdownUni);
        } else {
            res.status(404).send({ message: 'Images not found for the specified university ID.' });
        }
    } catch (error) {
        console.error('Error fetching university images:', error);
        res.status(500).send({ message: 'Error fetching university images.', error: error.message });
    }
};

// Chi tiết university
const getUniversityDetail = async (req, res) => {
    try {
        const { uni_code } = req.params; // Sử dụng tên hoặc một định danh khác để tìm trường đại học
        // Tìm thông tin trường đại học từ bảng universities
        const university = await University.findOne({
            where: { uni_code }, // Hoặc sử dụng một trường định danh phù hợp
        });

        if (!university) {
            return res.status(404).json({ message: 'University not found.' });
        }

        // Tìm thông tin chi tiết từ bảng markdownUnis
        const markdownDetails = await MarkdownUni.findOne({
            where: { uni_id: university.uni_id },
            attributes: ['logo', 'background', 'mission', 'admissions_criteria', 'admission_method', 'teaching_staff', 'tution_fee', 'dormitory', 'library'] // Chỉ lấy các trường cần thiết
        });

        // Gộp thông tin và trả về
        const universityDetail = {
            ...university.dataValues,
            ...markdownDetails.dataValues
        };

        res.json(universityDetail);
    } catch (error) {
        console.error('Error fetching university detail:', error);
        res.status(500).json({ message: 'Error fetching university detail', error: error.message });
    }
};
module.exports = {
    createUniversity,
    getUniversities,
    deleteUniversity,
    getUniversityImages,
    getUniversityDetail
}