import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "../../../shared";
import { buildBookingBreadcrumb } from "../../../utils/breadcrumb.helper";
import { BookingStepper, BookingSidebar } from "../components";
import { validateBookingStep1 } from "../validations/booking.validator";
import {
  createBookingService,
  checkCouponService,
  createVnPayUrlService,
} from "../services";
import { formatPrice } from "../../../utils/format.helper";

function OrderBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationStateRef = useRef(location.state);

  const {
    tour = {},
    selectedDate = {},
    passengers = { adults: 1, children: 0, infants: 0 },
  } = location.state || {};

  const breadcrumbData = {
    title: tour?.title || "Đặt tour",
    thumbnail:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    list: buildBookingBreadcrumb(tour),
  };

  const [adultCount, setAdultCount] = useState(passengers.adults || 1);
  const [childCount, setChildCount] = useState(passengers.children || 0);
  const [infantCount, setInfantCount] = useState(passengers.infants || 0);
  const [payment_type, setPaymentType] = useState(
    location.state?.payment_type || "100",
  );
  const [payment_method, setPaymentMethod] = useState(
    location.state?.payment_method || "",
  );

  // Mã giảm giá chỉ dùng để hiển thị trước cho khách, backend sẽ kiểm tra lại.
  const [promoCode, setPromoCode] = useState(location.state?.promoCode || "");
  const [discount, setDiscount] = useState(location.state?.discount || 0);
  const [coupon_id, setCouponId] = useState(location.state?.coupon_id || null);

  const initialPassengerDetails = {
    adults: Array.from({ length: passengers.adults || 1 }).map(() => ({
      full_name: "",
      dob: "",
      gender: "Nam",
      phone: "",
      identity_card: "",
    })),
    children: Array.from({ length: passengers.children || 0 }).map(() => ({
      full_name: "",
      dob: "",
      gender: "Nam",
      identity_card: "",
    })),
    infants: Array.from({ length: passengers.infants || 0 }).map(() => ({
      full_name: "",
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
        full_name: loggedUser?.full_name || "",
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
    locationStateRef.current = location.state;
  }, [location.state]);

  useEffect(() => {
    navigate(location.pathname, {
      replace: true,
      state: {
        ...locationStateRef.current,
        passengers: {
          adults: adultCount,
          children: childCount,
          infants: infantCount,
        },
        formData,
        promoCode,
        discount,
        coupon_id,
        payment_type,
        payment_method,
      },
    });
  }, [
    adultCount,
    childCount,
    infantCount,
    formData,
    promoCode,
    discount,
    coupon_id,
    payment_type,
    payment_method,
    location.pathname,
    navigate,
  ]);

  const price_adult = Number(selectedDate.newPriceAdult) || 0;
  const priceChild = Number(selectedDate.newPriceChildren) || 0;
  const priceInfant = Number(selectedDate.newPriceBaby) || 0;

  const subtotal =
    adultCount * price_adult +
    childCount * priceChild +
    infantCount * priceInfant;

  const total = Math.max(Math.round(subtotal - discount), 0);
  const payable_amount = payment_type === "50" ? Math.ceil(total * 0.5) : total;
  const remainingAmount = Math.max(total - payable_amount, 0);

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
              full_name: "",
              dob: "",
              gender: "Nam",
              phone: "",
              identity_card: "",
            }
            : { full_name: "", dob: "", gender: "Nam", identity_card: "" };

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
      const response = await checkCouponService({ code, sub_total: subtotal });
      if (response.success && response.data) {
        setDiscount(response.data.discount);
        setCouponId(response.data.coupon_id);
        toast.success(response.message);
      } else {
        setDiscount(0);
        setCouponId(null);
        toast.error(response.message || "Mã giảm giá không hợp lệ");
      }
    } catch {
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

  const startVnPayPayment = async (booking_code) => {
    const paymentResponse = await createVnPayUrlService(booking_code);
    const paymentUrl = paymentResponse?.data?.paymentUrl;

    if (!paymentResponse?.success || !paymentUrl) {
      toast.error(
        paymentResponse?.message || "Không thể khởi tạo thanh toán VNPAY",
      );
      return false;
    }

    toast.success("Đang chuyển đến cổng thanh toán VNPAY...");
    window.location.assign(paymentUrl);
    return true;
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
          payment_type,
          payment_method,
        },
      });
      return;
    }

    if (currentStep === 2) {
      if (!payment_method) {
        toast.error("Vui lòng chọn phương thức thanh toán!");
        return;
      }

      if (isSubmitting) return;

      if (location.state?.booking_code) {
        if (payment_method === "vnpay") {
          setIsSubmitting(true);
          try {
            await startVnPayPayment(location.state.booking_code);
          } catch (error) {
            console.error("Lỗi khởi tạo thanh toán VNPAY:", error);
            toast.error("Lỗi kết nối khi khởi tạo thanh toán VNPAY");
          } finally {
            setIsSubmitting(false);
          }
          return;
        }

        toast.error("Đơn đặt tour đã được tạo thành công!");
        navigate("/booking/success", { replace: true, state: location.state });
        return;
      }

      setIsSubmitting(true);

      const payload = {
        full_name: formData.contact.full_name,
        phone: formData.contact.phone,
        email: formData.contact.email,
        address: formData.contact.address,
        departure_id: selectedDate.departure_id || selectedDate.id,
        quantity_adult: adultCount,
        quantity_children: childCount,
        quantity_baby: infantCount,
        coupon_id: coupon_id,
        note: formData.note,
        payment_method,
        payment_type,
        passengers: [
          ...formData.passengerDetails.adults.map((passenger) => ({
            ...passenger,
            passenger_type: "adult",
          })),
          ...(formData?.passengerDetails?.children || []).map((passenger) => ({
            ...passenger,
            passenger_type: "child",
          })),
          ...formData.passengerDetails.infants.map((passenger) => ({
            ...passenger,
            passenger_type: "baby",
          })),
        ],
      };

      try {
        const data = await createBookingService(payload);

        if (data.success) {
          const bookingResult = data.data || {};
          const successState = {
            ...location.state,
            booking_code: bookingResult.booking_code,
            passengers: {
              adults: bookingResult.quantity_adult ?? adultCount,
              children: bookingResult.quantity_children ?? childCount,
              infants: bookingResult.quantity_baby ?? infantCount,
            },
            subtotal: bookingResult.sub_total ?? subtotal,
            coupon_id: bookingResult.coupon_id ?? coupon_id,
            discount: bookingResult.discount ?? discount,
            total: bookingResult.total ?? total,
            payable_amount: bookingResult.payable_amount ?? payable_amount,
            remainingAmount: bookingResult.remainingAmount ?? remainingAmount,
            payment_type: bookingResult.payment_type ?? payment_type,
            payment_method: bookingResult.payment_method ?? payment_method,
            formData,
          };

          if (payment_method === "vnpay") {
            // Lưu booking_code vào history state để người dùng có thể bấm lại
            // nếu bước tạo URL VNPAY gặp lỗi mạng sau khi booking đã được tạo.
            navigate(location.pathname, {
              replace: true,
              state: successState,
            });
            await startVnPayPayment(bookingResult.booking_code);
            return;
          }

          toast.success("Đặt tour thành công!");
          navigate("/booking/success", {
            replace: true,
            state: successState,
          });
        } else {
          toast.error(data.message || "Đặt tour thất bại");
        }
      } catch {
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
        payment_type,
        payment_method,
      },
    });
  };

  return (
    <div className="booking-page-wrapper">
      <Breadcrumb
        title={breadcrumbData.title}
        list={breadcrumbData.list}
        thumbnail={breadcrumbData.thumbnail}
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
                payment_type,
                setPaymentType,
                payment_method,
                setPaymentMethod,
              }}
            />
          </div>

          {currentStep < 3 && (
            <BookingSidebar
              tourImage={tour.thumbnail}
              tourTitle={tour.title}
              tour_code={tour.id}
              transport={selectedDate.vehicleName || "Đang cập nhật"}
              departure={selectedDate.departure_from || "Chưa cập nhật"}
              selectedDate={selectedDate.start_date}
              adultCount={adultCount}
              childCount={childCount}
              infantCount={infantCount}
              price_adult={price_adult}
              priceChild={priceChild}
              priceInfant={priceInfant}
              subtotal={subtotal}
              discount={discount}
              total={total}
              payable_amount={payable_amount}
              remainingAmount={remainingAmount}
              payment_type={payment_type}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              isPromoApplied={Boolean(coupon_id)}
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
