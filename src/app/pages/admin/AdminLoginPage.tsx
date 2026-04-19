import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { Coffee, Lock, User, Shield } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check credentials
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      navigate('/admin/dashboard');
    } else {
      alert('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3E2723] via-[#4E342E] to-[#3E2723] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D7CCC8] rounded-full mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-[#3E2723]" />
          </div>
          <h1 className="text-3xl text-white mb-2">Coffee POS Admin</h1>
          <p className="text-[#D7CCC8]">Đăng nhập để quản lý hệ thống</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-[#6D4C41]" />
            <h2 className="text-2xl text-gray-900">Đăng nhập</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-gray-900 mb-2 text-sm">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent"
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-900 mb-2 text-sm">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:border-transparent"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#6D4C41] hover:text-[#5D3C31] transition"
                onClick={() => alert('Vui lòng liên hệ quản trị viên hệ thống')}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#6D4C41] to-[#8D6E63] text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-xl hover:from-[#5D3C31] hover:to-[#7D5E53] transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Shield className="w-5 h-5" />
              Đăng nhập
            </button>
          </form>

          {/* Back to Customer */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/menu')}
              className="text-sm text-gray-600 hover:text-[#6D4C41] transition"
            >
              <Coffee className="w-4 h-4 inline mr-1" />
              Quay về trang khách hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
