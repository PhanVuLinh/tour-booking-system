function BannerAd() {
  return (
    <section className="banner-ad">
      <div className="container">
        {/* Dùng thẻ <a> bọc ngoài để banner có thể click được */}
        <a href="#" className="banner-ad__link">
          <img
            // Tạm thời dùng ảnh chữ nhật giả lập, bạn thay bằng link ảnh Nam Du thật nhé
            src="http://res.cloudinary.com/dlxbhq8pw/image/upload/v1786988482/jxgll69hvvxyrqxfesug.jpg"
            alt="Siêu bão Tour đảo Nam Du"
            className="banner-ad__img"
          />
        </a>
      </div>
    </section>
  );
}

export default BannerAd;
