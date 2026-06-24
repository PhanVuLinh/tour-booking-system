import Joi from "joi";

export const validateBookingStep1 = (formData) => {
  const schema = Joi.object({
    contact: Joi.object({
      fullName: Joi.string().trim().required().messages({
        "string.empty": "Họ tên không được để trống",
        "any.required": "Họ tên là bắt buộc",
      }),
      phone: Joi.string()
        .pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)
        .required()
        .messages({
          "string.empty": "Số điện thoại không được để trống",
          "string.pattern.base": "Số điện thoại không hợp lệ (phải đủ 10 số)",
          "any.required": "Số điện thoại là bắt buộc",
        }),
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "string.empty": "Email không được để trống",
          "string.email": "Email không đúng định dạng",
          "any.required": "Email là bắt buộc",
        }),
      address: Joi.string().allow("").optional(),
    }),
    note: Joi.string().allow("").optional(),
  });

  const { error } = schema.validate(formData, { abortEarly: false });
  const errors = {};

  if (error) {
    error.details.forEach((err) => {
      const key = err.path.join(".");
      errors[key] = err.message;
    });
  }
  return errors;
};
