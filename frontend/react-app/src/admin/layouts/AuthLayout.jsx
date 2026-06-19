import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const token = localStorage.getItem("accessToken");

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[500px]">
                <div className="hidden md:flex flex-col justify-center w-1/2 bg-blue-600 p-10 text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] 
                      bg-cover bg-center opacity-30 mix-blend-overlay"
          ></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              Hệ thống quản lý <br /> Tour Booking
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Nền tảng vận hành và quản lý đặt tour thông minh, nhanh chóng và bảo mật.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-blue-200">
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Quản lý dễ dàng
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Bảo mật cao
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-sm mx-auto">
            
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Chào mừng trở lại</h2>
              <p className="text-gray-500 mt-2 text-sm">Vui lòng nhập thông tin để truy cập hệ thống.</p>
            </div>

            <Outlet />

          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthLayout;