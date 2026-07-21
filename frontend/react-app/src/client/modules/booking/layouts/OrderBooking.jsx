import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "../../../shared";
import { buildBookingBreadcrumb } from "../../../utils/breadcrumb.helper";
import { BookingStepper, BookingSidebar } from "../components";
import { validateBookingStep1 } from "../validations/booking.validator";
import { createBookingService, checkCouponService } from "../services";

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
  const [paymentType, setPaymentType] = useState(
    location.state?.paymentType || "100",
  );
  const [paymentMethod, setPaymentMethod] = useState(
    location.state?.paymentMethod || "",
  );

  // Mã giảm giá chỉ dùng để hiển thị trước cho khách, backend sẽ kiểm tra lại.
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || "");
  const [discount, setDiscount] = useState(location.state?.discount || 0);
  const [couponId, setCouponId] = useState(location.state?.couponId || null);

  const initialPassengerDetails = {
    adults: Array.from({ length: passengers.adults || 1 }).map(() => ({
      fullName: "",
      dob: "",
      gender: "Nam",
      phone: "",
      identity_card: "",
    })),
    children: Array.from({ length: passengers.children || 0 }).map(() => ({
      fullName: "",
      dob: "",
      gender: "Nam",
      identity_card: "",
    })),
    infants: Array.from({ length: passengers.infants || 0 }).map(() => ({
      fullName: "",
      dob: "",
      gender: "Nam",
      identity_card: "",
    })),
  };

  const [formData, setFormData] = useState(() => {
    const existing = location.state?.formData;
    if (existing?.passengerDetails) return existing;

    const userStr = localStorage.getItem("user");
    const loggedUser = userStr ? JSON.parse(userStr) : null;

    return {
      contact: existing?.contact || {
        fullName: loggedUser?.fullName || "",
        phone: loggedUser?.phone || "",
        email: loggedUser?.email || "",
        address: "",
      },
      note: existing?.note || "",
      passengerDetails: initialPassengerDetails,
    };
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        passengers: {
          adults: adultCount,
          children: childCount,
          infants: infantCount,
        },
        formData,
        promoCode,
        discount,
        couponId,
        paymentType,
        paymentMethod,
      },
    });
  }, [
    adultCount,
    childCount,
    infantCount,
    formData,
    promoCode,
    discount,
    couponId,
    paymentType,
    paymentMethod,
  ]);

  const priceAdult = Number(selectedDate.newPriceAdult) || 0;
  const priceChild = Number(selectedDate.newPriceChildren) || 0;
  const priceInfant = Number(selectedDate.newPriceBaby) || 0;

  const formatPrice = (price) => price.toLocaleString("vi-VN") + " đ";

  const subtotal =
    adultCount * priceAdult +
    childCount * priceChild +
    infantCount * priceInfant;

  const total = Math.max(Math.round(subtotal - discount), 0);
  const payableAmount = paymentType === "50" ? Math.ceil(total * 0.5) : total;
  const remainingAmount = Math.max(total - payableAmount, 0);

  const currentStep = location.pathname.includes("/success")
    ? 3
    : location.pathname.includes("/payment")
      ? 2
      : 1;

  const updatePassenger = (type, action) => {
    const groupKey =
      type === "adult" ? "adults" : type === "child" ? "children" : "infants";
    const isAdd = action === "add";

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
            ? {
              fullName: "",
              dob: "",
              gender: "Nam",
              phone: "",
              identity_card: "",
            }
            : { fullName: "", dob: "", gender: "Nam", identity_card: "" };

        return {
          ...prev,
          passengerDetails: {
            ...prev.passengerDetails,
            [groupKey]: [...currentList, newPassenger],
          },
        };
      }

      return {
        ...prev,
        passengerDetails: {
          ...prev.passengerDetails,
          [groupKey]: currentList.slice(0, -1),
        },
      };
    });
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setDiscount(0);
      setCouponId(null);
      toast.error("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const response = await checkCouponService({ code, subTotal: subtotal });
      if (response.success && response.data) {
        setDiscount(response.data.discount);
        setCouponId(response.data.coupon_id);
        toast.success(response.message);
      } else {
        setDiscount(0);
        setCouponId(null);
        toast.error(response.message || "Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      setDiscount(0);
      setCouponId(null);
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setCouponId(null);
    toast.success("Đã xóa mã giảm giá");
  };

  const handleNextStep = async () => {
    const currentPassengers = {
      adults: adultCount,
      children: childCount,
      infants: infantCount,
    };

    if (currentStep === 1) {
      const errors = validateBookingStep1(formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);

        const contactErrors = Object.entries(errors).filter(([key]) =>
          key.startsWith("contact."),
        );
        const passengerErrors = Object.entries(errors).filter(([key]) =>
          key.startsWith("passengerDetails."),
        );

        if (contactErrors.length > 0) {
          toast.error(`Thông tin liên lạc: ${contactErrors[0][1]}`);
        }
        if (passengerErrors.length > 0) {
          toast.error(`Thông tin hành khách: ${passengerErrors[0][1]}`);
        }
        return;
      }

      setFormErrors({});
      toast.success("Thông tin hợp lệ!");
      navigate("/booking/payment", {
        state: {
          ...location.state,
          passengers: currentPassengers,
          formData,
          paymentType,
          paymentMethod,
        },
      });
      return;
    }

    if (currentStep === 2) {
      if (!paymentMethod) {
        toast.error("Vui lòng chọn phương thức thanh toán!");
        return;
      }

      if (isSubmitting) return;

      if (location.state?.bookingCode) {
        toast.error("Đơn đặt tour đã được tạo thành công!");
        navigate("/booking/success", { replace: true, state: location.state });
        return;
      }

      setIsSubmitting(true);

      const payload = {
        fullName: formData.contact.fullName,
        phone: formData.contact.phone,
        email: formData.contact.email,
        address: formData.contact.address,
        departure_id: selectedDate.departure_id || selectedDate.id,
        quantityAdult: adultCount,
        quantityChildren: childCount,
        quantityBaby: infantCount,
        coupon_id: couponId,
        note: formData.note,
        paymentMethod,
        paymentType,
        passengers: [
          ...formData.passengerDetails.adults.map((passenger) => ({
            ...passenger,
            passengerType: "adult",
          })),
          ...(formData?.passengerDetails?.children || []).map((passenger) => ({
            ...passenger,
            passengerType: "child",
          })),
          ...formData.passengerDetails.infants.map((passenger) => ({
            ...passenger,
            passengerType: "baby",
          })),
        ],
      };

      try {
        const data = await createBookingService(payload);

        if (data.success) {
          const bookingResult = data.data || {};
          toast.success("Đặt tour thành công!");
          navigate("/booking/success", {
            replace: true,
            state: {
              ...location.state,
              bookingCode: bookingResult.bookingCode,
              passengers: {
                adults: bookingResult.quantityAdult ?? adultCount,
                children: bookingResult.quantityChildren ?? childCount,
                infants: bookingResult.quantityBaby ?? infantCount,
              },
              subtotal: bookingResult.subTotal ?? subtotal,
              couponId: bookingResult.coupon_id ?? couponId,
              discount: bookingResult.discount ?? discount,
              total: bookingResult.total ?? total,
              payableAmount: bookingResult.payableAmount ?? payableAmount,
              remainingAmount: bookingResult.remainingAmount ?? remainingAmount,
              paymentType: bookingResult.paymentType ?? paymentType,
              paymentMethod: bookingResult.paymentMethod ?? paymentMethod,
              formData,
            },
          });
        } else {
          toast.error(data.message || "Đặt tour thất bại");
        }
      } catch (error) {
        toast.error("Lỗi kết nối đến máy chủ");
      } finally {
        setIsSubmitting(false);
      }
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
        paymentType,
        paymentMethod,
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

        <div
          className={`booking-layout ${currentStep === 3 ? "booking-layout-success" : ""}`}
        >
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
                paymentType,
                setPaymentType,
                paymentMethod,
                setPaymentMethod,
              }}
            />
          </div>

          {currentStep < 3 && (
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
              discount={discount}
              total={total}
              payableAmount={payableAmount}
              remainingAmount={remainingAmount}
              paymentType={paymentType}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              isPromoApplied={Boolean(couponId)}
              formatPrice={formatPrice}
              currentStep={currentStep}
              handleApplyPromo={handleApplyPromo}
              handleRemovePromo={handleRemovePromo}
              handleNextStep={handleNextStep}
              handleBackStep={handleBackStep}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderBooking;
