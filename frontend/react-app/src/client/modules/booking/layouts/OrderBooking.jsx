import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "../../../shared";
import { buildBookingBreadcrumb } from "../../../utils/breadcrumb.helper";
import { BookingStepper, BookingSidebar } from "../components";
import { validateBookingStep1 } from "../validations/booking.validator";

function OrderBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    tour = {},
    selectedDate = {},
    passengers = { adults: 1, children: 0, infants: 0 },
  } = location.state || {};

  const breadcrumbData = {
    title: tour?.title || "Đặt tour",
    image:
      tour?.thumbnail ||
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    list: buildBookingBreadcrumb(tour),
  };

  const [adultCount, setAdultCount] = useState(passengers.adults || 1);
  const [childCount, setChildCount] = useState(passengers.children || 0);
  const [infantCount, setInfantCount] = useState(passengers.infants || 0);

  //Mã giảm giá
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || "");
  const [discountAmount, setDiscountAmount] = useState(location.state?.discountAmount || 0);

  const initialPassengerDetails = {
    adults: Array.from({ length: passengers.adults || 1 }).map(() => ({ fullName: "", dob: "", gender: "Nam", phone: "" })),
    children: Array.from({ length: passengers.children || 0 }).map(() => ({ fullName: "", dob: "", gender: "Nam" })),
    infants: Array.from({ length: passengers.infants || 0 }).map(() => ({ fullName: "", dob: "", gender: "Nam" })),
  };

  const [formData, setFormData] = useState(() => {
    const existing = location.state?.formData;
    // Nếu đã có passengerDetails trong state cũ thì dùng lại, nếu không thì khởi tạo mới
    if (existing?.passengerDetails) return existing;
    return {
      contact: existing?.contact || { fullName: "", phone: "", email: "", address: "" },
      note: existing?.note || "",
      passengerDetails: initialPassengerDetails,
    };
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Đồng bộ lại state vào React Router history để khi F5 không bị mất dữ liệu
    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        passengers: {
          adults: adultCount,
          children: childCount,
          infants: infantCount,
        },
        formData: formData,
        promoCode: promoCode,
        discountAmount: discountAmount,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adultCount, childCount, infantCount, formData, promoCode, discountAmount]);

  const priceAdult = Number(selectedDate.newPriceAdult) || 0;
  const priceChild = Number(selectedDate.newPriceChildren) || 0;
  const priceInfant = Number(selectedDate.newPriceBaby) || 0;

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " đ";

  const subtotal =
    adultCount * priceAdult +
    childCount * priceChild +
    infantCount * priceInfant;

  const finalPrice = Math.max(subtotal - discountAmount, 0);

  const currentStep = location.pathname.includes("/success")
    ? 3
    : location.pathname.includes("/payment")
      ? 2
      : 1;

  const updatePassenger = (type, action) => {
    let groupKey = type === "adult" ? "adults" : type === "child" ? "children" : "infants";
    let isAdd = action === "add";

    if (type === "adult") {
      if (!isAdd && adultCount <= 1) return;
      setAdultCount((prev) => prev + (isAdd ? 1 : -1));
    } else if (type === "child") {
      if (!isAdd && childCount <= 0) return;
      setChildCount((prev) => prev + (isAdd ? 1 : -1));
    } else if (type === "infant") {
      if (!isAdd && infantCount <= 0) return;
      setInfantCount((prev) => prev + (isAdd ? 1 : -1));
    }

    setFormData((prev) => {
      const currentList = prev.passengerDetails?.[groupKey] || [];
      if (isAdd) {
        const newPassenger =
          type === "adult"
            ? { fullName: "", dob: "", gender: "Nam", phone: "" }
            : { fullName: "", dob: "", gender: "Nam" };
        return {
          ...prev,
          passengerDetails: {
            ...prev.passengerDetails,
            [groupKey]: [...currentList, newPassenger],
          },
        };
      } else {
        return {
          ...prev,
          passengerDetails: {
            ...prev.passengerDetails,
            [groupKey]: currentList.slice(0, -1),
          },
        };
      }
    });
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setDiscountAmount(0);
      return;
    }
    if (code === "GIAM10") {
      setDiscountAmount(Math.min(subtotal * 0.1, subtotal));
      return;
    }
    if (code === "GIAM500K") {
      setDiscountAmount(Math.min(500000, subtotal));
      return;
    }
    setDiscountAmount(0);
    alert("Mã giảm giá không hợp lệ");
  };

  const handleNextStep = () => {
    const currentPassengers = {
      adults: adultCount,
      children: childCount,
      infants: infantCount,
    };

    if (currentStep === 1) {
      const errors = validateBookingStep1(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);

        const contactErrors = Object.entries(errors).filter(([k]) => k.startsWith("contact."));
        const passengerErrors = Object.entries(errors).filter(([k]) => k.startsWith("passengerDetails."));

        if (contactErrors.length > 0) {
          // Lấy message lỗi đầu tiên trong nhóm contact
          toast.error(`Thông tin liên lạc: ${contactErrors[0][1]}`);
        }
        if (passengerErrors.length > 0) {
          // Lấy message lỗi đầu tiên trong nhóm hành khách
          toast.error(`Thông tin hành khách: ${passengerErrors[0][1]}`);
        }
        return;
      }
      setFormErrors({});
      toast.success("Thông tin hợp lệ!");
      navigate("/booking/payment", {
        state: { ...location.state, passengers: currentPassengers, formData },
      });
      return;
    }
    if (currentStep === 2) {
      navigate("/booking/success", {
        state: {
          ...location.state,
          passengers: currentPassengers,
          subtotal,
          discountAmount,
          finalPrice,
        },
      });
      return;
    }
    navigate("/");
  };

  const handleBackStep = () => {
    navigate("/booking/info", {
      state: {
        ...location.state,
        passengers: {
          adults: adultCount,
          children: childCount,
          infants: infantCount,
        },
      },
    });
  };

  return (
    <div className="booking-page-wrapper">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        image={breadcrumbData.image}
      />

      <div className="b-container">
        <div className="b-page-header-flex">
          <div className="b-page-title">
            <h2>Đặt tour của bạn</h2>
            <p>
              Hãy đảm bảo tất cả thông tin chi tiết trên trang này đã chính xác
              trước khi tiến hành thanh toán.
            </p>
          </div>

          <BookingStepper currentStep={currentStep} />
        </div>

        <div className="booking-layout">
          <div className="b-left">
            <Outlet
              context={{
                adultCount,
                childCount,
                infantCount,
                updatePassenger,
                formData,
                setFormData,
                formErrors,
              }}
            />
          </div>

          <BookingSidebar
            tourImage={tour.thumbnail}
            tourTitle={tour.title}
            tourCode={tour.id}
            transport={selectedDate.vehicleName || "Đang cập nhật"}
            departure={selectedDate.departureFrom || "Chưa cập nhật"}
            selectedDate={selectedDate.startDate}
            adultCount={adultCount}
            childCount={childCount}
            infantCount={infantCount}
            priceAdult={priceAdult}
            priceChild={priceChild}
            priceInfant={priceInfant}
            subtotal={subtotal}
            discountAmount={discountAmount}
            finalPrice={finalPrice}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            formatPrice={formatPrice}
            currentStep={currentStep}
            handleApplyPromo={handleApplyPromo}
            handleNextStep={handleNextStep}
            handleBackStep={handleBackStep}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderBooking;
