import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, FolderTree, Calendar, Ticket,
  ShoppingCart, FileText, Users, MessageSquare, Image as ImageIcon, LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý Tour", href: "/admin/tours", icon: MapPin },
  { name: "Danh mục", href: "/admin/categories", icon: FolderTree },
  { name: "Lịch khởi hành", href: "/admin/departures", icon: Calendar },
  { name: "Mã giảm giá", href: "/admin/discounts", icon: Ticket },
  { name: "Đơn đặt vé", href: "/admin/bookings", icon: ShoppingCart },
  { name: "Bài viết", href: "/admin/blogs", icon: FileText },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Đánh giá", href: "/admin/reviews", icon: MessageSquare },
  { name: "Banner", href: "/admin/banners", icon: ImageIcon },
];

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

return (
    <div className="flex h-screen bg-gray-50 overflow-hidden px-5" >
      <div className="w-50 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
        
        {/* Container chung cho tất cả các khối để đồng bộ lề trái */}
        <div className="flex flex-col h-full">
            
            {/* Header */}
            <div className="h-20 border-b border-gray-200 flex flex-col justify-center shrink-0">
              <h1 className="font-bold text-xl text-blue-600">Tour Admin</h1>
              <p className="text-sm text-gray-500 mt-1">Quản trị viên</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 ">
              <ul className="flex flex-col ">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium w-full",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-base font-medium">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
<div className="border-t border-gray-200 h-30 py-6  shrink-0 flex flex-col gap-2">
  
  {/* Phần trên: Thông tin User */}
  <div className="flex  gap-3" >
    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
      A
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
      <p className="text-xs text-gray-500 truncate">admin@tour.com</p>
    </div>
  </div>

  {/* Phần dưới: Nút Đăng xuất được đẩy xuống */}
  <div className="flex-1 flex flex-col mb-8" >
    <button
      onClick={handleLogout}
      className="flex  py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors font-medium "
    >
      <LogOut className="w-4 h-4" />
      Đăng xuất
    </button>
  </div>
</div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}