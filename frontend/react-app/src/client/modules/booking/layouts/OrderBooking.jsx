import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Breadcrumb } from "../../../shared";

import { BookingStepper, BookingSidebar } from "../components";

function OrderBooking() {
  const breadcrumbData = {
    title: "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
    list: [
      { url: "/", title: "Trang Chủ" },
      { url: "/tours", title: "Tour Trong Nước" },
      { url: "#", title: "Tour Miền Bắc" },
      {
        url: "#",
        title: "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
      },
      { title: "Đặt tour" },
    ],
  };

  const location = useLocation();
  const navigate = useNavigate();

  const {
    adults = 1,
    children = 0,
    infants = 0,
    selectedDate = { dayMonth: "22/08", year: "2026" },
    tourCode = "28T00001",
    transport = "Ô tô 45 chỗ",
    departure = "Hà Nội",
    tourTitle = "Tour Hà Nội - Ninh Bình - Hạ Long - Yên Tử - Sapa | 6N5Đ",
    tourImage = "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1920&q=80",
  } = location.state || {};

  const [adultCount, setAdultCount] = useState(adults);
  const [childCount, setChildCount] = useState(children);
  const [infantCount, setInfantCount] = useState(infants);

  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const priceAdult = 10000000;
  const priceChild = 7990000;
  const priceInfant = 5990000;

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN").format(price) + " đ";

  const subtotal = useMemo(() => {
    return (
      adultCount * priceAdult +
      childCount * priceChild +
      infantCount * priceInfant
    );
  }, [adultCount, childCount, infantCount]);

  const finalPrice = Math.max(subtotal - discountAmount, 0);

  const currentStep = location.pathname.includes("/success")
    ? 3
    : location.pathname.includes("/payment")
      ? 2
      : 1;
  const updatePassenger = (type, action) => {
    if (type === "adult") {
      setAdultCount((prev) =>
        action === "add" ? prev + 1 : Math.max(1, prev - 1),
      );
    } else if (type === "child") {
      setChildCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    } else if (type === "infant") {
      setInfantCount((prev) =>
        action === "add" ? prev + 1 : Math.max(0, prev - 1),
      );
    }
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
    if (currentStep === 1) {
      navigate("/booking/payment", {
        state: {
          ...location.state,
          adults: adultCount,
          children: childCount,
          infants: infantCount,
        },
      });
      window.scrollTo(0, 0);
      return;
    }

    if (currentStep === 2) {
      navigate("/booking/success", {
        state: {
          ...location.state,
          adults: adultCount,
          children: childCount,
          infants: infantCount,
          subtotal,
          discountAmount,
          finalPrice,
        },
      });
      window.scrollTo(0, 0);
      return;
    }

    navigate("/");
  };

  const handleBackStep = () => {
    navigate("/booking/info", {
      state: {
        ...location.state,
        adults: adultCount,
        children: childCount,
        infants: infantCount,
      },
    });
    window.scrollTo(0, 0);
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

          {/* THANH TIẾN TRÌNH ĐỘNG DỰA THEO currentStep */}
          <BookingStepper currentStep={currentStep} />
        </div>

        <div className="booking-layout">
          {/* CỘT TRÁI: THAY ĐỔI RUỘT ĐỘNG THEO TRẠNG THÁI currentStep */}
          <div className="b-left">
            <Outlet
              context={{
                adultCount,
                childCount,
                infantCount,
                updatePassenger,
              }}
            />
          </div>

          {/* CỘT PHẢI: GIỮ NGUYÊN (CHỈ ĐỔI TEXT NÚT BẤM) */}
          <BookingSidebar
            tourImage={tourImage}
            tourTitle={tourTitle}
            tourCode={tourCode}
            transport={transport}
            departure={departure}
            selectedDate={selectedDate}
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
