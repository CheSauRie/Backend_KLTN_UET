const { Major, University, MarkdownUni } = require('../models');
const { Sequelize } = require('sequelize');
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

//Recommend ngành học khi nhập vài dữ liệu:
// const searchUniversitiesAndMajors = async (req, res) => {
//     const { desiredTuition, certificates, fieldOfInterest, country, desiredFacilities } = req.body;

//     try {
//         // Tạo truy vấn động dựa trên các tiêu chí
//         let universityQuery = `SELECT * FROM universities WHERE `;
//         let majorQueryConditions = [];
//         let universityQueryConditions = [];

//         // Học phí
//         if (desiredTuition) {
//             universityQueryConditions.push(`tution_fee LIKE '%${desiredTuition}%'`);
//         }

//         // Chứng chỉ và điểm
//         if (certificates && certificates.length > 0) {
//             certificates.forEach(certificate => {
//                 majorQueryConditions.push(`admissions_information LIKE '%${certificate.name}: ${certificate.score}%'`);
//             });
//         }

//         // Lĩnh vực/ngành học quan tâm
//         if (fieldOfInterest) {
//             majorQueryConditions.push(`description_major LIKE '%${fieldOfInterest}%'`);
//         }

//         // Quốc gia
//         if (country) {
//             universityQueryConditions.push(`country LIKE '%${country}%'`);
//         }

//         // Cơ sở vật chất
//         if (desiredFacilities && desiredFacilities.length > 0) {
//             desiredFacilities.forEach(facility => {
//                 universityQueryConditions.push(`description LIKE '%${facility}%'`);
//             });
//         }

//         // Kết hợp các điều kiện truy vấn
//         universityQuery += universityQueryConditions.join(' AND ');

//         // Thực hiện truy vấn
//         const universities = await sequelize.query(universityQuery, { type: sequelize.QueryTypes.SELECT });
//         let majors = [];
//         if (universities.length > 0) {
//             const uniIds = universities.map(uni => uni.uni_id);
//             majors = await Major.findAll({
//                 where: {
//                     [Sequelize.Op.and]: [
//                         { uni_id: uniIds },
//                         Sequelize.literal(majorQueryConditions.join(' AND '))
//                     ]
//                 }
//             });
//         }

//         // Trả về kết quả
//         res.json({ universities, majors });
//     } catch (error) {
//         console.error('Error searching for universities and majors:', error);
//         res.status(500).json({ message: 'Error searching for universities and majors', error: error.message });
//     }
// };

const searchUniversitiesAndMajors = async (req, res) => {
    const { desiredTuition, certificates, fieldOfInterest, desiredFacilities } = req.body;
    try {
        // Tạo truy vấn động dựa trên các tiêu chí cho University
        let universityQueryConditions = [];

        // Học phí
        if (desiredTuition) {
            universityQueryConditions.push({
                tution_fee: {
                    [Sequelize.Op.like]: `%${desiredTuition}%`
                }
            });
        }

        // Cơ sở vật chất (Giả sử nằm trong mô tả của Major chứ không phải University)
        let facilityCondition = {};
        if (desiredFacilities && desiredFacilities.length > 0) {
            facilityCondition = {
                [Sequelize.Op.or]: desiredFacilities.map(facility => ({
                    description_major: {
                        [Sequelize.Op.like]: `%${facility}%`
                    }
                }))
            };
        }

        // Truy vấn universities dựa trên các tiêu chí
        const universities = await MarkdownUni.findAll({
            where: {
                [Sequelize.Op.and]: universityQueryConditions
            }
        });

        let majorQueryConditions = [];

        // Chứng chỉ và điểm
        if (certificates && certificates.length > 0) {
            certificates.forEach(certificate => {
                majorQueryConditions.push(sequelize.where(sequelize.fn('', sequelize.col('admissions_information')), 'LIKE', `%${certificate.name}: ${certificate.score}%`));
            });
        }

        // Lĩnh vực/ngành học quan tâm
        if (fieldOfInterest) {
            majorQueryConditions.push({
                description_major: {
                    [Sequelize.Op.like]: `%${fieldOfInterest}%`
                }
            });
        }

        // Thêm điều kiện về cơ sở vật chất vào majorQueryConditions nếu có
        if (Object.keys(facilityCondition).length > 0) {
            majorQueryConditions.push(facilityCondition);
        }

        let majors = [];
        if (universities.length > 0) {
            const uniIds = universities.map(uni => uni.uni_id);
            majors = await Major.findAll({
                where: {
                    [Sequelize.Op.and]: [
                        { uni_id: uniIds },
                        ...majorQueryConditions
                    ]
                }
            });
        }

        // Trả về kết quả
        res.json({ universities, majors, universityQueryConditions, majorQueryConditions });
    } catch (error) {
        console.error('Error searching for universities and majors:', error);
        res.status(500).json({ message: 'Error searching for universities and majors', error: error.message });
    }
};

module.exports = {
    createMajor,
    getMajors,
    getMajorDetailByUniCode,
    updateMajor,
    searchUniversitiesAndMajors
}