export const validateBookingStep1 = (formData) => {
  const errors = {};

  const contact = formData?.contact || {};

  if (!contact.fullName || contact.fullName.trim() === "") {
    errors["contact.fullName"] = "Họ tên không được để trống";
  }

  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  if (!contact.phone || contact.phone.trim() === "") {
    errors["contact.phone"] = "Số điện thoại không được để trống";
  } else if (!phoneRegex.test(contact.phone)) {
    errors["contact.phone"] = "Số điện thoại không hợp lệ (phải đủ 10 số)";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!contact.email || contact.email.trim() === "") {
    errors["contact.email"] = "Email không được để trống";
  } else if (!emailRegex.test(contact.email)) {
    errors["contact.email"] = "Email không đúng định dạng";
  }

  const passengerDetails = formData?.passengerDetails || {};

  const validatePassenger = (passenger, type, index) => {
    const prefix = `passengerDetails.${type}.${index}`;

    if (!passenger.fullName || passenger.fullName.trim() === "") {
      errors[`${prefix}.fullName`] = "Họ tên là bắt buộc";
    }

    if (!passenger.dob || passenger.dob.trim() === "") {
      errors[`${prefix}.dob`] = "Ngày sinh là bắt buộc";
    }

    if (!passenger.gender || passenger.gender.trim() === "") {
      errors[`${prefix}.gender`] = "Giới tính là bắt buộc";
    }

    if (passenger.dob && passenger.dob.trim() !== "") {
      const dobDate = new Date(passenger.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      
      if (age >= 14) {
        if (!passenger.identity_card || passenger.identity_card.trim() === "") {
          errors[`${prefix}.identity_card`] = "Hành khách từ 14 tuổi trở lên bắt buộc nhập CMND/CCCD/Passport";
        }
      }
    }

    if (type === "adults") {
      if (!passenger.phone || passenger.phone.trim() === "") {
        errors[`${prefix}.phone`] = "Số điện thoại không được để trống";
      } else if (!phoneRegex.test(passenger.phone)) {
        errors[`${prefix}.phone`] = "Số điện thoại không hợp lệ (phải đủ 10 số)";
      }
    }
  };

  const passengerTypes = ["adults", "children", "infants"];
  passengerTypes.forEach((type) => {
    const passengers = passengerDetails[type];
    if (Array.isArray(passengers)) {
      passengers.forEach((passenger, index) => {
        validatePassenger(passenger, type, index);
      });
    }
  });

  return errors;
};
