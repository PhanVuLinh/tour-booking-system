const contactService = require('./contact.service');

module.exports.createContact = async (req, res) => {
    try {
        const { email } = req.body;

        const result = await contactService.saveEmail(email);

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: "Đăng ký nhận tin thành công!"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message || "Đăng ký thất bại!"
            });
        }
    } catch (error) {
        console.error("Lỗi Controller (Contacts):", error);
        res.status(500).json({
            success: false,
            message: "Lỗi máy chủ nội bộ"
        });
    }
};
