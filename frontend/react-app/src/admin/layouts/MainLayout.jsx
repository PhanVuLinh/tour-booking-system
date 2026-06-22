import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderTree, Calendar, Ticket, BusFront,
  ShoppingCart, FileText, Users, MessageSquare, Image as ImageIcon, LogOut,
} from "lucide-react";

import { getMeService } from "../modules/login/services/authService"; 

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý Tour", href: "/admin/tours", icon: MapPin },
  { name: "Danh mục", href: "/admin/categories", icon: FolderTree },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Lịch khởi hành", href: "/admin/departures", icon: Calendar },
  { name: "Phương tiện", href: "/admin/vehicles", icon: BusFront },
  { name: "Mã giảm giá", href: "/admin/discounts", icon: Ticket },
  { name: "Đơn đặt vé", href: "/admin/bookings", icon: ShoppingCart },
  { name: "Bài viết", href: "/admin/blogs", icon: FileText },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquare },
  { name: "Banner", href: "/admin/banners", icon: ImageIcon },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMeService();
        setUser(userData);
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng", error);

      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken"); 
      navigate("/admin/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 px-4">
        
        <div className="flex flex-col h-full">
            
          <div className="h-20 border-b border-gray-200 flex flex-col justify-center shrink-0">
            <h1 className="font-bold text-xl text-blue-600">Tour Admin</h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.role === "ADMIN" ? "Quản trị viên" : "Nhân viên"}
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-4 py-3 px-3 rounded-lg text-sm transition-all duration-200 font-medium w-full ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-base font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 py-6 shrink-0 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? user.fullName : "Đang tải..."}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user ? user.email : ""}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium w-full"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="text-base">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}