function BannerAd() {
  return (
    <section className="banner-ad">
      <div className="container">
        {/* Dùng thẻ <a> bọc ngoài để banner có thể click được */}
        <a href="#" className="banner-ad__link">
          <img
            // Tạm thời dùng ảnh chữ nhật giả lập, bạn thay bằng link ảnh Nam Du thật nhé
            src="https://saigontourist.net/_next/image?url=https%3A%2F%2Fsaigontourist.net%2Fstorage%2Fmedia%2Fbanner-chau-au_1777017921.png&w=1920&q=75"
            alt="Siêu bão Tour đảo Nam Du"
            className="banner-ad__img"
          />
        </a>
      </div>
    </section>
  );
}

export default BannerAd;
