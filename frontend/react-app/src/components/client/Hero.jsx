function Hero() {
  return (
    <section className="hero">
      {/* Container căn giữa nội dung */}
      <div className="container hero-content">
        {/* Tiêu đề & Mô tả */}
        <h1 className="hero-title">
          Du lịch Châu Á - Khám phá Mỹ, Úc, Âu <br />
          Đi nơi đâu bạn muốn
        </h1>
        <p className="hero-desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p>

        {/* Khối Tìm Kiếm */}
        <div className="hero-search-box">
          {/* Hàng 1: Bạn muốn đi đâu? */}
          <div className="search-row">
            <div className="search-input-group full-width">
              <i className="fa-solid fa-location-dot icon-left"></i>
              <input type="text" placeholder="Bạn muốn đi đâu?" />
              <i className="fa-solid fa-chevron-down icon-right"></i>
            </div>
          </div>

          {/* Hàng 2: Số lượng, Lịch khởi hành, Nút tìm kiếm */}
          <div className="search-row grid-3">
            {/* Input Số lượng */}
            <div className="search-input-group">
              <i className="fa-regular fa-user icon-left"></i>
              <input type="text" placeholder="Số lượng" />
              <i className="fa-solid fa-chevron-down icon-right"></i>
            </div>

            {/* Input Lịch khởi hành */}
            <div className="search-input-group">
              <i className="fa-regular fa-calendar icon-left"></i>
              <input type="date" placeholder="Lịch khởi hành" />
            </div>

            {/* Nút Tìm kiếm */}
            <button className="btn-search">
              <i className="fa-solid fa-magnifying-glass"></i> Tìm Kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
