import { useState, useRef, useEffect } from "react";

function Promotions() {
  const banners = [
    {
      id: 1,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260505_resize-banner-tour-nuoc-ngoai.webp",
    },
    {
      id: 2,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260416_bn260410bannerwebmoiesg.webp",
    },
    {
      id: 3,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260505_resize-banner-tour-nuoc-ngoai.webp",
    },
    {
      id: 4,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260416_bn260410bannerwebmoiesg.webp",
    },
    {
      id: 5,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260505_resize-banner-tour-nuoc-ngoai.webp",
    },
    {
      id: 6,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260416_bn260410bannerwebmoiesg.webp",
    },
    {
      id: 7,
      image:
        "https://s3-cmc.travel.com.vn/vtv-image/Images/Advertisings/bn_260505_resize-banner-tour-nuoc-ngoai.webp",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  // --- CÔNG THỨC CHIA TRANG ---
  const itemsPerPage = 3;
  // Làm tròn lên (Ví dụ: 7 ảnh / 3 = 2.33 -> 3 chấm)
  const totalDots = Math.ceil(banners.length / itemsPerPage);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollPosition = container.scrollLeft;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((bannerItem, index) => {
      const bannerPosition = bannerItem.offsetLeft - container.offsetLeft;
      const distance = Math.abs(bannerPosition - scrollPosition);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentIndex(closestIndex);
  };

  const handleDotClick = (dotIndex) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;

    // Tính toán cái ảnh đầu tiên của cái chấm được bấm
    // Ví dụ: Bấm chấm số 1 -> Ảnh mục tiêu là 1 * 3 = 3 (Ảnh số 4)
    const targetImageIndex = dotIndex * itemsPerPage;
    const targetBanner = container.children[targetImageIndex];

    if (targetBanner) {
      container.scrollTo({
        left: targetBanner.offsetLeft - container.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Nếu tổng số ảnh còn không bằng đủ 1 trang (<= 3) thì khỏi cần trượt tự động
    if (banners.length <= itemsPerPage) return;

    const autoPlayTimer = setInterval(() => {
      if (!sliderRef.current) return;
      const container = sliderRef.current;

      const nextIndex =
        currentIndex === banners.length - 1 ? 0 : currentIndex + 1;
      const nextBanner = container.children[nextIndex];

      if (nextBanner) {
        container.scrollTo({
          left: nextBanner.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(autoPlayTimer);
  }, [currentIndex, banners.length]);

  return (
    <section className="promotions">
      <div className="container">
        <h2 className="section-title">
          Khuyến Mại Bùng Nổ - Đánh Tan Nóng Bức
        </h2>

        <div className="promo-grid" ref={sliderRef} onScroll={handleScroll}>
          {banners.map((banner) => (
            <div className="promo-item" key={banner.id}>
              <img src={banner.image} alt={`Khuyến mại ${banner.id}`} />
            </div>
          ))}
        </div>

        {/* Nếu số chấm lớn hơn 1 thì mới hiển thị khối dots */}
        {totalDots > 1 && (
          <div className="promo-dots">
            {/* Tạo ra một mảng ảo có độ dài bằng "totalDots" để vòng lặp chạy */}
            {Array.from({ length: totalDots }).map((_, dotIndex) => (
              <span
                key={dotIndex}
                // Tính xem chấm nào đang active: Lấy vị trí ảnh hiện tại chia 3 rồi làm tròn xuống
                className={`dot ${Math.floor(currentIndex / itemsPerPage) === dotIndex ? "active" : ""}`}
                onClick={() => handleDotClick(dotIndex)}
              ></span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Promotions;
