module.exports.contactPost = (req, res, next) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!req.body.email) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập địa chỉ email!"
        });
    } else if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({
            success: false,
            message: "Định dạng email không hợp lệ!"
        });
    } else {
        next();
    }
};
