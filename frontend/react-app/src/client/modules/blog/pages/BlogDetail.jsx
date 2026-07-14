import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Breadcrumb } from "../../../shared";
import { BlogSidebar } from "../components";

function BlogDetail() {
    const { slug } = useParams(); // Lấy slug từ URL
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    // MOCK DATA CÓ THÊM TRƯỜNG 'content' (Nội dung chi tiết)
    const mockBlogs = [
        {
            id: 1,
            title: "Kinh nghiệm du lịch Sapa mùa lúa chín tuyệt đẹp",
            slug: "kinh-nghiem-du-lich-sapa-mua-lua-chin",
            thumbnail:
                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
            description:
                "Sapa tháng 9, tháng 10 khoác lên mình màu áo vàng rực rỡ của những thửa ruộng bậc thang...",
            content: `
        <p>Sapa vào những ngày thu tháng 9, tháng 10 luôn là điểm đến hấp dẫn du khách bởi vẻ đẹp lộng lẫy của mùa lúa chín. Lúc này, cả thung lũng Mường Hoa như được khoác lên mình một tấm áo choàng màu vàng óng ả, rực rỡ dưới ánh nắng.</p>
        <h3>1. Thời điểm lý tưởng nhất</h3>
        <p>Để săn được những bức ảnh lúa chín đẹp nhất, bạn nên đến Sapa vào khoảng giữa tháng 9 đến đầu tháng 10. Đây là lúc lúa chín rộ và bà con bắt đầu thu hoạch.</p>
        <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80" alt="Sapa lúa chín" />
        <h3>2. Những điểm ngắm lúa chín không thể bỏ lỡ</h3>
        <ul>
          <li><strong>Bản Cát Cát:</strong> Cách trung tâm thị xã không xa, rất tiện di chuyển.</li>
          <li><strong>Thung lũng Mường Hoa:</strong> Nơi có những thửa ruộng bậc thang trải dài đẹp nhất Sapa.</li>
          <li><strong>Bản Tả Van, Tả Phìn:</strong> Khung cảnh yên bình, hoang sơ và ít bị thương mại hóa.</li>
        </ul>
        <p>Hãy chuẩn bị máy ảnh, trang phục thoải mái và thuê một chiếc xe máy để tự do khám phá mọi ngóc ngách của Sapa nhé!</p>
      `,
            author: "Hải Nam",
            createdAt: "2026-06-21T15:45:37",
        },
        {
            id: 2,
            title: "Lịch trình vi vu Đà Nẵng – Hội An 4 ngày 3 đêm",
            slug: "lich-trinh-vi-vu-da-nang-hoi-an-4n3d",
            thumbnail:
                "https://images.unsplash.com/photo-1557315360-6a350ab4eccd?auto=format&fit=crop&w=1200&q=80",
            description:
                "Bạn đang lên kế hoạch khám phá miền Trung? Lưu ngay lịch trình chi tiết từ ăn uống, di chuyển...",
            content: "<p>Nội dung bài viết về Đà Nẵng - Hội An...</p>",
            author: "Lan Anh",
            createdAt: "2026-06-20T10:30:00",
        },
        // Các bài viết khác tương tự...
    ];

    // Giả lập Fetch Data từ API
    useEffect(() => {
        setLoading(true);
        // Cuộn lên đầu trang khi vào chi tiết
        window.scrollTo(0, 0);

        const timer = setTimeout(() => {
            const foundBlog = mockBlogs.find((b) => b.slug === slug);
            setBlog(foundBlog);
            setLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [slug]);

    // Format ngày
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return (
            <div className="client-loading-state" style={{ height: "60vh" }}>
                <div className="client-spinner"></div>
                <p>Đang tải nội dung bài viết...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="search-empty-state" style={{ margin: "100px auto" }}>
                <h3>Không tìm thấy bài viết!</h3>
                <p>Bài viết có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
                <Link to="/blog" className="btn-view-all">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    // Lấy danh sách bài viết mới nhất cho Sidebar (Loại trừ bài hiện tại)
    const recentBlogs = mockBlogs.filter((b) => b.id !== blog.id).slice(0, 4);

    return (
        <div className="page-wrapper">
            <Breadcrumb
                title="Chi tiết bài viết"
                thumbnail={blog.thumbnail}
                list={[
                    { title: "Trang chủ", url: "/" },
                    { title: "Tin tức", url: "/blogs" },
                    { title: blog.title, url: `/blog/detail/${blog.slug}` },
                ]}
            />

            <div className="container bd-container">
                <div className="bd-layout">
                    {/* CỘT TRÁI: Nội dung chi tiết */}
                    <main className="bd-main">
                        <div className="bd-article">
                            <h1 className="bd-title">{blog.title}</h1>

                            <div className="bd-meta">
                                <span className="meta-item">
                                    <i className="fa-regular fa-calendar"></i>{" "}
                                    {formatDate(blog.createdAt)}
                                </span>
                                <span className="meta-item">
                                    <i className="fa-regular fa-eye"></i> 1,234 lượt xem
                                </span>
                            </div>

                            <div className="bd-thumbnail">
                                <img src={blog.thumbnail} alt={blog.title} />
                            </div>

                            <div
                                className="bd-content-html"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            ></div>

                            {/* Nút chia sẻ mạng xã hội */}
                            <div className="bd-share">
                                <span>Chia sẻ bài viết:</span>
                                <button className="share-btn fb">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </button>
                                <button className="share-btn tw">
                                    <i className="fa-brands fa-twitter"></i>
                                </button>
                                <button className="share-btn link">
                                    <i className="fa-solid fa-link"></i>
                                </button>
                            </div>
                        </div>
                    </main>

                    {/* CỘT PHẢI: Sidebar bài viết mới */}
                    <BlogSidebar recentBlogs={recentBlogs} />
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;
